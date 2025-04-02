from pydantic import BaseModel

class ThreatTaskRecord(BaseModel):
    task_name: str
    country: str
    discovery_date: str
    source: str
    risk_level: int
