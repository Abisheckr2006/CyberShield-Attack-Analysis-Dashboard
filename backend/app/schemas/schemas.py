from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class TargetBase(BaseModel):
    raw_input: str
    ip: Optional[str] = None
    hostname: Optional[str] = None
    domain: Optional[str] = None

class TargetResponse(TargetBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PortResponse(BaseModel):
    id: int
    scan_id: int
    port_number: int
    protocol: str
    state: str
    service_name: str
    detected_version: str
    risk_level: str
    exposure_category: str
    finding_summary: Optional[str] = None
    why_it_matters: Optional[str] = None
    weakness: Optional[str] = None
    recommendation: Optional[str] = None

    class Config:
        from_attributes = True

class FindingResponse(BaseModel):
    id: int
    scan_id: int
    finding_code: str
    severity: str
    affected_port: Optional[int] = None
    service_name: Optional[str] = None
    title: str
    description: str
    evidence: str
    impact: str
    recommendation: str
    confidence: str

    class Config:
        from_attributes = True

class ScanResponse(BaseModel):
    id: int
    target_id: int
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    response_time_ms: Optional[float] = None
    total_hosts: int
    is_demo: int
    target: TargetResponse
    ports: List[PortResponse] = []
    findings: List[FindingResponse] = []

    class Config:
        from_attributes = True

class ScanCreateRequest(BaseModel):
    target: str
    is_demo: bool = False
    scan_mode: Optional[str] = "service"

class SummaryMetrics(BaseModel):
    total_hosts: int
    open_ports: int
    closed_ports: int
    filtered_ports: int
    high_risk: int
    medium_risk: int
    low_risk: int
    info_risk: int
    services_detected: int

class ScanComparisonResult(BaseModel):
    previous_scan_id: int
    current_scan_id: int
    target_input: str
    newly_opened_ports: List[int]
    closed_ports: List[int]
    changed_services: List[dict]
    changed_risk_summary: dict
    new_findings: List[dict]
    resolved_findings: List[dict]
