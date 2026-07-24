from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.models.document import DocumentType, ProcessingStatus


class DocumentResponse(BaseModel):
    """
    Mirrors frontend/types/document.ts's ProjectDocument. `checksum_sha256` and
    `file_path` (the storage key) are deliberately not exposed — the former has
    no UI use yet, the latter would leak storage-layer implementation details.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    project_id: str
    name: str
    type: DocumentType
    revision: str
    processing_status: ProcessingStatus
    file_size_bytes: int
    content_type: str | None
    uploaded_at: datetime
