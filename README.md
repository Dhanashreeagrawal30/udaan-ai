# UDAAN AI — Premium Student Retention Intelligence Platform
> *"See the signals. Support the student. Change the outcome."*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-176B68?style=for-the-badge&logo=githubpages&logoColor=white)](https://dhanashreeagrawal30.github.io/udaan-ai/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-142B3B?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dhanashreeagrawal30/udaan-ai)
[![Techformers 2026](https://img.shields.io/badge/Hackathon-TECHFORMERS%202026-E9A23B?style=for-the-badge)](https://github.com/Dhanashreeagrawal30/udaan-ai)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-03%3A%20Dropout%20Prediction-D9675D?style=for-the-badge)](https://github.com/Dhanashreeagrawal30/udaan-ai)

---

## 🌐 Live Application Link

Experience the fully responsive interactive platform directly in your browser:

### 🔗 **[https://dhanashreeagrawal30.github.io/udaan-ai/](https://dhanashreeagrawal30.github.io/udaan-ai/)**

---

## 1. Executive Summary & Vision

Traditional educational dropout prevention systems operate reactively: flagging students only after sustained truancy, chronic failure, or disciplinary disengagement have made recovery difficult.

**UDAAN AI** shifts school operations from post-mortem intervention to proactive, compassionate, and human-centered retention intelligence.

### Core Philosophy
> *“Don't just predict who may drop out. Discover the warning signs, find the right support, and help every student move forward.”*

UDAAN AI couples genuine machine-learning early-warning indicators with a resource-aware **What-If Intervention Lab**, transforming raw statistical alerts into feasible, educator-led support plans.

Never implying that a prediction is a diagnosis or certainty: **mandatory human review** by school educators is required before taking any action.

---

## 2. Key Capabilities & Product Features

| Feature | Description |
| :--- | :--- |
| **Calibrated Risk Prediction** | Genuine scikit-learn classification ensemble trained with Sigmoid calibration, delivering non-punitive probabilistic estimates. |
| **Explainable Factor Reports** | Decomposes composite risk into human-auditable directional factors (attendance velocity, recent subject micro-drops, missed assessments). |
| **The What-If Intervention Lab** | *Signature Feature:* Interactive workspace allowing counselors to simulate 6 evidence-based support actions against live school resource constraints. |
| **Statistical Drift Detector** | Time-series analyzer flagging students exhibiting sudden deceleration in attendance or assessment scores before standard thresholds trip. |
| **School Resource Matcher** | Tracks live capacity of tutoring slots, faculty mentoring hours, and welfare referrals, preventing overcommitment of scarce staff time. |
| **Longitudinal Follow-up Loop** | Scheduled check-in milestones (7, 14, 21, 30 days) with qualitative educator notes and observational outcome tracking. |
| **Responsible AI & Privacy** | Strict pseudonymity (`ST-104`), mandatory human-in-the-loop review, and explicit disclaimers separating correlation from causation. |

---

## 3. Technology Architecture

```
                          ┌───────────────────────────────────┐
                          │         UDAAN AI PLATFORM         │
                          └─────────────────┬─────────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    ┌──────────────────────┐                                  ┌──────────────────────┐
    │  Frontend Web Client │                                  │   Python ML Backend  │
    │  (React 19 + Vite)   │                                  │   (FastAPI + Sklearn)│
    ├──────────────────────┤                                  ├──────────────────────┤
    │ • 9 Working Routes   │◄────── REST API (Port 8000) ────►│ • POST /api/predict  │
    │ • Tailwind CSS v4    │                                  │ • GET /api/model-info│
    │ • Local Storage Sync │                                  │ • POST /api/simulate │
    │ • Embedded ML Engine │                                  │ • Scaler + Model Joblib
    └──────────────────────┘                                  └──────────────────────┘
               │                                                         │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
                               ┌─────────────────────────┐
                               │   PostgreSQL / Supabase │
                               │   Schema & RLS Policies │
                               └─────────────────────────┘
```

---

## 4. Machine Learning Model & Scientific Evaluation

The model was developed following empirical Early Warning Indicator (EWI) literature (Chicago Consortium on School Research & Johns Hopkins University):
- **Algorithm:** Calibrated `RandomForestClassifier` with Sigmoid probability calibration (`CalibratedClassifierCV`).
- **Feature Pipeline:** Standard scaling on continuous features (`attendance_rate`, `recent_average`, `previous_average`, `homework_completion_rate`, `missed_assessments`) and mapped ordinal encoding for `recent_absence_trend`.
- **Decision Threshold:** Configured at **0.40** to favor high recall—ensuring vulnerable students are flagged for supportive review rather than overlooked.

### Held-Out Test Set Performance (N=875)
- **ROC-AUC Score:** `0.9495`
- **Test Accuracy:** `90.86%`
- **Recall (Sensitivity):** `75.59%` (Prioritizes early retention identification)
- **Precision:** `66.21%`
- **F1-Score:** `0.7059`
- **Brier Calibration Score:** `0.0594` (Indicates well-calibrated probabilities)

---

## 5. API Specification

### `POST /api/predict`
Calculates student retention risk probability and returns directional contributing factors.

**Request Payload:**
```json
{
  "student_id": "ST-104",
  "features": {
    "attendance_rate": 62.0,
    "recent_average": 48.0,
    "previous_average": 72.0,
    "recent_absence_trend": "increasing",
    "missed_assessments": 3,
    "homework_completion_rate": 42.0
  }
}
```

**Response Payload:**
```json
{
  "student_id": "ST-104",
  "prediction": "urgent_review_recommended",
  "risk_probability": 0.76,
  "contributing_factors": [
    {
      "factor": "Attendance rate (62.0%) is below 82% threshold",
      "direction": "increases_estimated_risk",
      "importance": 0.48
    },
    {
      "factor": "Notable drop in assessment scores (24.0 pt decline)",
      "direction": "increases_estimated_risk",
      "importance": 0.40
    },
    {
      "factor": "Absence trajectory flagged as 'increasing' over recent weeks",
      "direction": "increases_estimated_risk",
      "importance": 0.30
    }
  ],
  "model_version": "1.0.0-techformers",
  "generated_at": "2026-10-13T20:08:47.831732+00:00",
  "data_quality_warning": null,
  "scientific_disclaimer": "This estimate reflects statistical risk patterns, not a diagnosis. Human review by school staff is required before intervention."
}
```

---

## 6. Project Navigation & Routes

1. **`/`** — Editorial Landing Page with vision, 4-stage workflow, and AI ethics commitments.
2. **`/dashboard`** — School Overview with dynamic KPI cards, weekly attendance trajectory chart, risk distribution, and urgent queue.
3. **`/students`** — Pseudonymized Student Directory with search, filters, pagination, add student modal, and CSV bulk import.
4. **`/students/:id`** — Individual Student Profile with longitudinal attendance timeline, assessment history, explainable factor cards, and educator note logger.
5. **`/risk-analysis`** — Risk & Drift Analytics with configurable sensitivity thresholds and held-out model diagnostic telemetry.
6. **`/intervention-lab`** — *Signature Workspace:* Interactive What-If Intervention Lab with multi-action simulation, live resource gauges, feasibility evaluation, and side-by-side plan comparison.
7. **`/follow-ups`** — Intervention Follow-up Tracker with milestone updates, qualitative progress logging, and confetti feedback.
8. **`/reports`** — Executive Reporting surface with print brief and anonymized CSV data export.
9. **`/settings`** — RBAC role switcher (Admin, Teacher, Support Staff), ML service diagnostics, school capacity controls, and Responsible AI framework.

---

## 7. Local Setup & Quickstart

### Prerequisites
- Node.js v18+ (tested on Node v24)
- Python 3.10+ (tested on Python 3.11)

### 1. Launch Python FastAPI Backend
```bash
cd backend
# Create virtual environment & install dependencies
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run model training & calibration
python train_model.py

# Start API server
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Launch React Frontend
```bash
cd frontend
npm install
npm run dev
```
Navigate to **`http://127.0.0.1:5173/`** in your browser.

---

## 8. Responsible AI & Student Privacy Commitments
- **Zero Automated Discipline:** Predictions never trigger exclusionary, disciplinary, or punitive actions.
- **Mandatory Human Review:** Predictions indicate an invitation for support, not a medical or academic diagnosis.
- **Data Minimization:** Student PII is masked behind pseudonyms (`ST-104`).
- **Methodological Transparency:** All outcome notes record observed correlations rather than claiming proven causal certainty.
