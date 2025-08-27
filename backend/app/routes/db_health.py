from fastapi import APIRouter
from app.db.mongo_client import get_mongo_client, get_collection

router = APIRouter(prefix="/api/db", tags=["db"])

@router.get("/health")
async def db_health():
    client = get_mongo_client()
    try:
        pong = await client.admin.command("ping")
        coll = get_collection()
        count = await coll.estimated_document_count()
        return {"ok": True, "ping": pong, "estimated_count": count}
    except Exception as e:
        return {"ok": False, "error": str(e)}
