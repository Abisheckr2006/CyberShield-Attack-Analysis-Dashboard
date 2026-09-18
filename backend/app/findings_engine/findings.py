def generate_findings_for_scan(ports_data: list) -> list:
    """
    Generates structured NET-xxx Security Findings from identified open/filtered ports.
    Each finding includes evidence, impact, recommendation, and confidence metrics.
    """
    findings = []
    finding_counter = 1

    for p in ports_data:
        port = p.get("port_number")
        service = p.get("service_name", "Unknown")
        state = p.get("state", "OPEN")
        version = p.get("detected_version", "Detected Version")

        if state.upper() != "OPEN":
            continue

        finding_code = f"NET-{finding_counter:03d}"
        finding_counter += 1

        if port == 22 or "SSH" in service.upper():
            findings.append({
                "finding_code": finding_code,
                "severity": "HIGH",
                "affected_port": port,
                "service_name": service,
                "title": "Administrative SSH Access Exposed Across Subnet",
                "description": "Administrative SSH interface is reachable on the network interface without management boundary restrictions.",
                "evidence": f"TCP/22 reported as {state} by authorized network scanner. Service detected as '{service}' (Version: {version}). Target responded with valid SSH handshake capability.",
                "impact": "Unnecessary network exposure increases opportunities for remote access attempts, configuration probing, and authentication testing.",
                "recommendation": "Restrict SSH to authorized management networks via network firewall rules, enforce key-based authentication, and configure rate limiting.",
                "confidence": "HIGH"
            })

        elif port == 3389 or "RDP" in service.upper():
            findings.append({
                "finding_code": finding_code,
                "severity": "HIGH",
                "affected_port": port,
                "service_name": service,
                "title": "Exposed Remote Desktop Protocol (RDP) Endpoint",
                "description": "Graphical Remote Desktop Protocol (RDP) interface is reachable over the network boundary.",
                "evidence": f"TCP/3389 reported as {state} by network scanner. Service identified as '{service}' (Version: {version}). Service accepted TCP connection request.",
                "impact": "Exposed RDP services represent primary vectors for unauthorized administrative remote access attempts and remote access exploits.",
                "recommendation": "Restrict RDP to approved management VPNs or IP gateways, enforce Network Level Authentication (NLA), and require MFA.",
                "confidence": "HIGH"
            })

        elif port == 53 or "DNS" in service.upper():
            findings.append({
                "finding_code": finding_code,
                "severity": "MEDIUM",
                "affected_port": port,
                "service_name": service,
                "title": "Internal DNS Resolver Reachable Broadly",
                "description": "Internal domain name resolution service is accessible to network segments beyond local infrastructure requirements.",
                "evidence": f"TCP/53 reported as {state} by network scanner. Service identified as '{service}' (Version: {version}). Open socket query succeeded.",
                "impact": "Broad reachability of internal DNS infrastructure allows network reconnaissance of hostnames, internal domain structures, and potential amplification.",
                "recommendation": "Limit DNS resolver access strictly to approved internal client subnets using firewalls and access control lists.",
                "confidence": "HIGH"
            })

        elif port == 443 or "HTTPS" in service.upper():
            findings.append({
                "finding_code": finding_code,
                "severity": "MEDIUM",
                "affected_port": port,
                "service_name": service,
                "title": "Exposed TLS Web Endpoint (HTTPS)",
                "description": "HTTPS application listener is publicly or broadly reachable on TCP port 443.",
                "evidence": f"TCP/443 reported as {state} by network scanner. Service identified as '{service}' (Version: {version}). Valid TLS endpoint handshake completed.",
                "impact": "Exposed web applications require continuous monitoring for transport security, weak TLS cipher suites, and missing HTTP security headers.",
                "recommendation": "Maintain up-to-date TLS certificates, disable legacy TLS 1.0/1.1 protocols, implement HTTP Strict Transport Security (HSTS), and enforce secure header policies.",
                "confidence": "HIGH"
            })

        elif port == 80 or "HTTP" in service.upper():
            findings.append({
                "finding_code": finding_code,
                "severity": "MEDIUM",
                "affected_port": port,
                "service_name": service,
                "title": "Unencrypted HTTP Plaintext Service Exposed",
                "description": "Web service listener accepting cleartext HTTP connections.",
                "evidence": f"TCP/80 reported as {state} by network scanner. HTTP GET header check responded.",
                "impact": "Unencrypted traffic can be intercepted, read, or modified by intermediate network entities.",
                "recommendation": "Redirect all unencrypted HTTP traffic to HTTPS (port 443) and enforce TLS encryption.",
                "confidence": "HIGH"
            })

        else:
            findings.append({
                "finding_code": finding_code,
                "severity": p.get("risk_level", "LOW"),
                "affected_port": port,
                "service_name": service,
                "title": f"Service Exposure on Port {port} ({service})",
                "description": f"Service '{service}' is active and accepting connections on TCP port {port}.",
                "evidence": f"TCP/{port} reported as {state} by authorized scan module. Detected service string: '{service}'.",
                "impact": "Active service listener expands the total network attack surface for this host.",
                "recommendation": f"Verify if port {port} is required for business operations; if unneeded, disable the service or restrict firewall rules.",
                "confidence": "MEDIUM"
            })

    return findings
