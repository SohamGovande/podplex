FROM python:3.10 as builder

RUN apt-get update && apt-get install -y unrtf

COPY . /

RUN pip install --no-cache-dir -r requirements.txt --find-links https://download.pytorch.org/whl/nightly/cu118/torch_nightly.html

RUN git clone https://github.com/pytorch/PiPPy

WORKDIR /PiPPy

RUN git checkout f018a52a3184b82f7240279b826bb0790399a6b5

RUN python setup.py install

WORKDIR /

# Final stage with CUDA support
FROM runpod/worker-vllm:stable-cuda11.8.0
COPY --from=builder /usr/local /usr/local
COPY . /app
WORKDIR /app
CMD ["python", "train.py"]