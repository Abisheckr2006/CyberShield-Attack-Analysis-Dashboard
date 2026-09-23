import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Response, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Target, Scan, Port, Finding
from app.schemas.schemas import (
    ScanCreateRequest, ScanResponse, PortResponse, FindingResponse,
    SummaryMetrics, ScanComparisonResult
)
from app.scanner.scanner import sanitize_and_parse_target, get_demo_scan_data, run_live_scan
from app.services.report_generator import generate_json_report, generate_csv_report, generate_pdf_report
from app.services.level2_scenario import get_level2_scenario_data
from app.services.nmap_parser import parse_nmap_xml

router = APIRouter(prefix="/api", tags=["Network Security Exposure API"])

@router.get("/level2/scenario")
def get_level2_scenario():
    """
    Returns complete Level 2 Cybersecurity Attack Analysis scenario data for
    Problem 11: The Fake Invoice at the Regional Credit Union.
    """
    return get_level2_scenario_data()

@router.get("/level2/timeline")
def get_level2_timeline():
    """Returns exact 6 timeline stages for Problem 11 attack progression."""
    scenario = get_level2_scenario_data()
    return scenario["timeline"]

@router.get("/level2/mitre")
def get_level2_mitre():
    """Returns MITRE ATT&CK technique mapping matrix for Problem 11."""
    scenario = get_level2_scenario_data()
    return scenario["mitre_matrix"]

@router.get("/level2/summary")
def get_level2_summary():
    """Returns summary metrics (events=6, mitre=4, alerts=1, status=CONTAINED)."""
    scenario = get_level2_scenario_data()
    return scenario["summary_metrics"]

@router.get("/level2/events")
def get_level2_events():
    """Returns security events list for Problem 11."""
    scenario = get_level2_scenario_data()
    return scenario["timeline"]

@router.get("/level2/event/{event_id}")
def get_level2_event(event_id: str):
    """Returns specific timeline event by ID or timestamp."""
    scenario = get_level2_scenario_data()
    for evt in scenario["timeline"]:
        if evt["id"] == event_id or evt["time"] == event_id:
            return evt
    raise HTTPException(status_code=404, detail="Event not found in scenario dataset.")



@router.post("/scan", response_model=ScanResponse)
def trigger_scan(req: ScanCreateRequest, db: Session = Depends(get_db)):
    """
    Triggers a safe network exposure scan or synthetic lab demo scan.
    """
    if not req.target or not req.target.strip():
        raise HTTPException(status_code=400, detail="Target IP/Hostname/URL cannot be empty.")

    try:
        target_parsed = sanitize_and_parse_target(req.target)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))

    # Create or retrieve target entity
    db_target = Target(
        raw_input=target_parsed["raw_input"],
        ip=target_parsed["ip"],
        hostname=target_parsed["hostname"],
        domain=target_parsed["domain"]
    )
    db.add(db_target)
    db.commit()
    db.refresh(db_target)

    # Initialize Scan object
    db_scan = Scan(
        target_id=db_target.id,
        status="Scanning",
        is_demo=1 if req.is_demo else 0
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    # Perform scan execution
    try:
        if req.is_demo:
            scan_results = get_demo_scan_data(target_parsed)
        else:
            scan_mode = req.scan_mode or "service"
            scan_results = run_live_scan(target_parsed["ip"], scan_mode=scan_mode)

        db_scan.status = scan_results["status"]
        db_scan.response_time_ms = scan_results["response_time_ms"]
        db_scan.completed_at = datetime.datetime.utcnow()
        db_scan.total_hosts = scan_results["total_hosts"]

        # Persist Ports
        for p in scan_results["ports"]:
            db_port = Port(
                scan_id=db_scan.id,
                port_number=p["port_number"],
                protocol=p["protocol"],
                state=p["state"],
                service_name=p["service_name"],
                detected_version=p["detected_version"],
                risk_level=p["risk_level"],
                exposure_category=p["exposure_category"],
                finding_summary=p["finding_summary"],
                why_it_matters=p["why_it_matters"],
                weakness=p["weakness"],
                recommendation=p["recommendation"]
            )
            db.add(db_port)

        # Persist Findings
        for f in scan_results["findings"]:
            db_finding = Finding(
                scan_id=db_scan.id,
                finding_code=f["finding_code"],
                severity=f["severity"],
                affected_port=f.get("affected_port"),
                service_name=f.get("service_name"),
                title=f["title"],
                description=f["description"],
                evidence=f["evidence"],
                impact=f["impact"],
                recommendation=f["recommendation"],
                confidence=f.get("confidence", "HIGH")
            )
            db.add(db_finding)

        db.commit()
        db.refresh(db_scan)
        return db_scan

    except RuntimeError as err:
        db_scan.status = "Failed"
        db.commit()
        raise HTTPException(status_code=400, detail=str(err))
    except Exception as e:
        db_scan.status = "Failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Scan execution failed: {str(e)}")


