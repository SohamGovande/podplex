import runpod
import pandas as pd

from config import get_default_config
from inference import run_inference_pipeline

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

    if not job_input.get("eval_file", False):
        return {"error": "Invalid input, missing eval_file"}

    batch_size = job_input.get("batch_size", 20)
    eval_file = job_input["eval_file"]
    eval_file = convert_to_direct_download_url(eval_file)

    # fetch the eval file from the eval_url, this will be a CSV file
    eval_df = pd.read_csv(eval_file)
    config = get_default_config()

    all_translations = []

    batches = []
    batch = []

    for index, row in eval_df.iterrows():
        batch.append(row["prompt"])
        if len(batch) == batch_size:
            batches.append(batch)
            batch = []

    if len(batch) > 0:
        batches.append(batch)

    for batch in batches:
        translations = run_inference_pipeline(config, batch)
        all_translations.extend(translations)

    for index, row in eval_df.iterrows():
        print("=" * 12)
        print("Prompt: ", row["prompt"])
        print("Model Translation: ", all_translations[index])
        print("Expected Translation: ", row["answer"], "\n")

    return {"status": "success"}


# Configure and start the RunPod serverless function
runpod.serverless.start(
    {
        "handler": handler,  # Required: Specify the async handler
        "return_aggregate_stream": True,  # Optional: Aggregate results are accessible via /run endpoint
    }
)
