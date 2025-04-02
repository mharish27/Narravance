# worker.py
import queue
import threading
import time
import pandas as pd
import asyncio
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from src.utils.data_loader import fetch_provider_a_data, fetch_provider_b_data
import pandas as pd
from src.utils.db_connection import insert_threat_data, fetch_task_data, task_exists, get_all_task_names
from src.schemas.threatTaskRecord import ThreatTaskRecord

# ------------------------------------------------
# Global queue and task status dictionary
# ------------------------------------------------
task_queue = queue.Queue()
task_statuses = {}

# ------------------------------------------------
# Worker function
# ------------------------------------------------
async def task_worker():
    """
    Continuously runs, pulling tasks off the queue.
    For each task:
      1. Mark status -> 'pending'
      2. Sleep to simulate some delay
      3. Mark status -> 'in_progress'
      4. Do your data fetching and DB insertion
      5. Mark status -> 'completed'
    """
    while True:
        # Blocks until there's a task in the queue
        name, filters = await asyncio.to_thread(task_queue.get)
        try:
            # 1) Mark as pending
            task_statuses[name] = "pending"
            print(f"[Worker] Task '{name}' -> PENDING")
            await asyncio.sleep(5)  # Simulate a delay

            # 2) Mark as in progress
            task_statuses[name] = "in_progress"
            print(f"[Worker] Task '{name}' -> IN PROGRESS")

            # -------------------------------------------------
            #    PLACE YOUR ACTUAL LOGIC (fetching, filtering,
            #    DB insertion) HERE. Below is an example:
            # -------------------------------------------------
            # Fetch data from both providers
            df_a = await fetch_provider_a_data()
            df_b = await fetch_provider_b_data()

            # Convert date columns to datetime
            df_a['date_detected'] = pd.to_datetime(df_a['date_detected'])
            df_b['detection_time'] = pd.to_datetime(df_b['detection_time'])
            df_a['year'] = df_a['date_detected'].dt.year
            df_b['year'] = df_b['detection_time'].dt.year

            # Provider A Filters
            df_a_filtered = df_a[
                (df_a['year'] >= filters.provider_A.year_from) &
                (df_a['year'] <= filters.provider_A.year_to) &
                (df_a['country'].isin(filters.provider_A.countries))
            ]
            if filters.provider_A.threat_levels:
                df_a_filtered = df_a_filtered[df_a_filtered['threat_level'].isin(filters.provider_A.threat_levels)]

            # Provider B Filters
            df_b_filtered = df_b[
                (df_b['year'] >= filters.provider_B.year_from) &
                (df_b['year'] <= filters.provider_B.year_to) &
                (df_b['country'].isin(filters.provider_B.countries))
            ]
            if filters.provider_B.severity:
                df_b_filtered = df_b_filtered[df_b_filtered['severity'].isin(filters.provider_B.severity)]

            # Prepare unified schema for Provider A
            df_a_prepared = df_a_filtered.rename(
                columns={
                    "date_detected": "discovery_date",
                    "threat_level": "risk_level"
                }
            )[["country", "discovery_date", "source", "risk_level"]]
            df_a_prepared["task_name"] = name

            # Prepare unified schema for Provider B
            df_b_prepared = df_b_filtered.rename(
                columns={
                    "detection_time": "discovery_date",
                    "severity": "risk_level"
                }
            )[["country", "discovery_date", "source", "risk_level"]]
            df_b_prepared["task_name"] = name

            # Combine data from both
            df_combined = pd.concat([df_a_prepared, df_b_prepared], ignore_index=True)

            # Insert into your DB
            insert_threat_data(df_combined)  # Stub function defined below

            # Simulate more processing time
            await asyncio.sleep(5)

            # 3) Mark as completed
            task_statuses[name] = "completed"
            print(f"[Worker] Task '{name}' -> COMPLETED")

        finally:
            # Let the queue know this task is done
            await asyncio.to_thread(task_queue.task_done)
            print(f"[Worker] Task '{name}' -> DONE")

# ------------------------------------------------
# Helper: Start the worker thread
# ------------------------------------------------
def start_worker(app):
    """
    Instead of using threading.Thread, run `task_worker()`
    in the current or a new event loop.
    """
    loop = asyncio.get_event_loop()

    # Create a background task in the event loop
    loop.create_task(task_worker())