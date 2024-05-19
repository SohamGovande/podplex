import runpod
import json
import os
import dotenv
from restarts import trigger_restart 
import requests

# delete the RUNPOD_API_KEY from environ 
DESIRED_PODS = 4
# del os.environ["RUNPOD_API_KEY"]

# dotenv.load_dotenv()
# runpod.api_key = os.getenv("RUNPOD_API_KEY")
# endpoints = runpod.get_endpoints()

url = 'https://api.runpod.io/graphql?api_key=CZIZ7HIRD8WP96NLMXVWHUF612RLYKSOJBR3YT4S'
headers = {
    'Content-Type': 'application/json'
}
data = {
    'query': 'query Pods { myself { pods { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } } }'
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
pods = result['data']['myself']['pods']

# num active pods 
num_active_pods = len(pods)
print(num_active_pods)

if num_active_pods < DESIRED_PODS:
    trigger_restart(pods, DESIRED_PODS)
