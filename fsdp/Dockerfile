FROM runpod/pytorch:2.0.1-py3.10-cuda11.8.0-devel-ubuntu22.04

ENV WANDB_API_KEY_FILE=/run/secrets/wandb_api_key

WORKDIR /workspace

RUN git clone https://github.com/AnswerDotAI/fsdp_qlora

WORKDIR /workspace/fsdp_qlora

RUN pip install llama-recipes fastcore "transformers!=4.38.*,!=4.39.*" --extra-index-url https://download.pytorch.org/whl/test/cu118 && \
    pip install "bitsandbytes>=0.43.0" && \
    pip install wandb

RUN export WANDB_API_KEY=$(cat $WANDB_API_KEY_FILE) && \
    echo "$(cat /run/secrets/huggingface_api_key)" | huggingface-cli login

CMD ["python", "train.py", "--model_name", "meta-llama/Meta-Llama-Guard-2-8B", "--batch_size", "2", "--context_length", "512", "--precision", "bf16", "--train_type", "qlora", "--use_gradient_checkpointing", "true", "--use_cpu_offload", "true", "--dataset", "alpaca_sample", "--reentrant_checkpointing", "true", "--log_to", "wandb", "--project_name", "fsdp"]
