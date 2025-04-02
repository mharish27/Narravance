from pydantic import BaseModel

class ProviderARecord(BaseModel):
    ip_address: str
    threat_level: int
    date_detected: str
    country: str
    source: str
