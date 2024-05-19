FROM public.ecr.aws/lambda/python:3.10

COPY requirements.txt ./

RUN pip3 install -r ./requirements.txt

COPY ping.py ./

COPY restarts.py ./

CMD [ "ping.lambda_handler" ]
