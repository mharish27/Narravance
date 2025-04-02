from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.task import router as task_router

# Import worker items
from src.ingestion.worker import (
    start_worker,
    task_queue,
    task_statuses,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],              # or ['GET', 'POST'] etc.
    allow_headers=["*"],
)

app.include_router(task_router, prefix="/api/v1")

@app.on_event("startup")
async def on_startup():
    # Start the background worker thread
    start_worker(app)