import boto3
import json


def lambda_handler(event, context):
    client = boto3.client("events")
    rule_name = "one-min-run"
    action = event.get("queryStringParameters", {}).get("action", None)

    print("ACTION", action)

    if action == "start":
        # Enable the EventBridge rule
        client.enable_rule(Name=rule_name)
        response_body = {"message": "EventBridge rule enabled"}
        status_code = 200
    elif action == "stop":
        # Disable the EventBridge rule
        client.disable_rule(Name=rule_name)
        response_body = {"message": "EventBridge rule disabled"}
        status_code = 200
    else:
        response_body = {"message": "Invalid action parameter"}
        status_code = 400

    return {
        "statusCode": status_code,
        "body": json.dumps(response_body),
        "headers": {"Content-Type": "application/json"},
    }
