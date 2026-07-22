from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.error_handlers import register_error_handlers
from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.middleware import RequestIdMiddleware

app = FastAPI(title="Remy Review Studio API", version="1.0.0")

app.add_middleware(RequestIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)
app.include_router(api_v1_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "healthy", "message": "Remy Review Studio API"}
