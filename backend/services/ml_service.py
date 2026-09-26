import os
import json
import joblib
import pandas as pd
from fastapi import HTTPException
from backend.schemas.ml import CancellationPredictionRequest, CancellationPredictionResponse, DemandForecastResponse, DailyDemandForecast, EventSignal
import datetime
from datetime import timedelta
import numpy as np

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

_demand_model = None
_demand_metrics = None

def load_demand_model_and_metrics():
    global _demand_model, _demand_metrics
    if _demand_model is not None and _demand_metrics is not None:
        return _demand_model, _demand_metrics

    model_path = os.path.join(os.path.dirname(__file__), "../../ml/models/demand_forecaster_v1.joblib")
    metrics_path = os.path.join(os.path.dirname(__file__), "../../ml/metrics/demand_forecaster_v1.json")
    
    if not os.path.exists(model_path):
        raise HTTPException(status_code=503, detail="Demand forecaster model artifact not found.")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=503, detail="Demand forecaster metrics artifact not found.")
        
    try:
        _demand_model = joblib.load(model_path)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Failed to load demand model artifact: {e}")
        
    try:
        with open(metrics_path, "r") as f:
            _demand_metrics = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Failed to load demand metrics artifact: {e}")
        
    return _demand_model, _demand_metrics

def predict_demand_forecast(base_date: datetime.date = None) -> DemandForecastResponse:
    if base_date is None:
        base_date = datetime.date.today()
        
    model_data, metrics = load_demand_model_and_metrics()
    model = model_data["model"]
    feature_cols = model_data["feature_cols"]
    
    # === INFERENCE DATA SOURCE: C — SIMULATED/SYNTHETIC ===
    # Smart Resort does NOT yet have a real historical booking dataset
    # matching this public benchmark model's training distribution.
    # We synthesize a statistically plausible 35-day history (mean ≈ 95, std ≈ 15)
    # seeded deterministically from today's date so the demo is reproducible
    # but stable. This is acknowledged in the API response and UI.
    np.random.seed(int(base_date.strftime("%Y%m%d")))  # Deterministic for same base_date
    history_days = 35
    hist_dates = [base_date - timedelta(days=i) for i in range(history_days, 0, -1)]
    # Simulated demand around the public benchmark mean (~94.8), std=15
    hist_demand = np.clip(np.random.normal(95, 15, history_days), 20, 180).astype(int)
    
    # We also need to build features for the 7 forecast days.
    # We will compute lags based on hist_demand.
    forecast_dates = [base_date + timedelta(days=i) for i in range(7)]
    
    # To compute rolling stats safely for 7 days ahead (h=7), we pretend the last known day is base_date-1.
    # Meaning lag_7 for forecast day 0 (base_date) is hist_demand for (base_date-7).
    # Since we need to forecast 7 days, we can just build a dataframe of history + forecast horizon,
    # then compute shift/rolling over it.
    
    df_dates = hist_dates + forecast_dates
    df = pd.DataFrame({"arrival_date": df_dates})
    df["arrival_date"] = pd.to_datetime(df["arrival_date"])
    
    # Only fill demand for history, leave forecast as NaN to prove no leakage
    demand_values = list(hist_demand) + [np.nan] * 7
    df["demand"] = demand_values
    
    df["day_of_week"] = df["arrival_date"].dt.dayofweek
    df["day_of_month"] = df["arrival_date"].dt.day
    df["week_of_year"] = df["arrival_date"].dt.isocalendar().week.astype(int)
    df["month"] = df["arrival_date"].dt.month
    df["quarter"] = df["arrival_date"].dt.quarter
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)
    df["is_monday"] = (df["day_of_week"] == 0).astype(int)
    df["is_friday"] = (df["day_of_week"] == 4).astype(int)
    
    def get_season(month):
        if month in [12, 1, 2]: return 1
        elif month in [3, 4, 5]: return 2
        elif month in [6, 7, 8]: return 3
        else: return 4
    df["seasonal_period"] = df["month"].apply(get_season)
    
    # Safe lags and rolling
    # The model was trained with: df['lag_7'] = df['demand'].shift(7)
    df["lag_7"] = df["demand"].shift(7)
    df["lag_14"] = df["demand"].shift(14)
    df["lag_28"] = df["demand"].shift(28)
    
    shifted_demand = df["demand"].shift(7)
    df["rolling_mean_7"] = shifted_demand.rolling(7).mean()
    df["rolling_mean_14"] = shifted_demand.rolling(14).mean()
    df["rolling_mean_28"] = shifted_demand.rolling(28).mean()
    df["rolling_std_7"] = shifted_demand.rolling(7).std().fillna(0)
    df["rolling_std_14"] = shifted_demand.rolling(14).std().fillna(0)
    df["rolling_std_28"] = shifted_demand.rolling(28).std().fillna(0)
    df["recent_trend"] = df["rolling_mean_7"] - df["rolling_mean_28"]
    
    # Extract the 7 forecast rows
    df_forecast = df.iloc[-7:].copy()
    
    # Verify no NaNs in features
    if df_forecast[feature_cols].isnull().any().any():
        raise HTTPException(status_code=500, detail="Feature generation resulted in NaN values")
        
    X = df_forecast[feature_cols]
    preds = np.clip(model.predict(X), 0, None)
    
    # 2. Load Events Calendar
    events = []
    events_path = os.path.join(os.path.dirname(__file__), "../../ml/data/india_event_calendar.json")
    if os.path.exists(events_path):
        with open(events_path, "r") as f:
            events = json.load(f)
            
    event_lookup = {e["date"]: e for e in events}
    
    # 3. Build response
    daily_forecasts = []
    for i, date_obj in enumerate(forecast_dates):
        date_str = date_obj.strftime("%Y-%m-%d")
        pred_val = int(preds[i])
        
        event_data = event_lookup.get(date_str)
        event_signal = None
        planning_signal = None
        
        if event_data:
            event_signal = EventSignal(
                name=event_data["event_name"],
                category=event_data["event_category"],
                importance=event_data["importance"]
            )
            # Rule-based planning signal: flag for manager awareness only.
            # DO NOT modify predicted_demand using a festival multiplier — that would be fabricated.
            planning_signal = (
                f"Known event on this date: {event_data['event_name']} "
                f"({event_data['event_category']}). Consider staffing and availability review."
            )
                
        daily_forecasts.append(DailyDemandForecast(
            date=date_str,
            predicted_demand=pred_val,
            event=event_signal,
            planning_signal=planning_signal
        ))
        
    return DemandForecastResponse(
        model_name=metrics.get("best_model", "RandomForest"),
        model_version=metrics.get("model_version", "v1.0"),
        horizon_days=7,
        forecast=daily_forecasts,
        source="public_benchmark",
        disclaimer=(
            "Benchmark demo forecast — trained on public European hotel booking data "
            "(Hotel Booking Demand dataset, 2015–2017). "
            "Demo forecasts use simulated historical context because Smart Resort does not "
            "yet have sufficient historical booking data for this model. "
            "This does not represent Smart Resort actual demand."
        ),
        metrics={
            "mae": metrics.get("all_models", {}).get("RandomForest", {}).get("test", {}).get("mae"),
            "rmse": metrics.get("all_models", {}).get("RandomForest", {}).get("test", {}).get("rmse"),
            "baseline_mae": metrics.get("baselines", {}).get("rolling_mean_7", {}).get("test", {}).get("mae"),
            "inference_data_source": "simulated_benchmark_context",
            "inference_data_note": (
                "Lag/rolling features are computed from a synthetic 35-day history "
                "seeded from today's date. Not derived from Smart Resort actual booking records."
            )
        },
        explanation=[
            "14-day trailing demand average is most associated with next-week predictions",
            "Same day last week -- strong weekly pattern association",
            "28-day demand variability signal",
            "Features are associated with the model prediction; they do not cause demand."
        ]
    )
