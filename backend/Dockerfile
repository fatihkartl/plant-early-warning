# backend/Dockerfile

# === Base image ===
FROM python:3.10-slim AS base

# TR: Sistemi güncelle + temel paketler
# EN: Update system + base tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# TR: Önce sadece requirements'ı kopyala (cache için)
# EN: Copy only requirements first (for better layer caching)
COPY requirements.txt /app/requirements.txt

# TR: Bağımlılıklar
# EN: Dependencies
# - tflite-runtime hafif; mock mode'da da import aşaması için güvenli
# - pillow, numpy: image & array ops
RUN pip install --no-cache-dir -r /app/requirements.txt || true && \
    pip install --no-cache-dir pillow numpy tflite-runtime==2.14.0

# TR: Uygulama dosyaları
# EN: App files
COPY app /app/app

# TR: Uvicorn ile servis
# EN: Serve with Uvicorn
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
