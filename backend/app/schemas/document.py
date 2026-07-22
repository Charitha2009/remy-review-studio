from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.models.document import DocumentStatus, DocumentType


class DocumentResponse(BaseModel):
    """
    Mirrors frontend/types/document.ts's ProjectDocument exactly (id, projectId,
    name, type, revision, status, uploadedAt) — internal-only fields like
    file_path and file_size_bytes are deliberately not exposed here.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    project_id: str
    name: str
    type: DocumentType
    revision: str
    status: DocumentStatus
    uploaded_at: datetime
