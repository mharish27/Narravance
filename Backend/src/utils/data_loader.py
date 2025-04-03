# import pandas as pd

# # Replace these with the actual file paths on your machine
# PROVIDER_A_PATH = "data/ProviderA_1000.json"
# PROVIDER_B_PATH = "data/ProviderB_1000.csv"

# async def fetch_provider_a_data():
#     # Temporarily reading from local JSON file
#     try:
#         return pd.read_json(PROVIDER_A_PATH)
#     except Exception as e:
#         print("Failed to load Provider A data from local file:", e)
#         raise

# async def fetch_provider_b_data():
#     # Temporarily reading from local CSV file
#     try:
#         return pd.read_csv(PROVIDER_B_PATH)
#     except Exception as e:
#         print("Failed to load Provider B data from local file:", e)
#         raise

# ------------------------------------------------------------------------------------------------------------

import pandas as pd
import httpx
import io

PROVIDER_A_URL = "https://drive.google.com/uc?export=download&id=14Hpisb3UceyMi-hiM10xxJzujFIKjT7G"
PROVIDER_B_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSssRY0QUuBGZ6R0DwOPX-brnHJ0VwDji6vDFY6ESptB3VUNVgFzMsv1e6uTnfe-AlkcxqrI8uCN5lS/pub?gid=1788409129&single=true&output=csv"

async def fetch_provider_a_data():
    async with httpx.AsyncClient() as client:
        r = await client.get(PROVIDER_A_URL, follow_redirects=True)
        r.raise_for_status()
        return pd.read_json(io.StringIO(r.text))

async def fetch_provider_b_data():
    async with httpx.AsyncClient() as client:
        r = await client.get(PROVIDER_B_URL, follow_redirects=True)
        r.raise_for_status()
        return pd.read_csv(io.StringIO(r.text))

