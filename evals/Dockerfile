FROM python:3.10 as builder

RUN apt-get update && \
    apt-get install -y unrtf && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install -q --no-cache-dir -r requirements.txt

# Use CUDA supported base image for the final stage
FROM runpod/worker-vllm:stable-cuda11.8.0

COPY --from=builder /usr/local /usr/local

COPY . /app

WORKDIR /app

CMD ["python", "main.py"]
