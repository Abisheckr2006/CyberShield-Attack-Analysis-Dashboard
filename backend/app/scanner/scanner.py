import os
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
from app.services.nmap_parser import parse_nmap_xml

def find_nmap_executable() -> str:
    """
    Locates the Nmap executable path.
    1. Checks system PATH.
    2. Checks C:\\Program Files (x86)\\Nmap\\nmap.exe
    3. Checks C:\\Program Files\\Nmap\\nmap.exe
    Prints diagnostic log on detection.
    """
    nmap_path = shutil.which("nmap")
    if nmap_path and os.path.isfile(nmap_path):
        print(f"Nmap executable detected:\n{nmap_path}")
        return nmap_path

    candidate_paths = [
        r"C:\Program Files (x86)\Nmap\nmap.exe",
        r"C:\Program Files\Nmap\nmap.exe",
    ]

    for candidate in candidate_paths:
        if os.path.isfile(candidate):
            print(f"Nmap executable detected:\n{candidate}")
            return candidate

    return None

# Detected executable path configuration
NMAP_EXE_PATH = find_nmap_executable()

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

def run_live_scan(target_ip: str, scan_mode: str = "service") -> dict:
    """
    Performs safe, non-destructive network exposure scan by directly executing the Nmap binary.
    Captures XML output from stdout (-oX -) and parses all open ports without artificial limits.
    
    Scan Modes:
      - 'quick': Quick Scan (nmap -oX - <target>)
      - 'service': Service Detection (nmap -sV -oX - <target>)
      - 'full_tcp': Full TCP Port Scan (nmap -p- -oX - <target>)
      - 'full_tcp_service': Full TCP + Service Detection (nmap -p- -sV -oX - <target>)
    """
    nmap_path = find_nmap_executable()
    if not nmap_path:
        raise RuntimeError("Nmap is not installed or is not available in PATH.")

    # Predefined scan modes mapping to safe Nmap command arguments
    if scan_mode == "quick":
        cmd = [nmap_path, "-oX", "-", target_ip]
    elif scan_mode == "full_tcp":
        cmd = [nmap_path, "-p-", "-oX", "-", target_ip]
    elif scan_mode == "full_tcp_service":
        cmd = [nmap_path, "-p-", "-sV", "-oX", "-", target_ip]
    else:  # default 'service' mode
        cmd = [nmap_path, "-sV", "-oX", "-", target_ip]

    start_time = time.time()
    try:
        result = subprocess.run(cmd, capture_output=True, timeout=300, shell=False)
    except subprocess.TimeoutExpired:
        raise RuntimeError("Nmap scan timed out. The target may be filtering probe packets or unreachable.")
    except Exception as err:
        raise RuntimeError(f"Nmap scan execution failed: {str(err)}")

    if result.returncode != 0 and not result.stdout:
        err_msg = result.stderr.decode("utf-8", errors="ignore").strip() if result.stderr else "Nmap process returned non-zero status."
        raise RuntimeError(f"Nmap execution error: {err_msg}")

    # Parse XML output from stdout
    try:
        parsed_data = parse_nmap_xml(result.stdout)
    except ValueError as val_err:
        raise RuntimeError(f"Failed to parse Nmap output: {str(val_err)}")

    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    parsed_data["response_time_ms"] = elapsed_ms
    parsed_data["target_ip"] = target_ip

    return parsed_data


