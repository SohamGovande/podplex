FROM runpod/worker-vllm:stable-cuda11.8.0

RUN apt-get update && \
    apt-get install -y unrtf && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN python3.10 -m pip install -q --no-cache-dir -r requirements.txt

CMD ["python3.10", "-u", "main.py"]

