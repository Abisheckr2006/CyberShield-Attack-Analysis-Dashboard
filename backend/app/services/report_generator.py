import io
import csv
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_json_report(scan_obj) -> str:
    """Generates JSON formatted report data."""
    data = {
        "title": "Level 1 Network Security Exposure Assessment Report",
        "timestamp": scan_obj.completed_at.isoformat() if scan_obj.completed_at else scan_obj.started_at.isoformat(),
        "target": {
            "input": scan_obj.target.raw_input,
            "ip": scan_obj.target.ip,
            "hostname": scan_obj.target.hostname,
            "domain": scan_obj.target.domain
        },
        "scan_status": scan_obj.status,
        "is_demo_scenario": bool(scan_obj.is_demo),
        "open_ports": [
            {
                "port": p.port_number,
                "protocol": p.protocol,
                "state": p.state,
                "service": p.service_name,
                "version": p.detected_version,
                "risk": p.risk_level,
                "exposure": p.exposure_category
            } for p in scan_obj.ports
        ],
        "findings": [
            {
                "id": f.finding_code,
                "severity": f.severity,
                "title": f.title,
                "affected_port": f.affected_port,
                "description": f.description,
                "evidence": f.evidence,
                "impact": f.impact,
                "recommendation": f.recommendation
            } for f in scan_obj.findings
        ],
        "disclaimer": "Authorized defensive assessment only. Only scan systems you own or have explicit authorization to assess."
    }
    return json.dumps(data, indent=2)


def generate_csv_report(scan_obj) -> str:
    """Generates CSV formatted report of ports and findings."""
    output = io.StringIO()
    writer = csv.writer(output)

    # Metadata headers
    writer.writerow(["LEVEL 1 NETWORK SECURITY ASSESSMENT REPORT"])
    writer.writerow(["Target", scan_obj.target.raw_input, "IP", scan_obj.target.ip])
    writer.writerow(["Status", scan_obj.status, "Scan Date", scan_obj.started_at.strftime("%Y-%m-%d %H:%M:%S")])
    writer.writerow([])

    # Ports Table
    writer.writerow(["OPEN PORTS & SERVICES"])
    writer.writerow(["Port", "Protocol", "State", "Service", "Version", "Risk Level", "Exposure Category"])
    for p in scan_obj.ports:
        writer.writerow([p.port_number, p.protocol, p.state, p.service_name, p.detected_version, p.risk_level, p.exposure_category])
    
    writer.writerow([])

    # Findings Table
    writer.writerow(["SECURITY FINDINGS & WEAKNESSES"])
    writer.writerow(["ID", "Severity", "Port", "Service", "Title", "Evidence", "Impact", "Recommendation"])
    for f in scan_obj.findings:
        writer.writerow([f.finding_code, f.severity, f.affected_port or "-", f.service_name or "-", f.title, f.evidence, f.impact, f.recommendation])

    return output.getvalue()


