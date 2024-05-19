from concurrent.futures import ThreadPoolExecutor
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader, random_split

# Distributed training
from torch.utils.data.distributed import DistributedSampler
from torch.nn.parallel import DistributedDataParallel
from torch.distributed import init_process_group, destroy_process_group

import warnings
from tqdm import tqdm
import os
from pathlib import Path
import argparse

# Huggingface datasets and tokenizers
from datasets import load_dataset
from tokenizers import Tokenizer
from tokenizers.models import WordLevel
from tokenizers.trainers import WordLevelTrainer
from tokenizers.pre_tokenizers import Whitespace

import wandb
import torchmetrics

from model import build_transformer
from dataset import BilingualDataset, causal_mask
from config import get_default_config, get_weights_file_path, get_latest_weights_file_path, ModelConfig

def greedy_decode(model: nn.Module, source: torch.Tensor, source_mask: torch.Tensor, tokenizer_src: Tokenizer, tokenizer_tgt: Tokenizer, max_len: int, device: torch.device):
    sos_idx = tokenizer_tgt.token_to_id('[SOS]')
    eos_idx = tokenizer_tgt.token_to_id('[EOS]')

    # Precompute the encoder output and reuse it for every step
    encoder_output = model.encode(source, source_mask)
    # Initialize the decoder input with the sos token
    decoder_input = torch.empty(1, 1).fill_(sos_idx).type_as(source).to(device)
    while True:
        if decoder_input.size(1) == max_len:
            break

        # build mask for target
        decoder_mask = causal_mask(decoder_input.size(1)).type_as(source_mask).to(device)

        # calculate output
        out = model.decode(encoder_output, source_mask, decoder_input, decoder_mask)

        # get next token
        prob = model.project(out[:, -1])
        _, next_word = torch.max(prob, dim=1)
        decoder_input = torch.cat(
            [decoder_input, torch.empty(1, 1).type_as(source).fill_(next_word.item()).to(device)], dim=1
        )

        if next_word == eos_idx:
            break

    return decoder_input.squeeze(0)

def run_inference(model: nn.Module, tokenizer_src: Tokenizer, tokenizer_tgt: Tokenizer, source_texts: list[str], max_len: int, device: torch.device):
    model.eval()
    model.to(device)

    def infer(source_text):
        source_ids = tokenizer_src.encode(source_text).ids
        source_tensor = torch.tensor(source_ids).unsqueeze(0).to(device)
        source_mask = torch.ones(1, 1, 1, len(source_ids)).to(device)

        with torch.no_grad():
            output_ids = greedy_decode(model, source_tensor, source_mask, tokenizer_src, tokenizer_tgt, max_len, device)
        
        output_text = tokenizer_tgt.decode(output_ids.detach().cpu().numpy())
        print("OUTPUT:", output_text)
        return output_text

    with ThreadPoolExecutor() as executor:
        outputs = list(executor.map(infer, source_texts))

    return outputs

def get_all_sentences(ds: Dataset, lang: str):
    for item in ds:
        yield item['translation'][lang]

def get_or_build_tokenizer(config: ModelConfig, ds: Dataset, lang: str) -> Tokenizer:
    tokenizer_path = Path(config.tokenizer_file.format(lang))
    if not Path.exists(tokenizer_path):
        # Most code taken from: https://huggingface.co/docs/tokenizers/quicktour
        tokenizer = Tokenizer(WordLevel(unk_token="[UNK]"))
        tokenizer.pre_tokenizer = Whitespace()
        trainer = WordLevelTrainer(special_tokens=["[UNK]", "[PAD]", "[SOS]", "[EOS]"], min_frequency=2)
        tokenizer.train_from_iterator(get_all_sentences(ds, lang), trainer=trainer)
        tokenizer.save(str(tokenizer_path))
    else:
        tokenizer = Tokenizer.from_file(str(tokenizer_path))
    return tokenizer

def get_model(config: ModelConfig, vocab_src_len: int, vocab_tgt_len: int):
    model = build_transformer(vocab_src_len, vocab_tgt_len, config.seq_len, config.seq_len, d_model=config.d_model)
    return model

def load_model(config: ModelConfig, tokenizer_src: Tokenizer, tokenizer_tgt: Tokenizer, device: torch.device, load_weights=False):
    model = get_model(config, tokenizer_src.get_vocab_size(), tokenizer_tgt.get_vocab_size()).to(device)
    if not load_weights:
        return model

    if config.preload != '':
        if config.preload == 'latest':
            model_filename = get_latest_weights_file_path(config)
        else:
            model_filename = get_weights_file_path(config, int(config.preload))

        if model_filename is not None:
            print(f'Loading model {model_filename}')
            state = torch.load(model_filename, map_location=device)
            model.load_state_dict(state['model_state_dict'])
        else:
            raise ValueError(f'Could not find model to preload: {config.preload}')

    return model

def run_inference_pipeline(config: ModelConfig, prompts: list[str]):
    # Define the device
    assert torch.cuda.is_available(), "Inference on CPU is not supported"
    device = torch.device("cuda")
    print(f"Using device: {device}")

    # Load the tokenizers
    print("Loading tokenizers...")
    ds_raw = load_dataset('opus_books', f"{config.lang_src}-{config.lang_tgt}", split='train')
    tokenizer_src = get_or_build_tokenizer(config, ds_raw, config.lang_src)
    tokenizer_tgt = get_or_build_tokenizer(config, ds_raw, config.lang_tgt)

    # Load the model
    print("Loading model...")
    model = load_model(config, tokenizer_src, tokenizer_tgt, device)

    output_texts = run_inference(model, tokenizer_src, tokenizer_tgt, prompts, config.seq_len, device)
    return output_texts

if __name__ == '__main__':
    warnings.filterwarnings("ignore")

    config = get_default_config()

    # Read command line arguments and overwrite config accordingly
    parser = argparse.ArgumentParser()
    parser.add_argument('--seq_len', type=int, default=config.seq_len)
    parser.add_argument('--d_model', type=int, default=config.d_model)
    parser.add_argument('--lang_src', type=str, default=config.lang_src)
    parser.add_argument('--lang_tgt', type=str, default=config.lang_tgt)
    parser.add_argument('--model_folder', type=str, default=config.model_folder)
    parser.add_argument('--model_basename', type=str, default=config.model_basename)
    parser.add_argument('--preload', type=str, default=config.preload)
    parser.add_argument('--tokenizer_file', type=str, default=config.tokenizer_file)
    args = parser.parse_args()

    # Update default configuration with command line arguments
    config.__dict__.update(vars(args))

    # Run the inference pipeline
    run_inference_pipeline(config)
