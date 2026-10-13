import os
import json
import datetime
import joblib
import numpy as np
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="UDAAN AI Dropout Prediction & Retention Intelligence API",
    description="Genuine ML-powered student risk early-warning and explainable support intelligence service.",
    version="1.0.0-techformers"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model artifact
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "udaan_model.joblib")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "model_metrics.json")

model_bundle = None
model_metrics = {}

try:
    if os.path.exists(MODEL_PATH):
        model_bundle = joblib.load(MODEL_PATH)
        print(f"Successfully loaded ML model artifact from {MODEL_PATH}")
    else:
        print(f"Model artifact not found at {MODEL_PATH}. Run train_model.py first.")
        
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            model_metrics = json.load(f)
except Exception as e:
    print(f"Error loading model: {e}")

# Schemas matching user specifications
class StudentFeatures(BaseModel):
    attendance_rate: float = Field(..., ge=0, le=100, description="Attendance rate percentage (0-100)")
    recent_average: float = Field(..., ge=0, le=100, description="Recent assessment score average (0-100)")
    previous_average: float = Field(..., ge=0, le=100, description="Prior term/baseline assessment score average (0-100)")
    recent_absence_trend: str = Field(..., description="Trend pattern: 'stable', 'increasing', or 'critical'")
    missed_assessments: Optional[int] = Field(0, ge=0, le=20, description="Count of missed tests/assignments")
    homework_completion_rate: Optional[float] = Field(None, ge=0, le=100, description="Homework completion rate (0-100)")

class PredictRequest(BaseModel):
    student_id: str = Field(..., description="Pseudonymous student ID e.g. ST-104")
    features: StudentFeatures

class ContributingFactor(BaseModel):
    factor: str
    direction: str  # "increases_estimated_risk" | "decreases_estimated_risk"
    importance: float

class PredictResponse(BaseModel):
    student_id: str
    prediction: str  # "on_track" | "review_recommended" | "urgent_review_recommended"
    risk_probability: float
    contributing_factors: List[ContributingFactor]
    model_version: str
    generated_at: str
    data_quality_warning: Optional[str] = None
    scientific_disclaimer: str = "This estimate reflects statistical risk patterns, not a diagnosis. Human review by school staff is required before intervention."

class SupportAction(BaseModel):
    action_type: str
    intensity: Optional[str] = "standard"

class SimulateInterventionRequest(BaseModel):
    student_id: str
    current_features: StudentFeatures
    proposed_actions: List[SupportAction]
    available_tutoring_capacity: int = 15
    available_staff_hours: int = 20

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "UDAAN AI Prediction Engine",
        "model_loaded": model_bundle is not None,
        "model_version": model_bundle.get("version", "1.0.0") if model_bundle else "unloaded",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.get("/api/model-info")
def get_model_info():
    if not model_metrics:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model metrics not loaded. Please train model first."
        )
    return model_metrics

