import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.nmap_parser import parse_nmap_xml

client = TestClient(app)

SAMPLE_SINGLE_HOST_XML = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE nmaprun>
<nmaprun scanner="nmap" args="nmap -sV -oX scan.xml 192.168.1.10" version="7.94">
    <host>
        <status state="up"/>
        <address addr="192.168.1.10" addrtype="ipv4"/>
        <hostnames>
            <hostname name="target.lab.local" type="PTR"/>
        </hostnames>
        <ports>
            <port protocol="tcp" portid="22">
                <state state="open"/>
                <service name="ssh" product="OpenSSH" version="9.6"/>
            </port>
            <port protocol="tcp" portid="53">
                <state state="open"/>
                <service name="domain" product="BIND" version="9.18.1"/>
            </port>
            <port protocol="tcp" portid="80">
                <state state="open"/>
                <service name="http" product="Apache httpd" version="2.4.58"/>
            </port>
            <port protocol="tcp" portid="443">
                <state state="open"/>
                <service name="https" product="nginx" version="1.24.0"/>
            </port>
            <port protocol="tcp" portid="445">
                <state state="open"/>
                <service name="microsoft-ds" product="Samba" version="4.19.0"/>
            </port>
            <port protocol="tcp" portid="3306">
                <state state="open"/>
                <service name="mysql" product="MySQL" version="8.0.32"/>
            </port>
            <port protocol="tcp" portid="3389">
                <state state="open"/>
                <service name="ms-wbt-server" product="Microsoft Remote Desktop" version="10.0"/>
            </port>
            <port protocol="tcp" portid="8080">
                <state state="open"/>
                <service name="http-proxy" product="Squid proxy" version="5.7"/>
            </port>
        </ports>
    </host>
</nmaprun>
"""

SAMPLE_MULTI_HOST_XML = """<?xml version="1.0" encoding="UTF-8"?>
<nmaprun scanner="nmap" version="7.94">
    <host>
        <address addr="10.0.0.1" addrtype="ipv4"/>
        <ports>
            <port protocol="tcp" portid="80">
                <state state="open"/>
                <service name="http" product="nginx" version="1.22"/>
            </port>
        </ports>
    </host>
    <host>
        <address addr="10.0.0.2" addrtype="ipv4"/>
        <ports>
            <port protocol="tcp" portid="22">
                <state state="open"/>
                <service name="ssh" product="OpenSSH" version="8.9"/>
            </port>
            <port protocol="tcp" portid="10000">
                <state state="filtered"/>
                <service name="sadmin"/>
            </port>
        </ports>
    </host>
</nmaprun>
"""

def test_parse_single_host_xml():
    result = parse_nmap_xml(SAMPLE_SINGLE_HOST_XML.encode('utf-8'))
    assert result["total_hosts"] == 1
    assert result["target_ip"] == "192.168.1.10"
    assert result["target_hostname"] == "target.lab.local"
    assert len(result["ports"]) == 8

    ports_by_num = {p["port_number"]: p for p in result["ports"]}
    
    # Check 22 SSH
    assert 22 in ports_by_num
    assert ports_by_num[22]["service_name"] == "SSH"
    assert "OpenSSH 9.6" in ports_by_num[22]["detected_version"]
    assert ports_by_num[22]["risk_level"] == "HIGH"
    assert ports_by_num[22]["exposure_category"] == "Management"

    # Check 443 HTTPS
    assert 443 in ports_by_num
    assert ports_by_num[443]["service_name"] == "HTTPS"
    assert "nginx 1.24.0" in ports_by_num[443]["detected_version"]
    assert ports_by_num[443]["exposure_category"] == "Public"

    # Check 3306 MySQL
    assert 3306 in ports_by_num
    assert ports_by_num[3306]["service_name"] in ["MySQL", "MYSQL"]
    assert "MySQL 8.0.32" in ports_by_num[3306]["detected_version"]
    assert ports_by_num[3306]["exposure_category"] == "Internal"

def test_parse_multi_host_xml():
    result = parse_nmap_xml(SAMPLE_MULTI_HOST_XML.encode('utf-8'))
    assert result["total_hosts"] == 2
    assert len(result["ports"]) == 3
    states = [p["state"] for p in result["ports"]]
    assert "OPEN" in states
    assert "FILTERED" in states

def test_invalid_xml():
    with pytest.raises(ValueError, match="Invalid Nmap XML report."):
        parse_nmap_xml(b"This is not XML content")

def test_xxe_rejection():
    xxe_payload = """<?xml version="1.0"?>
    <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
    <nmaprun><host><address addr="1.2.3.4"/></host></nmaprun>"""
    with pytest.raises(ValueError, match="Invalid Nmap XML report."):
        parse_nmap_xml(xxe_payload.encode('utf-8'))

def test_api_import_endpoint():
    response = client.post(
        "/api/nmap/import",
        files={"file": ("scan_result.xml", SAMPLE_SINGLE_HOST_XML.encode('utf-8'), "application/xml")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert len(data["ports"]) == 8
    assert data["target"]["ip"] == "192.168.1.10"

SAMPLE_13_PORTS_XML = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE nmaprun>
<nmaprun scanner="nmap" version="7.94">
    <host>
        <status state="up"/>
        <address addr="192.168.1.50" addrtype="ipv4"/>
        <hostnames><hostname name="server13.lab.local" type="PTR"/></hostnames>
        <ports>
            <port protocol="tcp" portid="21"><state state="open"/><service name="ftp" product="vsftpd" version="3.0.3"/></port>
            <port protocol="tcp" portid="22"><state state="open"/><service name="ssh" product="OpenSSH" version="8.9p1"/></port>
            <port protocol="tcp" portid="25"><state state="open"/><service name="smtp" product="Postfix smtpd"/></port>
            <port protocol="tcp" portid="53"><state state="open"/><service name="domain" product="BIND" version="9.16.1"/></port>
            <port protocol="tcp" portid="80"><state state="open"/><service name="http" product="Apache httpd" version="2.4.41"/></port>
            <port protocol="tcp" portid="110"><state state="open"/><service name="pop3" product="Dovecot pop3d"/></port>
            <port protocol="tcp" portid="143"><state state="open"/><service name="imap" product="Dovecot imapd"/></port>
            <port protocol="tcp" portid="443"><state state="open"/><service name="https" product="nginx" version="1.18.0"/></port>
            <port protocol="tcp" portid="465"><state state="open"/><service name="smtps" product="Postfix smtpd"/></port>
            <port protocol="tcp" portid="587"><state state="open"/><service name="submission" product="Postfix submission"/></port>
            <port protocol="tcp" portid="993"><state state="open"/><service name="imaps" product="Dovecot imapd"/></port>
            <port protocol="tcp" portid="995"><state state="open"/><service name="pop3s" product="Dovecot pop3d"/></port>
            <port protocol="tcp" portid="3306"><state state="open"/><service name="mysql" product="MySQL" version="8.0.25"/></port>
        </ports>
    </host>
</nmaprun>
"""

