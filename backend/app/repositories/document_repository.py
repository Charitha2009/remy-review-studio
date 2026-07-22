from sqlalchemy import select
from sqlalchemy.orm import Session

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

    def get_by_filename(self, project_id: str, file_name: str) -> Document | None:
        return self.db.execute(
            select(Document).where(
                Document.project_id == project_id, Document.file_name == file_name
            )
        ).scalar_one_or_none()

    def create(self, document: Document) -> Document:
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def delete(self, document: Document) -> None:
        self.db.delete(document)
        self.db.commit()
