def evaluate_port_risk_and_exposure(port: int, service_name: str, state: str, version: str = ""):
    """
    Evaluates risk level, exposure category, and educational context for an open/filtered port.
    Returns a dictionary containing risk_level, exposure_category, summary, why_it_matters, weakness, and recommendation.
    """
    service_upper = service_name.upper()
    
    # Defaults
    risk_level = "LOW"
    exposure = "Internal"
    summary = f"Port {port} ({service_name}) is reachable."
    why_it_matters = "Open network ports increase attack surface if unneeded services are exposed."
    weakness = "Service accessibility beyond authorized boundaries."
    recommendation = "Enforce firewall rules and restrict network access to required hosts."

    # Specific Level 1 representative rules
    if port == 22 or "SSH" in service_upper:
        risk_level = "HIGH"
        exposure = "Management"
        summary = "Administrative SSH remote access service exposed."
        why_it_matters = "Administrative SSH access should be strictly restricted to approved management networks."
        weakness = "Administrative shell interface accessible beyond secure management subnet."
        recommendation = "Restrict SSH access to approved management IP ranges via firewall/VPN and enforce key-based authentication."

    elif port == 3389 or "RDP" in service_upper:
        risk_level = "HIGH"
        exposure = "Management"
        summary = "Remote Desktop Protocol (RDP) service exposed."
        why_it_matters = "RDP exposes full graphical administrative access, making it a high-value target for unauthorized access."
        weakness = "Remote desktop management protocol accessible across network boundaries."
        recommendation = "Restrict RDP access behind a Secure Management Gateway/VPN and enforce Multi-Factor Authentication (MFA)."

    elif port == 53 or "DNS" in service_upper:
        risk_level = "MEDIUM"
        exposure = "Internal"
        summary = "DNS resolver service broadly reachable."
        why_it_matters = "DNS resolvers should only be reachable from approved internal client subnets to prevent amplification and cache poisoning."
        weakness = "Internal name resolution service accessible to non-essential network segments."
        recommendation = "Limit DNS resolver access to approved internal network segments using host and network firewalls."

    elif port == 443 or "HTTPS" in service_upper or "TLS" in service_upper:
        risk_level = "MEDIUM"
        exposure = "Public"
        summary = "TLS encrypted HTTP application endpoint exposed."
        why_it_matters = "Public HTTPS endpoints are standard for web traffic but require proper TLS configuration and header hardening."
        weakness = "Exposed web interface requires ongoing transport security and header validation."
        recommendation = "Maintain valid TLS certificates, disable legacy SSL/TLS versions (TLS 1.0/1.1), and apply HTTP security headers."

    elif port == 80 or "HTTP" in service_upper:
        risk_level = "MEDIUM"
        exposure = "Public"
        summary = "Unencrypted HTTP web service exposed."
        why_it_matters = "Cleartext HTTP traffic can be intercepted or manipulated in transit."
        weakness = "Unencrypted web application interface exposed."
        recommendation = "Enforce HTTPS encryption (redirect HTTP traffic to HTTPS port 443) and enable HSTS."

    elif port == 23 or "TELNET" in service_upper:
        risk_level = "CRITICAL"
        exposure = "Management"
        summary = "Legacy unencrypted Telnet administrative interface exposed."
        why_it_matters = "Telnet transmits administrative credentials in plain text over the network."
        weakness = "Obsolete cleartext administration protocol active on network."
        recommendation = "Immediately disable Telnet and replace with encrypted SSH administration."

    elif port in [445, 139] or "SMB" in service_upper:
        risk_level = "HIGH"
        exposure = "Internal"
        summary = "Server Message Block (SMB) network share exposed."
        why_it_matters = "SMB file sharing protocols are frequent targets for lateral movement when exposed."
        weakness = "Network file sharing interface exposed beyond dedicated file server subnets."
        recommendation = "Restrict SMB traffic to internal storage VLANs and disable SMBv1."

    elif port in [3306, 5432, 1433, 1521, 27017, 6379] or any(db in service_upper for db in ["MYSQL", "POSTGRES", "MSSQL", "ORACLE", "MONGO", "REDIS"]):
        risk_level = "HIGH"
        exposure = "Internal"
        summary = f"Database service ({service_name}) exposed directly on network."
        why_it_matters = "Database instances store sensitive data and should never be exposed to public or general subnets."
        weakness = "Direct database access listener accessible on generic network interface."
        recommendation = "Bind database listeners to localhost (127.0.0.1) or dedicated private backend networks."

    # If state is filtered
    if state.upper() == "FILTERED":
        summary += " (Filtered by Firewall)"
        why_it_matters += " A firewall or ACL is actively dropping or blocking probe packets."

    return {
        "risk_level": risk_level,
        "exposure_category": exposure,
        "finding_summary": summary,
        "why_it_matters": why_it_matters,
        "weakness": weakness,
        "recommendation": recommendation
    }
