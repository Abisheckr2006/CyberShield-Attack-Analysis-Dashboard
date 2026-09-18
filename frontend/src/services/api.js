import axios from 'axios';

const API_BASE_URL = '/api';

export const triggerScan = async (target, isDemo = false) => {
  const response = await axios.post(`${API_BASE_URL}/scan`, { target, is_demo: isDemo });
  return response.data;
};

export const getScanDetails = async (scanId) => {
  const response = await axios.get(`${API_BASE_URL}/scan/${scanId}`);
  return response.data;
};

export const getAllScans = async () => {
  const response = await axios.get(`${API_BASE_URL}/scans`);
  return response.data;
};

export const getScanSummary = async (scanId) => {
  const response = await axios.get(`${API_BASE_URL}/summary/${scanId}`);
  return response.data;
};

export const getScanPorts = async (scanId) => {
  const response = await axios.get(`${API_BASE_URL}/ports/${scanId}`);
  return response.data;
};

export const getScanFindings = async (scanId) => {
  const response = await axios.get(`${API_BASE_URL}/findings/${scanId}`);
  return response.data;
};

export const compareScans = async (prevScanId, currScanId) => {
  const response = await axios.post(`${API_BASE_URL}/compare`, null, {
    params: { prev_scan_id: prevScanId, curr_scan_id: currScanId }
  });
  return response.data;
};

export const getReportDownloadUrl = (scanId, format = 'pdf') => {
  return `${API_BASE_URL}/export/${scanId}?format=${format}`;
};

