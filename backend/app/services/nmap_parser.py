import xml.etree.ElementTree as ET
from app.risk_engine.risk import evaluate_port_risk_and_exposure
from app.findings_engine.findings import generate_findings_for_scan

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB limit

SERVICE_MAPPING = {
    "SSH": "SSH",
    "DOMAIN": "DNS",
    "HTTP": "HTTP",
    "HTTPS": "HTTPS",
    "FTP": "FTP",
    "SMTP": "SMTP",
    "POP3": "POP3",
    "IMAP": "IMAP",
    "SMTPS": "SMTPS",
    "SUBMISSION": "Submission",
    "IMAPS": "IMAPS",
    "POP3S": "POP3S",
    "MYSQL": "MySQL",
    "MICROSOFT-DS": "SMB",
    "MS-WBT-SERVER": "RDP",
}

def parse_nmap_xml(xml_bytes: bytes) -> dict:
    """
    Safely parses Nmap XML report bytes and converts extracted ports into
    normalized structure with risk level, exposure category, and security findings.
    Processes ALL port entries returned by Nmap without artificial limits.
    """
    if len(xml_bytes) > MAX_FILE_SIZE:
        raise ValueError("Report file is too large.")

    if not xml_bytes or not xml_bytes.strip():
        raise ValueError("Invalid Nmap XML report.")

    content_str = xml_bytes.decode("utf-8", errors="ignore")

    # Anti-XXE security check: Reject ENTITY declarations to prevent XXE / entity expansion
    if "<!ENTITY" in content_str.upper():
        raise ValueError("Invalid Nmap XML report.")

    try:
        root = ET.fromstring(xml_bytes)
    except Exception:
        raise ValueError("Invalid Nmap XML report.")

    if root.tag != "nmaprun":
        raise ValueError("Invalid Nmap XML report.")

    hosts = root.findall("host")
    if not hosts:
        return {
            "status": "Completed (No Hosts Found)",
            "response_time_ms": 10.0,
            "total_hosts": 0,
            "target_input": "Nmap XML Import",
            "target_ip": "127.0.0.1",
            "target_hostname": "imported-report",
            "target_domain": "nmap.xml",
            "ports": [],
            "findings": []
        }

    extracted_ports = []
    target_ip = None
    target_hostname = None
    target_domain = None

    for host_idx, host in enumerate(hosts):
        # Extract IP address
        host_ip = None
        for addr in host.findall("address"):
            addr_type = addr.get("addrtype", "").lower()
            if addr_type in ["ipv4", "ipv6"] or not host_ip:
                host_ip = addr.get("addr")

        # Extract Hostname
        host_name = None
        hostnames_node = host.find("hostnames")
        if hostnames_node is not None:
            for hn in hostnames_node.findall("hostname"):
                name = hn.get("name")
                if name:
                    host_name = name
                    break

        if host_idx == 0:
            target_ip = host_ip or "127.0.0.1"
            target_hostname = host_name or target_ip
            if target_hostname and "." in target_hostname:
                parts = target_hostname.split(".")
                if len(parts) >= 2:
                    target_domain = ".".join(parts[-2:])

        # Extract Ports
        ports_node = host.find("ports")
        if ports_node is not None:
            for port_elem in ports_node.findall("port"):
                protocol = port_elem.get("protocol", "tcp").upper()
                try:
                    port_num = int(port_elem.get("portid", "0"))
                except ValueError:
                    continue

                state_elem = port_elem.find("state")
                state = "OPEN"
                if state_elem is not None:
                    state = state_elem.get("state", "open").upper()

                # Exclude closed ports; include open and filtered ports
                if state.lower() == "closed":
                    continue

                service_elem = port_elem.find("service")
                service_raw = "unknown"
                product = ""
                version = ""
                extrainfo = ""

                if service_elem is not None:
                    service_raw = service_elem.get("name", "unknown")
                    product = service_elem.get("product", "").strip()
                    version = service_elem.get("version", "").strip()
                    extrainfo = service_elem.get("extrainfo", "").strip()

                # Standardize service names for display using SERVICE_MAPPING
                service_upper = service_raw.upper()
                service_display = SERVICE_MAPPING.get(service_upper, service_raw)

                # Build detected version string
                version_parts = [p for p in [product, version] if p]
                if version_parts:
                    ver_str = " ".join(version_parts)
                    if extrainfo:
                        ver_str += f" ({extrainfo})"
                else:
                    ver_str = extrainfo if extrainfo else "Detected Version"

                extracted_ports.append({
                    "port": port_num,
                    "protocol": protocol,
                    "state": state,
                    "service": service_display,
                    "version": ver_str
                })

    target_input = target_hostname or target_ip or "Nmap XML Report"
    if len(hosts) > 1:
        target_input += f" (+{len(hosts) - 1} hosts)"

    # Evaluate risk and exposure for extracted ports
    ports_evaluated = []
    for p in extracted_ports:
        eval_res = evaluate_port_risk_and_exposure(p["port"], p["service"], p["state"], p["version"])
        ports_evaluated.append({
            "port_number": p["port"],
            "protocol": p["protocol"],
            "state": p["state"],
            "service_name": p["service"],
            "detected_version": p["version"],
            "risk_level": eval_res["risk_level"],
            "exposure_category": eval_res["exposure_category"],
            "finding_summary": eval_res["finding_summary"],
            "why_it_matters": eval_res["why_it_matters"],
            "weakness": eval_res["weakness"],
            "recommendation": eval_res["recommendation"]
        })

    findings_list = generate_findings_for_scan(ports_evaluated)

    return {
        "status": "Completed",
        "response_time_ms": 12.5,
        "total_hosts": len(hosts),
        "target_input": target_input,
        "target_ip": target_ip or "127.0.0.1",
        "target_hostname": target_hostname or "imported-target",
        "target_domain": target_domain or "local.lab",
        "ports": ports_evaluated,
        "findings": findings_list
    }
