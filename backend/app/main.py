# app/main.py
# TR: FastAPI ana giriş dosyası; CORS ve route ekleme
# EN: FastAPI main entry; CORS and router mounting

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# TR: Router importları (tahmin ve DB sağlık kontrolü)
# EN: Router imports (prediction and DB health check)
from app.routes.predict import router as predict_router
from app.routes.db_health import router as db_router

app = FastAPI(
    title="Plant Disease Early Warning API",
    version="0.1.0"
)

# TR: Frontend dev sunucusuna CORS izni (Vite default: 5173)
# EN: Allow CORS for frontend dev server (Vite default: 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # TR: Sadece bu origin’lere izin ver / EN: allow only these origins
    allow_credentials=True,
    allow_methods=["*"],         # TR: Tüm HTTP metodlarına izin / EN: allow all HTTP methods
    allow_headers=["*"],         # TR: Tüm header’lara izin / EN: allow all headers
)

# TR: Basit kök endpoint — servis ayakta mı kontrolü
# EN: Simple root endpoint — service liveness check
@app.get("/")
def root():
    return {"message": "Backend API is running 🚀"}

# TR: Router’ları uygulamaya bağla
# EN: Include/attach routers to the app
app.include_router(predict_router)  # /api/predict
app.include_router(db_router)       # /api/db/health
