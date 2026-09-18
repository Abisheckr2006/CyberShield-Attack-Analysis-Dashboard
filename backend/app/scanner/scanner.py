import re
import socket
import ssl
import time
import shutil
import subprocess
import urllib.parse
from datetime import datetime
from app.risk_engine.risk import evaluate_port_risk_and_exposure
from app.findings_engine.findings import generate_findings_for_scan

def sanitize_and_parse_target(raw_input: str) -> dict:
    """
    Sanitizes user input to prevent command injection and extracts IP, Hostname, and Domain.
    """
    clean_input = raw_input.strip()
    
    # Strip URL schemes if present
    if clean_input.startswith("http://") or clean_input.startswith("https://"):
        parsed = urllib.parse.urlparse(clean_input)
        clean_input = parsed.netloc.split(":")[0]

    # Remove trailing slashes or ports
    clean_input = clean_input.split("/")[0].split(":")[0]

    # Check for invalid command injection characters
    if not re.match(r"^[a-zA-Z0-9.\-_]+$", clean_input):
        raise ValueError("Invalid target format. Only valid IP addresses, hostnames, or domains are permitted.")

    # Determine if IP address
    is_ip = False
    try:
        socket.inet_aton(clean_input)
        is_ip = True
    except socket.error:
        pass

    ip = clean_input if is_ip else None
    hostname = None if is_ip else clean_input
    domain = None

    if hostname:
        parts = hostname.split(".")
        if len(parts) >= 2:
            domain = ".".join(parts[-2:])
        
        # Try resolving IP for hostname
        try:
            ip = socket.gethostbyname(hostname)
        except socket.gaierror:
            ip = "127.0.0.1"  # Fallback for lab/unresolved demo names

    if not ip and not hostname:
        ip = "127.0.0.1"

    return {
        "raw_input": raw_input,
        "ip": ip or "127.0.0.1",
        "hostname": hostname or "localhost",
        "domain": domain or (hostname if hostname else "local.lab")
    }

def get_demo_scan_data(target_info: dict) -> dict:
    """
    Returns synthetic Level 1 scenario data for instant lab demo.
    Demonstrates:
    22 SSH — HIGH
    53 DNS — MEDIUM
    443 HTTPS — MEDIUM
    3389 RDP — HIGH
    """
    start_time = time.time()
    time.sleep(0.4)  # Simulate brief scan latency
    response_time_ms = round((time.time() - start_time) * 1000 + 35, 2)

    raw_ports = [
        {"port": 22, "protocol": "TCP", "state": "OPEN", "service": "SSH", "version": "OpenSSH 8.9p1 Ubuntu (RSA key active)"},
        {"port": 53, "protocol": "TCP", "state": "OPEN", "service": "DNS", "version": "BIND 9.18.1 (Internal Resolver)"},
        {"port": 443, "protocol": "TCP", "state": "OPEN", "service": "HTTPS", "version": "nginx 1.24.0 (TLS 1.3 / Valid Cert)"},
        {"port": 3389, "protocol": "TCP", "state": "OPEN", "service": "RDP", "version": "Microsoft Remote Desktop Service (NLA)"},
    ]

    ports_evaluated = []
    for p in raw_ports:
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
        "response_time_ms": response_time_ms,
        "total_hosts": 1,
        "ports": ports_evaluated,
        "findings": findings_list
    }

def run_live_scan(target_ip: str) -> dict:
    """
    Performs safe, non-destructive network exposure check.
    Uses Nmap if installed; falls back to standard Python socket discovery if Nmap is absent.
    """
    start_time = time.time()
    nmap_path = shutil.which("nmap")
    
    ports_raw = []

    if nmap_path:
        try:
            # Safe nmap execution using argument list (no shell injection risk)
            cmd = [nmap_path, "-sV", "--top-ports", "50", "-T3", target_ip]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=45, shell=False)
            
            if result.returncode == 0:
                stdout = result.stdout
                # Parse nmap text output lines
                # Format: PORT STATE SERVICE VERSION
                for line in stdout.splitlines():
                    match = re.match(r"^(\d+)/(tcp|udp)\s+(open|filtered|closed)\s+(\S+)\s*(.*)$", line.strip())
                    if match:
                        port_num = int(match.group(1))
                        proto = match.group(2).upper()
                        state = match.group(3).upper()
                        service = match.group(4)
                        ver = match.group(5).strip() or "Detected Version"
                        
                        if state in ["OPEN", "FILTERED"]:
                            ports_raw.append({
                                "port": port_num,
                                "protocol": proto,
                                "state": state,
                                "service": service,
                                "version": ver
                            })
        except Exception:
            ports_raw = []

    # Fallback to Python Socket Scan if Nmap failed or was not installed or returned no open ports
    if not ports_raw:
        # Standard safety assessment ports
        common_ports = [
            (22, "SSH"), (53, "DNS"), (80, "HTTP"), (443, "HTTPS"), (3389, "RDP"),
            (21, "FTP"), (23, "TELNET"), (25, "SMTP"), (445, "SMB"), (3306, "MySQL"), (5432, "PostgreSQL")
        ]

        for port_num, default_svc in common_ports:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.6)
                res = s.connect_ex((target_ip, port_num))
                if res == 0:
                    banner = "Detected Version"
                    # Simple HTTP/HTTPS banner/version check
                    if port_num == 443:
                        try:
                            context = ssl.create_default_context()
                            context.check_hostname = False
                            context.verify_mode = ssl.CERT_NONE
                            with context.wrap_socket(s, server_hostname=target_ip) as ss:
                                cert = ss.getpeercert(True)
                                banner = "TLS 1.2/1.3 Active Endpoint"
                        except Exception:
                            banner = "HTTPS TLS Endpoint"
                    elif port_num == 80:
                        try:
                            s.sendall(b"HEAD / HTTP/1.0\r\nHost: " + target_ip.encode() + b"\r\n\r\n")
                            reply = s.recv(128).decode("utf-8", errors="ignore")
                            if "Server:" in reply:
                                banner = reply.split("Server:")[1].split("\r\n")[0].strip()
                        except Exception:
                            banner = "HTTP Web Service"
                    s.close()
                    ports_raw.append({
                        "port": port_num,
                        "protocol": "TCP",
                        "state": "OPEN",
                        "service": default_svc,
                        "version": banner
                    })
                else:
                    s.close()
            except Exception:
                pass

    response_time_ms = round((time.time() - start_time) * 1000, 2)

    # Evaluate ports and generate findings
    ports_evaluated = []
    for p in ports_raw:
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
        "status": "Completed" if ports_evaluated else "Completed (No Open Ports Detected)",
        "response_time_ms": response_time_ms,
        "total_hosts": 1,
        "ports": ports_evaluated,
        "findings": findings_list
    }
