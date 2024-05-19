import requests


def trigger_restart(pods, desired_pods):
    url = 'https://api.runpod.io/graphql?api_key=CZIZ7HIRD8WP96NLMXVWHUF612RLYKSOJBR3YT4S'

    headers = {
        'Content-Type': 'application/json'
    }

    TERMINATE_POD = """
    mutation terminatePod($input: PodTerminateInput!) {
        podTerminate(input: $input)
    }
    """

    CREATE_POD = """
    mutation podRentInterruptable($input: PodRentInterruptableInput!) {
        podRentInterruptable(input: $input) {
            id
            machineId
            __typename
        }
    }
    """
    
    print("Triggering restart")

    print("Pods: ", pods)

    for pod in pods:
        print("Terminating pod: ", pod['id'])

        terminate_variables = {
            "input": {
                "podId": pod['id']
            }
        }

        terminate_payload = {
            "query": TERMINATE_POD,
            "variables": terminate_variables
        }

        response = requests.post(url, headers=headers, json=terminate_payload)
        result = response.json()

        print("Result: ", result)
    
    print("Termination complete")

    print("Restarting Pods...")

    new_pods = []

    for i in range(desired_pods):
        print("Restarting pod: ", i)

        print("Terminating pod: ", pod['id'])

        create_variables = {
            "input": {
                "bidPerGpu": 0.55,
                "cloudType": "SECURE",
                "containerDiskInGb": 20,
                "volumeInGb": 0,
                "gpuCount": 1,
                "gpuTypeId": "NVIDIA A40",
                "minMemoryInGb": 48,
                "minVcpuCount": 9,
                "networkVolumeId": "b6w3w794gy",
                "startJupyter": True,
                "startSsh": True,
                "templateId": "runpod-torch",
                "volumeKey": "null",
                "ports": "8888/http,22/tcp",
                "dataCenterId": "CA-MTL-1",
            }
        }

        create_payload = {
            "query": CREATE_POD,
            "variables": create_variables
        }

        response = requests.post(url, headers=headers, json=create_payload)
        result = response.json()

        print("Result: ", result)
    
    print("New pods: ", new_pods)
    print("Restart complete")
