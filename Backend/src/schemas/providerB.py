from pydantic import BaseModel

class ProviderBRecord(BaseModel):
    ip_address: str
    severity: int
    detection_time: str
    country: str
    source: str
