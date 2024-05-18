import runpod
import asyncio
from openai import AsyncOpenAI
import os
import pandas as pd

"""
{
  "id": "A_RANDOM_JOB_IDENTIFIER",
  "input": { "key": "value" }
}

input and output payload max size: 2MB
"""


def convert_to_direct_download_url(gdrive_url):
    # Extracting the file ID from the shared URL
    file_id = gdrive_url.split("/")[-2]

    # Constructing the direct download URL
    direct_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    return direct_url


async def handler(job):
    job_input = job["input"]

    if (
        not job_input.get("model", False)
        or not job_input.get("eval_file", False)
        or not job_input.get("model_endpoint", False)
    ):
        return {"error": "Invalid input. Missing required fields."}

    model_endpoint = job_input["model_endpoint"]
    eval_file = job_input["eval_file"]
    model = job_input["model"]

    eval_file = convert_to_direct_download_url(eval_file)

    tasks = []

    # fetch the eval file from the eval_url, this will be a CSV file
    eval_df = pd.read_csv(eval_file)

    client = AsyncOpenAI(
        api_key=os.getenv("RUNPOD_API_KEY"),
        base_url=model_endpoint,
    )

    for _, row in eval_df.iterrows():
        tasks.append(
            asyncio.create_task(
                client.chat.completions.create(
                    model=model,
                    messages=[
                        {
                            "role": "user",
                            "content": row["prompt"],
                        }
                    ],
                    temperature=0,
                    max_tokens=100,
                )
            )
        )

    responses = await asyncio.gather(*tasks)

    for index, row in eval_df.iterrows():
        print("=" * 12)
        print("Prompt: ", row["prompt"])
        print("Model Response: ", responses[index].choices[0].message.content)
        print("Expected Response: ", row["answer"], "\n")

    return {"status": "success"}


# Configure and start the RunPod serverless function
runpod.serverless.start(
    {
        "handler": handler,  # Required: Specify the async handler
        "return_aggregate_stream": True,  # Optional: Aggregate results are accessible via /run endpoint
    }
)
