# app/routes/predict.py
# TR: /api/predict endpoint'i; görüntü alır ve TFLite model ile tahmin döner.
#     Gerçek model yoksa "Mock Mode" devrededir ve sahte, anlamlı skorlar döner.
# EN: /api/predict endpoint; accepts an image and returns inference via a TFLite model.
#     If no real model is available, "Mock Mode" returns meaningful fake scores.

from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from app.ml.tflite_model import TFLiteModel

# -----------------------------
# Router Definition
# -----------------------------
# TR: Tüm tahmin uçları için /api prefix'i ve "predict" etiketi
# EN: Prefix /api and "predict" tag for all prediction endpoints
router = APIRouter(prefix="/api", tags=["predict"])

# -----------------------------
# Model Bootstrap (module-level)
# -----------------------------
# TR: Model ve etiket dosyası yolları
# EN: Paths for model and labels
MODEL_PATH = Path("app/ml/model.tflite")
LABELS_PATH = Path("app/ml/class_labels.json")

# TR: Uygulama yüklenirken modeli bir kez yüklemeyi dener
# EN: Try loading the model once at import time
_model = None
_model_error = None
try:
    if MODEL_PATH.exists():
        _model = TFLiteModel(str(MODEL_PATH), str(LABELS_PATH), input_size=(224, 224))
    else:
        _model_error = f"Model file not found: {MODEL_PATH}"
except Exception as e:
    _model_error = str(e)

# TR: Maks. dosya boyutu (MB) – aşırı büyük yükleri engellemek için (opsiyonel)
# EN: Max file size (MB) – to prevent huge uploads (optional)
MAX_FILE_MB = 10


@router.get("/predict/health")
def predict_health():
    """
    TR: Predict servis sağlık kontrolü.
    EN: Health check for predict service.
    """
    return {
        "model_loaded": _model is not None,
        "model_error": _model_error,
        "mock_mode": _model is None
    }


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    TR: Görsel dosyasını alır, modele gönderir ve en iyi skorları döner.
        Model yoksa "Mock Mode" devrede ve sahte skorlar döner.
    EN: Accepts an image file, runs inference, and returns top scores.
        If no model is available, "Mock Mode" returns fake scores.
    """
    # -----------------------------
    # Basic validations
    # -----------------------------
    if not file.content_type or not file.content_type.startswith("image/"):
        # TR: Sadece image/* kabul ediyoruz.
        # EN: Accept only image/* types.
        raise HTTPException(status_code=400, detail="Please upload an image file (content-type image/*).")

    # TR: Boyut kontrolü (opsiyonel). UploadFile'ta length yoksa sadece stream üzerinden okuruz.
    # EN: Size check (optional). If UploadFile has no length, we just read the stream.
    file_bytes = await file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_MB:
        raise HTTPException(status_code=413, detail=f"File too large (> {MAX_FILE_MB} MB).")

    # -----------------------------
    # Mock Mode (no real model)
    # -----------------------------
    if _model is None:
        # TR: Gerçek model yoksa sabit ama anlamlı bir cevap döndürürüz.
        # EN: If the real model is missing, return a static but meaningful response.
        mock = {
            "filename": file.filename,
            "predictions": [
                {"label": "powdery_mildew", "score": 0.65},
                {"label": "rust",            "score": 0.25},
                {"label": "leaf_blight",     "score": 0.10}
            ],
            "scores": [0.65, 0.25, 0.10],
            "mock_mode": True
        }
        return JSONResponse(mock, status_code=200)

    # -----------------------------
    # Real Inference (TFLiteModel)
    # -----------------------------
    try:
        result = _model.predict(file_bytes, top_k=3)
        response = {
            "filename": file.filename,
            "predictions": result.get("top_k", []),
            "scores": result.get("raw", []),
            "mock_mode": False
        }
        return JSONResponse(response, status_code=200)
    except Exception as e:
        # TR: Model yüklenmiş olsa da inference sırasında hata oluşabilir.
        # EN: Even if model is loaded, inference may fail at runtime.
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")
