import runpod
import json
import os
import dotenv
from restarts import trigger_restart 
import requests

# delete the RUNPOD_API_KEY from environ 
DESIRED_PODS = 4
del os.environ["RUNPOD_API_KEY"]

dotenv.load_dotenv()
API_KEY = os.getenv("RUNPOD_API_KEY")
runpod.api_key = API_KEY
endpoints = runpod.get_endpoints()

url = f'https://api.runpod.io/graphql?api_key={API_KEY}'
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
    new_pods = trigger_restart(pods, DESIRED_PODS, API_KEY)