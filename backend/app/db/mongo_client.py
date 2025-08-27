import os
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

_MONGO_CLIENT: Optional[AsyncIOMotorClient] = None

def get_mongo_client() -> AsyncIOMotorClient:
    global _MONGO_CLIENT
    if _MONGO_CLIENT is None:
        uri = os.getenv("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI is not set in environment (.env).")
        _MONGO_CLIENT = AsyncIOMotorClient(uri)
    return _MONGO_CLIENT

def get_collection():
    client = get_mongo_client()
    db_name = os.getenv("MONGODB_DB_NAME", "plant_warning_db")
    coll_name = os.getenv("MONGODB_COLLECTION", "predictions")
    return client[db_name][coll_name]
