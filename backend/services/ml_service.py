import os
import json
import joblib
import pandas as pd
from fastapi import HTTPException
from backend.schemas.ml import CancellationPredictionRequest, CancellationPredictionResponse

_model = None
_metrics = None

def load_model_and_metrics():
    global _model, _metrics
    if _model is not None and _metrics is not None:
        return _model, _metrics

    model_path = os.path.join(os.path.dirname(__file__), "../../ml/models/cancellation_predictor_v1.joblib")
    metrics_path = os.path.join(os.path.dirname(__file__), "../../ml/metrics/cancellation_predictor_v1.json")
    
    if not os.path.exists(model_path):
        raise HTTPException(status_code=503, detail="Cancellation predictor model artifact not found.")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=503, detail="Cancellation predictor metrics artifact not found.")
        
    try:
        _model = joblib.load(model_path)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Failed to load model artifact: {e}")
        
    try:
        with open(metrics_path, "r") as f:
            _metrics = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Failed to load metrics artifact: {e}")
        
    return _model, _metrics

def predict_cancellation_risk(request: CancellationPredictionRequest) -> CancellationPredictionResponse:
    model, metrics = load_model_and_metrics()
    
    # Convert request to DataFrame matching the training schema exactly
    req_dict = request.model_dump()
    df = pd.DataFrame([req_dict])
    
    try:
        pred = model.predict(df)[0]
        prob = model.predict_proba(df)[0][1]
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Model inference failed: {e}")
        
    # Determine risk level based on probability
    # Demo risk threshold logic (Not calibrated/statistically optimal)
    if prob < 0.30:
        risk_level = "Low"
    elif prob < 0.70:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    return CancellationPredictionResponse(
        prediction=int(pred),
        cancellation_probability=float(prob),
        risk_level=risk_level,
        model_name=metrics.get("model_name", "CancellationPredictor"),
        model_version=metrics.get("model_version", "v1.0"),
        algorithm=metrics.get("algorithm", "RandomForestClassifier"),
        dataset_source=metrics.get("dataset_source", "Unknown"),
        evaluation_metrics={
            "roc_auc": metrics.get("metrics", {}).get("roc_auc"),
            "f1": metrics.get("metrics", {}).get("f1"),
            "precision": metrics.get("metrics", {}).get("precision"),
        },
        key_input_features=req_dict
    )
