import enum
import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.models.project import Project


class DocumentType(str, enum.Enum):
    """
    Wire values match the frontend's existing DocumentType union
    (frontend/types/document.ts) exactly, so no frontend type changes are
    needed to consume this API.
    """

    specification = "specification"
    drawing = "drawing"
    submittal = "submittal"
    other = "other"


class DocumentStatus(str, enum.Enum):
    """
    Matches frontend/types/document.ts's DocumentStatus exactly. AI ingestion
    (Sprint 3) will move documents through processing/ready; nothing in this
    milestone transitions a document past "uploaded".
    """

    uploaded = "uploaded"
    processing = "processing"
    ready = "ready"
    reviewing = "reviewing"
    reviewed = "reviewed"


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(UTC)


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    project_id: Mapped[str] = mapped_column(
        String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[DocumentType] = mapped_column(
        SAEnum(DocumentType, values_callable=lambda e: [m.value for m in e], native_enum=False),
        nullable=False,
    )
    status: Mapped[DocumentStatus] = mapped_column(
        SAEnum(DocumentStatus, values_callable=lambda e: [m.value for m in e], native_enum=False),
        nullable=False,
        default=DocumentStatus.uploaded,
    )
    revision: Mapped[str] = mapped_column(String, nullable=False, default="Revision 1")
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    # A storage *key* (e.g. "{project_id}/{id}.pdf"), not a filesystem path — keeps this column
    # meaningful under any StorageBackend, including a future S3-backed one.
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    project: Mapped["Project"] = relationship(back_populates="documents")
