from fastapi import APIRouter

from app.api.v1.documents import documents_router
from app.api.v1.projects import router as projects_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(projects_router)
api_v1_router.include_router(documents_router)
