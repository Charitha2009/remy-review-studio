import enum
import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
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

    Deliberately kept to this 4-value taxonomy rather than the broader
    SPECIFICATION/DRAWING/SUBMITTAL/PRODUCT_DATA/SHOP_DRAWING/CERTIFICATE/
    WARRANTY/OTHER set: the frontend's upload selector and per-type document
    sections are already built around exactly these 4 values end-to-end, and
    widening it would require a frontend redesign that's out of scope for
    this hardening pass. "other" already covers every type not listed here.
    """

    specification = "specification"
    drawing = "drawing"
    submittal = "submittal"
    other = "other"


class ProcessingStatus(str, enum.Enum):
    """
    A document's ingestion-pipeline lifecycle (Sprint 3 will move documents
    through queued/processing to ready-or-failed). This intentionally
    replaces the old `DocumentStatus` enum's "reviewing"/"reviewed" values —
    those describe engineer-review disposition, which the roadmap models on
    a separate Review/Finding entity (Sprint 4, roadmap Issue #26), not on
    Document itself. Nothing in this milestone produces anything but
    `uploaded`.
    """

    uploaded = "uploaded"
    queued = "queued"
    processing = "processing"
    ready = "ready"
    failed = "failed"


def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(UTC)


class Document(Base):
    __tablename__ = "documents"
    __table_args__ = (
        UniqueConstraint("project_id", "checksum_sha256", name="uq_documents_project_checksum"),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    project_id: Mapped[str] = mapped_column(
        String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[DocumentType] = mapped_column(
        SAEnum(DocumentType, values_callable=lambda e: [m.value for m in e], native_enum=False),
        nullable=False,
    )
    processing_status: Mapped[ProcessingStatus] = mapped_column(
        SAEnum(ProcessingStatus, values_callable=lambda e: [m.value for m in e], native_enum=False),
        nullable=False,
        default=ProcessingStatus.uploaded,
    )
    processing_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    revision: Mapped[str] = mapped_column(String, nullable=False, default="Revision 1")
    # The original, user-facing filename exactly as uploaded — never used to build
    # storage keys (see file_path), so it's safe to display and reuse verbatim in
    # a Content-Disposition header.
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    # A storage *key* (e.g. "{project_id}/{id}.pdf"), not a filesystem path — keeps this column
    # meaningful under any StorageBackend, including a future S3-backed one.
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    content_type: Mapped[str | None] = mapped_column(String, nullable=True)
    # Nullable: pre-existing rows predate this column and are intentionally left
    # unbackfilled (see migration) rather than guessed at.
    checksum_sha256: Mapped[str | None] = mapped_column(String, nullable=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    project: Mapped["Project"] = relationship(back_populates="documents")