@app.post("/api/predict", response_model=PredictResponse)
def predict_risk(req: PredictRequest):
    if not model_bundle:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Trained model artifact not available on server."
        )
    
    calibrated_model = model_bundle["calibrated_model"]
    scaler = model_bundle["scaler"]
    trend_map = model_bundle.get("trend_map", {"stable": 0, "increasing": 1, "critical": 2})
    threshold = model_bundle.get("threshold", 0.40)
    
    # Preprocess inputs
    trend_val = trend_map.get(req.features.recent_absence_trend.lower(), 1)
    
    # If homework completion rate wasn't provided, impute based on attendance and grades
    hw_comp = req.features.homework_completion_rate
    if hw_comp is None:
        hw_comp = float(np.clip(
            req.features.attendance_rate * 0.6 + req.features.recent_average * 0.4,
            20.0, 100.0
        ))
    
    missed_count = req.features.missed_assessments if req.features.missed_assessments is not None else 0
    
    raw_vector = np.array([[
        req.features.attendance_rate,
        req.features.recent_average,
        req.features.previous_average,
        trend_val,
        missed_count,
        hw_comp
    ]])
    
    # Scale features using fitted scaler
    scaled_vector = scaler.transform(raw_vector)
    
    # Model inference
    proba = float(calibrated_model.predict_proba(scaled_vector)[0, 1])
    
    # Risk prediction category
    if proba >= 0.65:
        prediction_cat = "urgent_review_recommended"
    elif proba >= threshold:
        prediction_cat = "review_recommended"
    else:
        prediction_cat = "on_track"
        
    # Explainable contributing factors calculation (Feature attribution based on scaled deviations)
    # Scaler means are baseline expectations for population
    means = scaler.mean_
    scales = scaler.scale_
    feature_names = [
        "Overall Attendance Rate",
        "Recent Assessment Average",
        "Historical Academic Baseline",
        "Absence Spike Velocity",
        "Missed Assessments",
        "Homework Completion Rate"
    ]
    
    factors: List[ContributingFactor] = []
    
    # 1. Attendance factor
    att_diff = (req.features.attendance_rate - means[0]) / scales[0]
    if req.features.attendance_rate < 82:
        factors.append(ContributingFactor(
            factor=f"Attendance rate ({req.features.attendance_rate:.1f}%) is below 82% threshold",
            direction="increases_estimated_risk",
            importance=round(min(0.48, abs(att_diff) * 0.18 + 0.15), 2)
        ))
    elif req.features.attendance_rate > 92:
        factors.append(ContributingFactor(
            factor=f"Consistent high attendance ({req.features.attendance_rate:.1f}%) provides strong protective buffer",
            direction="decreases_estimated_risk",
            importance=0.28
        ))
        
    # 2. Academic drop factor
    acad_delta = req.features.recent_average - req.features.previous_average
    if acad_delta < -8:
        factors.append(ContributingFactor(
            factor=f"Notable drop in assessment scores ({abs(acad_delta):.1f} pt decline)",
            direction="increases_estimated_risk",
            importance=round(min(0.40, abs(acad_delta) * 0.015 + 0.12), 2)
        ))
    elif req.features.recent_average < 50:
        factors.append(ContributingFactor(
            factor=f"Recent assessment average ({req.features.recent_average:.1f}%) in critical range",
            direction="increases_estimated_risk",
            importance=0.35
        ))
    elif req.features.recent_average > 75 and acad_delta >= 0:
        factors.append(ContributingFactor(
            factor=f"Solid academic performance ({req.features.recent_average:.1f}%)",
            direction="decreases_estimated_risk",
            importance=0.22
        ))
        
    # 3. Absence trend factor
    if req.features.recent_absence_trend.lower() in ["increasing", "critical"]:
        factors.append(ContributingFactor(
            factor=f"Absence trajectory flagged as '{req.features.recent_absence_trend}' over recent weeks",
            direction="increases_estimated_risk",
            importance=0.30 if req.features.recent_absence_trend.lower() == "increasing" else 0.42
        ))
        
    # 4. Missed assessments
    if missed_count >= 2:
        factors.append(ContributingFactor(
            factor=f"{missed_count} missed assessments in recent evaluation window",
            direction="increases_estimated_risk",
            importance=round(min(0.38, missed_count * 0.10 + 0.08), 2)
        ))

    # Sort factors by importance descending
    factors.sort(key=lambda x: x.importance, reverse=True)
    if not factors:
        factors.append(ContributingFactor(
            factor="Stable attendance and academic engagement within expected ranges",
            direction="decreases_estimated_risk",
            importance=0.20
        ))
        
    warning = None
    if req.features.attendance_rate < 30:
        warning = "Extreme low attendance values detected. Verify records for medical leave or administrative transfer."
        
    return PredictResponse(
        student_id=req.student_id,
        prediction=prediction_cat,
        risk_probability=round(proba, 2),
        contributing_factors=factors[:4],
        model_version=model_bundle.get("version", "1.0.0"),
        generated_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        data_quality_warning=warning
    )

@app.post("/api/simulate-intervention")
def simulate_intervention(req: SimulateInterventionRequest):
    """
    What-If Intervention Lab endpoint:
    Per scientific requirement: does NOT fabricate an instantaneous drop in dropout probability.
    Instead, calculates capacity feasibility, operational impact, recommended checkpoints,
    and target leading indicators to monitor.
    """
    tutoring_needed = any(a.action_type in ["tutoring_math", "tutoring_reading", "tutoring_general"] for a in req.proposed_actions)
    mentor_needed = any(a.action_type in ["teacher_checkin", "counselor_checkin"] for a in req.proposed_actions)
    
    feasibility_status = "feasible"
    constraints = []
    
    if tutoring_needed and req.available_tutoring_capacity < 2:
        feasibility_status = "capacity_constrained"
        constraints.append("Tutoring capacity is nearly exhausted (<2 slots remaining). Consider peer study circles or hybrid tutoring.")
    
    if mentor_needed and req.available_staff_hours < 3:
        feasibility_status = "staff_constrained"
        constraints.append("Support staff time is limited. Recommend scheduled 15-minute bi-weekly check-ins.")
        
    return {
        "student_id": req.student_id,
        "plan_status": "proposed_support_plan",
        "feasibility": feasibility_status,
        "resource_constraints": constraints,
        "actions_evaluated": len(req.proposed_actions),
        "leading_metrics_to_monitor": [
            {"metric": "Bi-weekly Attendance Rate", "target": "Maintain >= 85%", "checkpoint_days": 14},
            {"metric": "Next Module Assessment", "target": "Attain >= 60%", "checkpoint_days": 21},
            {"metric": "Homework Turn-in Rate", "target": "Reach >= 80%", "checkpoint_days": 10}
        ],
        "mandatory_process_steps": [
            "Convene informal 15-minute alignment check-in with student",
            "Notify assigned grade coordinator or counselor",
            "Establish shared goal sheet with student",
            "Log check-in progress on Follow-up Tracker at day 14"
        ],
        "scientific_integrity_note": "Interventions do not instantaneously reduce dropout risk. True progress is determined by sustained engagement and leading metric indicators."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
