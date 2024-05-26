import os
import torch
import torch.optim as optim
from torch.optim.lr_scheduler import LambdaLR
from transformers import AutoTokenizer, AutoModelForCausalLM
from torch.utils.data import Dataset, DataLoader
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import ShardingStrategy, MixedPrecision
import torch.distributed as dist
import torch.multiprocessing as mp
from transformers.optimization import get_linear_schedule_with_warmup
from bitsandbytes.nn import Linear4bit
from safetensors.torch import save_file
from tqdm.auto import tqdm

class SimpleDataset(Dataset):
    def __init__(self, data, tokenizer):
        self.data = data
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        inputs = self.tokenizer(item, return_tensors='pt', padding='max_length', truncation=True, max_length=512)
        return inputs.input_ids.squeeze(0), inputs.attention_mask.squeeze(0), inputs.input_ids.squeeze(0)

def collate_fn(batch):
    input_ids, attention_masks, labels = zip(*batch)
    input_ids = torch.stack(input_ids)
    attention_masks = torch.stack(attention_masks)
    labels = torch.stack(labels)
    return {'input_ids': input_ids, 'attention_mask': attention_masks, 'labels': labels}

def replace_linear(module, linear_replacement, **kwargs):
    for name, child in module.named_children():
        if isinstance(child, torch.nn.Linear):
            module._modules[name] = linear_replacement(child.in_features, child.out_features, **kwargs)
        else:
            replace_linear(child, linear_replacement, **kwargs)
    return module

def ensure_uniform_dtype(model, dtype=torch.float32):
    for name, param in model.named_parameters():
        if param.dtype != dtype and not isinstance(param, Linear4bit):
            param.data = param.data.to(dtype)
    for name, buffer in model.named_buffers():
        if buffer.dtype != dtype:
            buffer.data = buffer.data.to(dtype)

def train_model(rank, world_size, args):
    os.environ['MASTER_ADDR'] = 'localhost'  # Set this to your master node's address if running on a cluster
    os.environ['MASTER_PORT'] = '12355'      # Set this to an open port

    dist.init_process_group("nccl", rank=rank, world_size=world_size)
    torch.cuda.set_device(rank)

    tokenizer = AutoTokenizer.from_pretrained(args["model_name"])
    data = ["This is a sample sentence." for _ in range(1000)]
    dataset = SimpleDataset(data, tokenizer)
    sampler = torch.utils.data.distributed.DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    dataloader = DataLoader(dataset, batch_size=args["batch_size"], sampler=sampler, collate_fn=collate_fn)

    model = AutoModelForCausalLM.from_pretrained(args["model_name"])
    model = model.to(rank)
    model = replace_linear(model, Linear4bit, quant_type='nf4')

    # Ensure uniform dtype for non-quantized parts of the model
    ensure_uniform_dtype(model, dtype=torch.float16)

    # Use mixed precision policy for FSDP
    mixed_precision_policy = MixedPrecision(
        param_dtype=torch.float16,
        reduce_dtype=torch.float16,
        buffer_dtype=torch.float16
    )

    model = FSDP(
        model,
        sharding_strategy=ShardingStrategy.FULL_SHARD,
        mixed_precision=mixed_precision_policy,
        device_id=rank
    )

    optimizer = optim.AdamW(model.parameters(), lr=args["lr"])
    lr_scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=100, num_training_steps=1000)

    model.train()
    for epoch in range(args["epochs"]):
        for batch in dataloader:
            optimizer.zero_grad()
            input_ids = batch['input_ids'].to(rank)
            attention_mask = batch['attention_mask'].to(rank)
            labels = batch['labels'].to(rank)
            with torch.cuda.amp.autocast():
                outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
                loss = outputs.loss
            loss.backward()
            optimizer.step()
            lr_scheduler.step()
        print(f"Rank {rank}, Epoch {epoch}, Loss: {loss.item()}")

    if rank == 0:
        save_file(model.state_dict(), "model_state_dict.safetensors")

    dist.destroy_process_group()

def main():
    world_size = torch.cuda.device_count()
    args = {
        "model_name": "gpt2",
        "batch_size": 4,
        "lr": 5e-5,
        "epochs": 2
    }
    mp.spawn(train_model, args=(world_size, args), nprocs=world_size, join=True)

if __name__ == "__main__":
    main()
