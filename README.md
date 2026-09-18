# Defensive SOC Security Dashboard (Level 1 & Level 2)

A complete, modern, professional defensive network security exposure assessment and attack-analysis web application designed for authorized systems, cybersecurity labs, and SOC environment demonstrations.

> **AUTHORIZATION & SAFETY NOTICE:** Authorized defensive assessment and training analysis only. Problem 11 is a fictional defensive training scenario using synthetic/demo data.

---

## 1. Project Objective & Scope

This application provides a two-level defensive SOC suite:

### Level 1 — Network Security Exposure Assessment (What Was Exposed)
- Safe, non-destructive network port scanning and service version discovery.
- Transparent exposure classification (Public, Management, Internal, Unknown).
- Educational security weakness analysis (`NET-001`, `NET-002`, etc.).
- Continuous monitoring through historical scan logging and delta comparisons.
- Formatted PDF, CSV, and JSON security assessment report exports.

### Level 2 — Cybersecurity Attack Analysis (How the Attack Happened?)
- **Scenario:** *Problem 11 — The Fake Invoice at the Regional Credit Union*
- **Interactive Attack Timeline:** Chronological progression across 6 key timeline events (08:10, 08:24, 09:05, 10:40, 13:15, 15:00).
- **MITRE ATT&CK Matrix:** Dedicated mapping of scenario techniques (`T1566.001`, `T1087`, `T1041`, `T1071.001`).
- **Security Events Table:** Filterable synthetic event telemetry marked `DEMO / SYNTHETIC DATA`.
- **Detection Analysis Section:** SOC SIEM alert correlation (`🚨 ANOMALOUS EVENT DETECTED` at 13:15), related event chains, and recommended defensive investigation checklists.
- **Scenario Event Correlation:** Visual chain mapping event progression from initial access to access revocation.
- **Story Mode (Walkthrough):** Step-by-step interactive attack analysis controls (`[ PREVIOUS ]`, `[ NEXT ]`, `[ PLAY ]`, `[ PAUSE ]`).
- **Attack View vs Defender View:** Dual view toggle analyzing events from both attacker timeline and defender triage perspectives.

---

## 2. Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS v4, Lucide React icons, Recharts visualization library.
- **Backend:** Python 3.10+, FastAPI framework, Uvicorn ASGI server.
- **Database:** SQLite 3 (ORM configured via SQLAlchemy for easy PostgreSQL migration).
- **Scan Engine:** Safe Nmap subprocess engine with automatic fallback to standard library Python socket checks.
- **Reporting Engine:** ReportLab PDF generator, CSV exporter, JSON payload formatter.

---

## 3. Level 2 Backend API Endpoints

- `GET /api/level2/scenario` — Full scenario dataset for Problem 11
- `GET /api/level2/timeline` — Chronological 6-stage timeline events
- `GET /api/level2/events` — Synthetic security events list
- `GET /api/level2/mitre` — MITRE ATT&CK technique mapping matrix
- `GET /api/level2/summary` — Top summary cards metrics (`events=6`, `mitre=4`, `alerts=1`, `status=CONTAINED`)
- `GET /api/level2/event/{id}` — Individual timeline event details by ID or time

---

## 4. Installation & Setup Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Step 1: Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtualenv:
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will run at: `http://localhost:8000`

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Dashboard will run at: `http://localhost:5173`

---

## 5. Demo & Evaluation Mode

- **Level 1 Demo Mode:** Click **[LOAD DEMO SCENARIO]** on the Level 1 dashboard to evaluate safe network scanning capabilities.
- **Level 2 Attack Analysis:** Click **Level 2: Attack Analysis** in the sidebar to load the Problem 11 Credit Union attack scenario. Toggle between `[ ATTACK VIEW ]` and `[ DEFENDER VIEW ]` or launch **[ START ATTACK ANALYSIS ]** Story Mode.
