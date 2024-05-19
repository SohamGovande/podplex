import requests


def trigger_restart(pods, desired_pods):
    url = 'https://api.runpod.io/graphql?api_key=CZIZ7HIRD8WP96NLMXVWHUF612RLYKSOJBR3YT4S'
    TERMINATE_POD ="mutation terminatePod($input: PodTerminateInput!) {\n  podTerminate(input: $input)\n}\n"
    headers = {
        'Content-Type': 'application/json'
    }
    CREATE_POD = ""
    
    print("Triggering restart")

    print("Pods: ", pods)

    for pod in pods:
        print("Terminating pod: ", pod['id'])
        response = requests.post(TERMINATE_POD, headers=headers, json=TERMINATE_POD)
        result = response.json()

        print("Result: ", result)

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
