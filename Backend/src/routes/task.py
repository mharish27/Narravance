from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from src.utils.data_loader import fetch_provider_a_data, fetch_provider_b_data
import pandas as pd
from src.utils.db_connection import insert_threat_data, fetch_task_data, task_exists, get_all_task_names
from src.schemas.threatTaskRecord import ThreatTaskRecord

# Import worker items
from src.ingestion.worker import (
    start_worker,
    task_queue,
    task_statuses,
)

router = APIRouter()

class ProviderFilter(BaseModel):
    year_from: int
    year_to: int
    countries: List[str]
    threat_levels: Optional[List[int]] = None  # For Provider A
    severity: Optional[List[int]] = None       # For Provider B

class TaskFilterRequest(BaseModel):
    provider_A: ProviderFilter
    provider_B: ProviderFilter

# ----------------------------------------
# Endpoint: create_task
# ----------------------------------------
@router.post("/create_task/{name}")
async def create_task(name: str, filters: TaskFilterRequest = Body(...)):
    """
    Enqueues a task instead of immediately doing the heavy lifting.
    """
    if task_exists(name):
        raise HTTPException(status_code=400, detail=f"Task '{name}' already exists.")

    # Initialize a 'placeholder' status
    task_statuses[name] = "enqueued"

    # Push this task onto the queue
    task_queue.put((name, filters))

    return {
        "task_name": name,
        "status": "enqueued",
        "message": "Task has been added to the queue."
    }

@router.get("/get_task_names")
async def get_task_names():
    return get_all_task_names()

@router.get("/get_task/{task_name}", response_model=List[ThreatTaskRecord])
async def get_task(task_name: str):
    records = fetch_task_data(task_name)
    if not records:
        raise HTTPException(status_code=404, detail=f"No data found for task '{task_name}'.")
    return records

