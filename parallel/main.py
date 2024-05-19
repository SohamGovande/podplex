import runpod
import pandas as pd

from config import get_default_config
from inference import run_inference_pipeline
from supabase import create_client, Client
from io import StringIO, BytesIO
import datetime

supabase: Client = create_client(
    "https://twuuwrleysnspvxvjfvl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dXV3cmxleXNuc3B2eHZqZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxMjQzMDUsImV4cCI6MjAzMTcwMDMwNX0.SnbmdBL_Vtj9_Gcn10zu_ohFsaszdQSFkusUk4kIQWk",
)

EVAL_BUCKET_NAME = "public"
RESULT_BUCKET_NAME = "eval_results"


def upload_dataframe_to_supabase(df: pd.DataFrame, bucket_name: str):
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    file_content = BytesIO(csv_buffer.getvalue().encode("utf-8"))

    timestamp = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
    file_name = f"eval-{timestamp}.csv"

    response = supabase.storage.from_(bucket_name).upload(file_name, file_content)

    return response


async def handler(job):
    job_input = job["input"]

    if not job_input.get("eval_file", False):
        return {"error": "Invalid input, missing eval_file"}

    batch_size = job_input.get("batch_size", 20)

    # supabase file url
    eval_file = job_input["eval_file"]
    eval_file = supabase.storage.from_(EVAL_BUCKET_NAME).download(eval_file)

    file_like_object = BytesIO(eval_file)

    eval_df = pd.read_csv(file_like_object)
    config = get_default_config()

    all_outputs = []

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
        outputs = run_inference_pipeline(config, batch)
        all_outputs.extend(outputs)

    eval_df["model output"] = all_outputs
    upload_dataframe_to_supabase(eval_df, RESULT_BUCKET_NAME)

    for index, row in eval_df.iterrows():
        print("=" * 12)
        print("Prompt: ", row["prompt"])
        print("Model Translation: ", all_outputs[index])
        print("Expected Translation: ", row["answer"], "\n")

    return {"status": "success"}


# Configure and start the RunPod serverless function
runpod.serverless.start(
    {
        "handler": handler,  # Required: Specify the async handler
        "return_aggregate_stream": True,  # Optional: Aggregate results are accessible via /run endpoint
    }
)
