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

    return

    print("Restarting Pods...")

    new_pods = []

    for i in range(desired_pods):
        print("Restarting pod: ", i)

        # params to pass in:
        # - return pod ID, pass in network drive

        response = requests.post(url, headers=headers, json=CREATE_POD)
        result = response.json()

        # get pod ID
        print("Result: ", result)

        # new_pods.append(result['data']['createPod']['id'])
    
    print("New pods: ", new_pods)
    print("Restart complete")