def test_thirteen_ports_nmap_xml():
    result = parse_nmap_xml(SAMPLE_13_PORTS_XML.encode('utf-8'))
    assert len(result["ports"]) == 13
    port_nums = [p["port_number"] for p in result["ports"]]
    expected_ports = [21, 22, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306]
    assert port_nums == expected_ports
    
    # Check service mappings
    svc_by_port = {p["port_number"]: p["service_name"] for p in result["ports"]}
    assert svc_by_port[21] == "FTP"
    assert svc_by_port[22] == "SSH"
    assert svc_by_port[25] == "SMTP"
    assert svc_by_port[53] == "DNS"
    assert svc_by_port[80] == "HTTP"
    assert svc_by_port[110] == "POP3"
    assert svc_by_port[143] == "IMAP"
    assert svc_by_port[443] == "HTTPS"
    assert svc_by_port[465] == "SMTPS"
    assert svc_by_port[587] == "Submission"
    assert svc_by_port[993] == "IMAPS"
    assert svc_by_port[995] == "POP3S"
    assert svc_by_port[3306] == "MySQL"

def test_api_import_13_ports_endpoint():
    response = client.post(
        "/api/nmap/import",
        files={"file": ("scan_13.xml", SAMPLE_13_PORTS_XML.encode('utf-8'), "application/xml")}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["ports"]) == 13

def test_nmap_not_installed(monkeypatch):
    import shutil
    import os
    from app.scanner import scanner
    monkeypatch.setattr(shutil, "which", lambda cmd: None)
    monkeypatch.setattr(os.path, "isfile", lambda path: False)
    with pytest.raises(RuntimeError, match="Nmap is not installed or is not available in PATH."):
        scanner.run_live_scan("127.0.0.1")

def test_scan_api_mode_parameter(monkeypatch):
    import subprocess
    import os
    from app.scanner import scanner
    
    command_executed = []
    def mock_run(cmd, **kwargs):
        command_executed.append(cmd)
        class MockResult:
            returncode = 0
            stdout = SAMPLE_13_PORTS_XML.encode('utf-8')
            stderr = b""
        return MockResult()

    monkeypatch.setattr("shutil.which", lambda cmd: "/usr/bin/nmap")
    monkeypatch.setattr(os.path, "isfile", lambda path: True)
    monkeypatch.setattr(subprocess, "run", mock_run)

    # Test full_tcp_service mode
    res = scanner.run_live_scan("192.168.1.50", scan_mode="full_tcp_service")
    assert len(res["ports"]) == 13
    assert "-p-" in command_executed[0]
    assert "-sV" in command_executed[0]
    assert "-oX" in command_executed[0]