@router.post("/nmap/import", response_model=ScanResponse)
async def import_nmap_xml_report(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Imports and parses an authorized Nmap XML scan report.
    Does NOT launch or execute active network scans.
    """
    if not file.filename or not file.filename.lower().endswith(".xml"):
        raise HTTPException(status_code=400, detail="Invalid Nmap XML report.")

    try:
        contents = await file.read()
        parsed_data = parse_nmap_xml(contents)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Nmap XML report.")

    # Create target entity
    db_target = Target(
        raw_input=parsed_data["target_input"],
        ip=parsed_data["target_ip"],
        hostname=parsed_data["target_hostname"],
        domain=parsed_data["target_domain"]
    )
    db.add(db_target)
    db.commit()
    db.refresh(db_target)

    # Create scan entity
    db_scan = Scan(
        target_id=db_target.id,
        status=parsed_data["status"],
        started_at=datetime.datetime.utcnow(),
        completed_at=datetime.datetime.utcnow(),
        response_time_ms=parsed_data["response_time_ms"],
        total_hosts=parsed_data["total_hosts"],
        is_demo=0
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    # Persist ports
    for p in parsed_data["ports"]:
        db_port = Port(
            scan_id=db_scan.id,
            port_number=p["port_number"],
            protocol=p["protocol"],
            state=p["state"],
            service_name=p["service_name"],
            detected_version=p["detected_version"],
            risk_level=p["risk_level"],
            exposure_category=p["exposure_category"],
            finding_summary=p["finding_summary"],
            why_it_matters=p["why_it_matters"],
            weakness=p["weakness"],
            recommendation=p["recommendation"]
        )
        db.add(db_port)

    # Persist findings
    for f in parsed_data["findings"]:
        db_finding = Finding(
            scan_id=db_scan.id,
            finding_code=f["finding_code"],
            severity=f["severity"],
            affected_port=f.get("affected_port"),
            service_name=f.get("service_name"),
            title=f["title"],
            description=f["description"],
            evidence=f["evidence"],
            impact=f["impact"],
            recommendation=f["recommendation"],
            confidence=f.get("confidence", "HIGH")
        )
        db.add(db_finding)

    db.commit()
    db.refresh(db_scan)
    return db_scan


@router.get("/scan/{scan_id}", response_model=ScanResponse)
def get_scan(scan_id: int, db: Session = Depends(get_db)):
    """Fetches details for a specific scan ID."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    return scan


@router.get("/scans", response_model=List[ScanResponse])
def get_all_scans(db: Session = Depends(get_db)):
    """Returns historical scan records ordered by most recent."""
    return db.query(Scan).order_by(Scan.started_at.desc()).all()


@router.get("/ports/{scan_id}", response_model=List[PortResponse])
def get_scan_ports(scan_id: int, db: Session = Depends(get_db)):
    """Fetches all open/filtered port entries for a scan."""
    return db.query(Port).filter(Port.scan_id == scan_id).all()


@router.get("/findings/{scan_id}", response_model=List[FindingResponse])
def get_scan_findings(scan_id: int, db: Session = Depends(get_db)):
    """Fetches all security findings associated with a scan."""
    return db.query(Finding).filter(Finding.scan_id == scan_id).all()


@router.get("/summary/{scan_id}", response_model=SummaryMetrics)
def get_scan_summary(scan_id: int, db: Session = Depends(get_db)):
    """Calculates summary cards metrics for a scan."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")

    ports = scan.ports
    open_p = sum(1 for p in ports if p.state == 'OPEN')
    closed_p = sum(1 for p in ports if p.state == 'CLOSED')
    filtered_p = sum(1 for p in ports if p.state == 'FILTERED')

    high_r = sum(1 for p in ports if p.risk_level == 'HIGH')
    med_r = sum(1 for p in ports if p.risk_level == 'MEDIUM')
    low_r = sum(1 for p in ports if p.risk_level == 'LOW')
    info_r = sum(1 for p in ports if p.risk_level == 'INFO')

    services_count = len(set(p.service_name for p in ports if p.state == 'OPEN'))

    return SummaryMetrics(
        total_hosts=scan.total_hosts,
        open_ports=open_p,
        closed_ports=closed_p,
        filtered_ports=filtered_p,
        high_risk=high_r,
        medium_risk=med_r,
        low_risk=low_r,
        info_risk=info_r,
        services_detected=services_count
    )


@router.get("/export/{scan_id}")
def export_scan_report(scan_id: int, format: str = Query("pdf", regex="^(pdf|csv|json)$"), db: Session = Depends(get_db)):
    """Exports scan assessment report in PDF, CSV, or JSON format."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")

    if format == "json":
        content = generate_json_report(scan)
        return Response(content=content, media_type="application/json", headers={"Content-Disposition": f"attachment; filename=Network_Security_Report_{scan_id}.json"})
    elif format == "csv":
        content = generate_csv_report(scan)
        return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=Network_Security_Report_{scan_id}.csv"})
    else:  # pdf
        pdf_bytes = generate_pdf_report(scan)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=Network_Security_Report_{scan_id}.pdf"})


