import runpod
import os
import dotenv
from restarts import trigger_restart
import requests

DESIRED_PODS = 4

dotenv.load_dotenv()

API_KEY = os.getenv("RUNPOD_API_KEY")
runpod.api_key = API_KEY
endpoints = runpod.get_endpoints()

url = f"https://api.runpod.io/graphql?api_key={API_KEY}"
headers = {"Content-Type": "application/json"}
data = {
    "query": "query Pods { myself { pods { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } } }"
}


def lambda_handler(event, context):
    response = requests.post(url, headers=headers, json=data)
    result = response.json()
    pods = result["data"]["myself"]["pods"]

    # num active pods
    num_active_pods = len(pods)
    print("ACTIVE PODS", num_active_pods)

    if num_active_pods < DESIRED_PODS:
        new_pods = trigger_restart(pods, DESIRED_PODS, API_KEY)