def generate_pdf_report(scan_obj) -> bytes:
    """Generates a professional PDF report using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        spaceAfter=15
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#64748B')
    )

    elements = []

    # Title Banner
    elements.append(Paragraph("Network Security Exposure Assessment", title_style))
    elements.append(Paragraph("Level 1 — Network Security Exposure Center Report", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceBefore=2, spaceAfter=12))

    # Target Metadata Summary Table
    scan_date = scan_obj.started_at.strftime("%Y-%m-%d %H:%M:%S UTC")
    meta_data = [
        [Paragraph("<b>Target Input:</b>", body_style), Paragraph(str(scan_obj.target.raw_input), body_style), Paragraph("<b>Status:</b>", body_style), Paragraph(str(scan_obj.status), body_style)],
        [Paragraph("<b>IP Address:</b>", body_style), Paragraph(str(scan_obj.target.ip or "N/A"), body_style), Paragraph("<b>Scan Timestamp:</b>", body_style), Paragraph(scan_date, body_style)],
        [Paragraph("<b>Hostname:</b>", body_style), Paragraph(str(scan_obj.target.hostname or "N/A"), body_style), Paragraph("<b>Mode:</b>", body_style), Paragraph("Demo Scenario" if scan_obj.is_demo else "Authorized Scan", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[90, 170, 90, 170])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 15))

    # Summary Metrics
    open_count = len(scan_obj.ports)
    high_count = sum(1 for p in scan_obj.ports if p.risk_level == 'HIGH')
    med_count = sum(1 for p in scan_obj.ports if p.risk_level == 'MEDIUM')
    low_count = sum(1 for p in scan_obj.ports if p.risk_level in ['LOW', 'INFO'])

    metrics_data = [
        [
            Paragraph(f"<font size=14><b>{scan_obj.total_hosts}</b></font><br/>Total Hosts", body_style),
            Paragraph(f"<font size=14 color='#0284C7'><b>{open_count}</b></font><br/>Open Ports", body_style),
            Paragraph(f"<font size=14 color='#DC2626'><b>{high_count}</b></font><br/>High Risk", body_style),
            Paragraph(f"<font size=14 color='#D97706'><b>{med_count}</b></font><br/>Medium Risk", body_style),
            Paragraph(f"<font size=14 color='#16A34A'><b>{low_count}</b></font><br/>Low/Info Risk", body_style)
        ]
    ]
    metrics_table = Table(metrics_data, colWidths=[104]*5)
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(metrics_table)
    elements.append(Spacer(1, 15))

    # Open Ports Table
    elements.append(Paragraph("Identified Open Ports & Services", section_heading))
    port_table_data = [
        [Paragraph("<b>Port</b>", body_style), Paragraph("<b>Proto</b>", body_style), Paragraph("<b>State</b>", body_style), Paragraph("<b>Service</b>", body_style), Paragraph("<b>Version</b>", body_style), Paragraph("<b>Risk</b>", body_style), Paragraph("<b>Exposure</b>", body_style)]
    ]
    for p in scan_obj.ports:
        risk_color = '#DC2626' if p.risk_level == 'HIGH' else ('#D97706' if p.risk_level == 'MEDIUM' else '#16A34A')
        port_table_data.append([
            Paragraph(str(p.port_number), body_style),
            Paragraph(p.protocol, body_style),
            Paragraph(f"<font color='#16A34A'><b>{p.state}</b></font>", body_style),
            Paragraph(p.service_name, body_style),
            Paragraph(p.detected_version[:25], body_style),
            Paragraph(f"<font color='{risk_color}'><b>{p.risk_level}</b></font>", body_style),
            Paragraph(p.exposure_category, body_style)
        ])
    
    ports_table = Table(port_table_data, colWidths=[40, 45, 50, 65, 150, 65, 105])
    ports_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(ports_table)
    elements.append(Spacer(1, 15))

    # Security Findings
    elements.append(Paragraph("Security Findings & Risk Analysis", section_heading))
    for f in scan_obj.findings:
        sev_color = '#DC2626' if f.severity == 'HIGH' else ('#D97706' if f.severity == 'MEDIUM' else '#16A34A')
        elements.append(Paragraph(f"<b>[{f.finding_code}] {f.title}</b> — <font color='{sev_color}'><b>{f.severity} SEVERITY</b></font>", ParagraphStyle('FindingHead', parent=body_style, fontSize=10, leading=13)))
        elements.append(Paragraph(f"<b>Affected Service:</b> Port {f.affected_port} ({f.service_name})", body_style))
        elements.append(Paragraph(f"<b>Description:</b> {f.description}", body_style))
        elements.append(Paragraph(f"<b>Evidence:</b> <i>{f.evidence}</i>", body_style))
        elements.append(Paragraph(f"<b>Impact:</b> {f.impact}", body_style))
        elements.append(Paragraph(f"<b>Recommendation:</b> {f.recommendation}", body_style))
        elements.append(Spacer(1, 8))

    # Footer Disclaimer
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceBefore=5, spaceAfter=8))
    elements.append(Paragraph("Authorized defensive assessment only. Only scan systems you own or have explicit authorization to assess. Level 1 Network Security Exposure Assessment Dashboard.", disclaimer_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