@router.post("/compare", response_model=ScanComparisonResult)
def compare_scans(prev_scan_id: int, curr_scan_id: int, db: Session = Depends(get_db)):
    """
    Compares two scan results for continuous monitoring delta evaluation.
    Identifies newly opened ports, closed ports, risk changes, and resolved findings.
    """
    prev_scan = db.query(Scan).filter(Scan.id == prev_scan_id).first()
    curr_scan = db.query(Scan).filter(Scan.id == curr_scan_id).first()

    if not prev_scan or not curr_scan:
        raise HTTPException(status_code=404, detail="One or both scan records not found for comparison.")

    prev_ports_set = {p.port_number for p in prev_scan.ports if p.state == 'OPEN'}
    curr_ports_set = {p.port_number for p in curr_scan.ports if p.state == 'OPEN'}

    newly_opened = list(curr_ports_set - prev_ports_set)
    closed = list(prev_ports_set - curr_ports_set)

    prev_svc_map = {p.port_number: p.service_name for p in prev_scan.ports}
    curr_svc_map = {p.port_number: p.service_name for p in curr_scan.ports}

    changed_services = []
    for port in (prev_ports_set & curr_ports_set):
        if prev_svc_map.get(port) != curr_svc_map.get(port):
            changed_services.append({
                "port": port,
                "previous_service": prev_svc_map.get(port),
                "current_service": curr_svc_map.get(port)
            })

    prev_high = sum(1 for p in prev_scan.ports if p.risk_level == 'HIGH')
    curr_high = sum(1 for p in curr_scan.ports if p.risk_level == 'HIGH')

    prev_findings_codes = {f.finding_code: f.title for f in prev_scan.findings}
    curr_findings_codes = {f.finding_code: f.title for f in curr_scan.findings}

    new_findings = [{"code": k, "title": v} for k, v in curr_findings_codes.items() if k not in prev_findings_codes]
    resolved_findings = [{"code": k, "title": v} for k, v in prev_findings_codes.items() if k not in curr_findings_codes]

    return ScanComparisonResult(
        previous_scan_id=prev_scan_id,
        current_scan_id=curr_scan_id,
        target_input=curr_scan.target.raw_input,
        newly_opened_ports=newly_opened,
        closed_ports=closed,
        changed_services=changed_services,
        changed_risk_summary={
            "previous_high_risk_count": prev_high,
            "current_high_risk_count": curr_high,
            "delta": curr_high - prev_high
        },
        new_findings=new_findings,
        resolved_findings=resolved_findings
    )
