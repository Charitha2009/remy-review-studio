from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError
from app.models.document import Document


class DocumentRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_project(self, project_id: str) -> list[Document]:
        return list(
            self.db.execute(
                select(Document)
                .where(Document.project_id == project_id)
                .order_by(Document.uploaded_at.desc())
            ).scalars()
        )

    def get_by_id(self, document_id: str) -> Document | None:
        return self.db.get(Document, document_id)

    def get_by_checksum(self, project_id: str, checksum_sha256: str) -> Document | None:
        return self.db.execute(
            select(Document).where(
                Document.project_id == project_id, Document.checksum_sha256 == checksum_sha256
            )
        ).scalar_one_or_none()

    def create(self, document: Document) -> Document:
        self.db.add(document)
        try:
            self.db.commit()
        except IntegrityError as exc:
            # Catches the (project_id, checksum_sha256) unique constraint under a
            # concurrent-upload race — the pre-insert get_by_checksum check above
            # can't close that window by itself.
            self.db.rollback()
            raise ConflictError(
                "A document with the same content already exists in this project."
            ) from exc
        self.db.refresh(document)
        return document

    def delete(self, document: Document) -> None:
        self.db.delete(document)
        self.db.commit()