export const getLevel2Scenario = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/level2/scenario`);
    return response.data;
  } catch (err) {
    console.warn('Backend API unavailable for Level 2 scenario; returning client fallback data.', err);
    return getLevel2FallbackData();
  }
};

export const getLevel2FallbackData = () => ({
  scenario_id: "problem_11",
  title: "Problem 11 — The Fake Invoice at the Regional Credit Union",
  subtitle: "How the Attack Happened?",
  target_organization: "Regional Credit Union",
  target_domain: "finance.example.org",
  severity: "HIGH / CRITICAL DEFENSIVE SCENARIO",
  status: "CONTAINED",
  is_demo: true,
  data_disclaimer: "SYNTHETIC / DEMO DATA",
  summary_metrics: {
    events: 6,
    mitre: 4,
    alerts: 1,
    status: "CONTAINED"
  },
  timeline: [
    {
      id: "evt-1",
      time: "08:10",
      event: "External Service Mapping",
      stage_number: "01",
      stage_title: "RECON / EXTERNAL SERVICE MAPPING",
      stage: "Reconnaissance",
      what_happened: "The attacker identifies finance.example.org and maps the organization's externally visible services.",
      evidence: "Synthetic scenario event.",
      evidence_type: "Synthetic Scenario Event",
      source: "Network Telemetry",
      technique: "N/A",
      severity: "Medium",
      status: "Observed",
      security_analysis: "This event represents the initial external reconnaissance phase where public-facing infrastructure is cataloged.",
      defensive_observation: "Maintain accurate inventory of externally visible services.",
      telemetry_source: "Perimeter Firewall / DNS Logs",
      related_events: []
    },
    {
      id: "evt-2",
      time: "08:24",
      event: "Weaponized Invoice Opened",
      stage_number: "02",
      stage_title: "INITIAL ACCESS / WEAPONIZED INVOICE",
      stage: "Initial Access",
      what_happened: "An accounts-payable employee opens a weaponized invoice document, representing the initial access or access path.",
      evidence: "Synthetic scenario event.",
      evidence_type: "Synthetic Scenario Event",
      source: "Email / Endpoint Telemetry",
      technique: "T1566.001",
      severity: "High",
      status: "Simulated",
      security_analysis: "This event represents the initial access stage in the fictional scenario where email payload execution occurs.",
      defensive_observation: "Monitor suspicious document activity using appropriate email and endpoint security controls.",
      telemetry_source: "Secure Email Gateway / Endpoint EDR",
      related_events: ["evt-3", "evt-4", "evt-5"]
    },
    {
      id: "evt-3",
      time: "09:05",
      event: "Account Discovery",
      stage_number: "03",
      stage_title: "ACCOUNT DISCOVERY",
      stage: "Discovery",
      what_happened: "The attacker validates access, discovers member accounts and payment operations, and avoids controls that would immediately trigger an alert.",
      evidence: "Synthetic scenario event.",
      evidence_type: "Synthetic Scenario Event",
      source: "Identity Telemetry",
      technique: "T1087",
      severity: "High",
      status: "Simulated",
      security_analysis: "This event represents low-velocity internal identity and privilege enumeration within the target environment.",
      defensive_observation: "Monitor unusual account and identity activity.",
      telemetry_source: "Active Directory / Directory Audit Logs",
      related_events: ["evt-2", "evt-4", "evt-5"]
    },
    {
      id: "evt-4",
      time: "10:40",
      event: "Collection / Limited Movement",
      stage_number: "04",
      stage_title: "COLLECTION / LIMITED MOVEMENT",
      stage: "Collection",
      what_happened: "The attacker attempts collection and limited movement toward systems supporting member accounts and payment operations.",
      evidence: "Synthetic scenario event.",
      evidence_type: "Synthetic Scenario Event",
      source: "Network / Endpoint Telemetry",
      technique: "T1041",
      severity: "High",
      status: "Simulated",
      security_analysis: "This event represents staging and data gathering targeting financial payment operations shares.",
      defensive_observation: "Inspect unusual outbound volume and destinations.",
      telemetry_source: "SMB File Share Audit / NetFlow Telemetry",
      related_events: ["evt-2", "evt-3", "evt-5"]
    },
    {
      id: "evt-5",
      time: "13:15",
      event: "Anomalous Event Detected",
      stage_number: "05",
      stage_title: "ANOMALOUS EVENT DETECTED",
      stage: "Detection",
      what_happened: "A defender notices an anomalous login, transfer, configuration change, or endpoint event and begins triage.",
      evidence: "Synthetic scenario event.",
      evidence_type: "Synthetic Scenario Event",
      source: "Authentication / Endpoint Telemetry",
      technique: "T1071.001",
      severity: "High",
      status: "Detected",
      security_analysis: "This is the primary SOC SIEM correlation detection point where suspicious cross-vector activities trigger defender triage.",
      defensive_observation: "Investigate anomalous authentication, transfer, configuration, or endpoint events.",
      telemetry_source: "SOC SIEM Correlation Engine / EDR Alerts",
      related_events: ["evt-2", "evt-3", "evt-4", "evt-6"]
    },
    {
      id: "evt-6",
      time: "15:00",
      event: "Access Revoked / Containment",
      stage_number: "06",
      stage_title: "ACCESS REVOKED / CONTAINMENT",
      stage: "Containment",
      what_happened: "Access is revoked, affected credentials or hosts are contained, and evidence is preserved for recovery and review.",
      evidence: "Synthetic scenario event.",
      evidence_type: "Synthetic Scenario Event",
      source: "Identity / Endpoint Telemetry",
      technique: "N/A",
      severity: "High",
      status: "Contained",
      security_analysis: "Defensive containment actions are completed, severing access, isolating hosts, and securing evidence.",
      defensive_observation: "Revoke access, contain affected systems, preserve evidence, and begin recovery/review.",
      telemetry_source: "IAM Admin Logs / NAC Network Switch Logs",
      related_events: ["evt-5"]
    }
  ],
  mitre_matrix: [
    {
      technique_id: "T1566.001",
      technique_name: "Spearphishing Attachment",
      stage: "Initial Access",
      scenario_mapping: "Weaponized invoice",
      defensive_observation: "Monitor suspicious attachments and endpoint activity"
    },
    {
      technique_id: "T1087",
      technique_name: "Account Discovery",
      stage: "Discovery",
      scenario_mapping: "Available identities/roles discovered",
      defensive_observation: "Monitor unusual identity activity"
    },
    {
      technique_id: "T1041",
      technique_name: "Exfiltration Over C2 Channel",
      stage: "Collection / Transfer",
      scenario_mapping: "Controlled transfer attempt",
      defensive_observation: "Monitor unusual outbound volume and destinations"
    },
    {
      technique_id: "T1071.001",
      technique_name: "Web Protocols",
      stage: "Communication Layer",
      scenario_mapping: "Web traffic used as communication layer",
      defensive_observation: "Monitor proxy, DNS and endpoint telemetry"
    }
  ],
  detection_analysis: {
    title: "🚨 ANOMALOUS EVENT DETECTED",
    time: "13:15",
    event: "Anomalous login / transfer / configuration / endpoint event",
    status: "DETECTED",
    evidence: "Synthetic scenario event (DEMO DATA)",
    why_suspicious: "Multi-vector correlation flagged off-hours authentication and file share activity following suspicious endpoint process execution.",
    related_events: [
      { time: "08:24", stage: "Initial Access", description: "Weaponized Invoice Opened" },
      { time: "09:05", stage: "Account Discovery", description: "Identity Enumeration" },
      { time: "10:40", stage: "Collection / Limited Movement", description: "Financial Share Staging" }
    ],
    recommended_investigation: [
      "Review authentication logs",
      "Review endpoint telemetry",
      "Review relevant network telemetry",
      "Review proxy/DNS/application logs",
      "Determine whether the events are related"
    ]
  }
});
