# app/ml/tflite_model.py
# TR: TensorFlow Lite modelini yükleyen, giriş/çıkış işleyen yardımcı sınıf
# EN: Helper class to load and run a TensorFlow Lite model

import json
import threading
from pathlib import Path
from typing import List, Dict

import numpy as np
from PIL import Image

# Önce tflite-runtime dene; olmazsa tensorflow içinden tflite interpreter dene
try:
    from tflite_runtime.interpreter import Interpreter
except Exception:
    # TR: yedek; eğer tflite-runtime yoksa tensorflow içindeki TFLite kullan
    # EN: fallback; if tflite-runtime is unavailable, use TensorFlow's TFLite
    from tensorflow.lite.python.interpreter import Interpreter  # type: ignore


class TFLiteModel:
    """
    TR: TFLite modelini singleton gibi kullanır, thread-safe tahmin yapar.
    EN: Uses TFLite model as a singleton-like loader; thread-safe inference.
    """
    def __init__(self, model_path: str, labels_path: str, input_size=(224, 224)):
        self.model_path = Path(model_path)
        self.labels_path = Path(labels_path)
        self.input_size = input_size
        self._lock = threading.Lock()

        if not self.model_path.exists():
            raise FileNotFoundError(f"Model file not found: {self.model_path}")

        # Etiketleri yükle / Load labels
        if self.labels_path.exists():
            self.class_labels: List[str] = json.loads(self.labels_path.read_text(encoding="utf-8"))
        else:
            self.class_labels = []

        # Interpreter yükle / Load interpreter
        self.interpreter = Interpreter(model_path=str(self.model_path))
        self.interpreter.allocate_tensors()

        # Girdi-çıktı detayları / I/O details
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        # Girdi tensör bilgisi / Input tensor info
        self.input_index = self.input_details[0]["index"]
        self.input_dtype = self.input_details[0]["dtype"]

        # Çıktı tensör bilgisi / Output tensor info
        self.output_index = self.output_details[0]["index"]
        self.output_dtype = self.output_details[0]["dtype"]

    def preprocess(self, image_bytes: bytes) -> np.ndarray:
        """
        TR: Görseli oku, yeniden boyutlandır, normalize et ve modele uygun tensöre çevir.
        EN: Read image, resize, normalize and convert to model-ready tensor.
        """
        with Image.open(BytesIO(image_bytes)) as img:
            img = img.convert("RGB")
            img = img.resize(self.input_size, Image.BILINEAR)
            arr = np.asarray(img, dtype=np.float32)

        # Basit [0,1] normalizasyonu / Simple [0,1] scaling
        arr = arr / 255.0

        # Gerekirse mean/std normalizasyonu burada uygulanabilir
        # If mean/std normalization required by your model, apply here.

        # Modele uygun shape: (1, H, W, C)
        arr = np.expand_dims(arr, axis=0)

        # Girdi dtype eşlemesi / match input dtype
        if self.input_dtype == np.uint8:
            arr = (arr * 255).astype(np.uint8)
        elif self.input_dtype == np.float32:
            arr = arr.astype(np.float32)
        else:
            arr = arr.astype(self.input_dtype)

        return arr

    def predict(self, image_bytes: bytes, top_k: int = 3) -> Dict:
        """
        TR: Byte görselden tahmin yapar ve ilk top_k sonucu döner.
        EN: Runs inference on image bytes and returns top_k predictions.
        """
        # Preprocess
        x = self.preprocess(image_bytes)

        with self._lock:
            self.interpreter.set_tensor(self.input_index, x)
            self.interpreter.invoke()
            y = self.interpreter.get_tensor(self.output_index)

        # Beklenen çıktı shape: (1, num_classes)
        probs = y[0]

        # Eğer logits geliyorsa softmax uygula
        # If logits, apply softmax
        if probs.ndim == 1 and (probs.max() > 1 or probs.min() < 0):
            exps = np.exp(probs - np.max(probs))
            probs = exps / np.sum(exps)

        # En yüksek olasılıklar
        idxs = np.argsort(-probs)[:top_k]
        results = []
        for i in idxs:
            label = self.class_labels[i] if i < len(self.class_labels) else f"class_{i}"
            results.append({
                "label": label,
                "score": float(probs[i])
            })

        return {
            "top_k": results,
            "raw": probs.tolist()
        }


# BytesIO importu en sonda; üstte PIL open içinde kullanıyoruz
from io import BytesIO  # noqa: E402
