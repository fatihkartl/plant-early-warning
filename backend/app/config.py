# app/config.py
from pathlib import Path
from dotenv import load_dotenv
import os

# Proje backend kökünü baz alıyoruz: app/ -> ../
BASE_DIR = Path(__file__).resolve().parent.parent  # backend/app -> backend
ENV_PATH = BASE_DIR / ".env"

# Eğer .env dosyası backend dizininde varsa doğrudan yükle,
# yoksa load_dotenv() ile varsayılan davranışı dene (farklı senaryolar için)
if ENV_PATH.exists():
    load_dotenv(dotenv_path=str(ENV_PATH))
else:
    # fallback: bulursa yükler, bulamazsa sessiz geçer
    load_dotenv()

# Uygulama hangi değişkeni bekliyorsa al
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")

if not MONGO_URI:
    # Hata mesajı daha açıklayıcı olsun
    raise RuntimeError("MONGODB_URI (or MONGO_URI) is not set in environment (.env). "
                       f"Looked at: {ENV_PATH}")
