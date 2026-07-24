import hashlib
import uuid
from typing import BinaryIO

from app.core.config import settings
from app.core.exceptions import (
    ConflictError,
    NotFoundError,
    PayloadTooLargeError,
    StorageUnavailableError,
)
from app.models.document import Document, DocumentType, ProcessingStatus
from app.repositories.document_repository import DocumentRepository
from app.services.file_validation import validate_upload
from app.services.project_service import ProjectService
from app.services.storage_service import StorageService


class DocumentService:
    def __init__(
        self,
        document_repository: DocumentRepository,
        project_service: ProjectService,
        storage_service: StorageService,
    ) -> None:
        self.document_repository = document_repository
        self.project_service = project_service
        self.storage_service = storage_service

    def list_documents(self, project_id: str) -> list[Document]:
        self.project_service.get_project(project_id)  # 404s if the project doesn't exist
        return self.document_repository.get_by_project(project_id)

    def get_document(self, document_id: str) -> Document:
        document = self.document_repository.get_by_id(document_id)
        if document is None:
            raise NotFoundError(f"Document '{document_id}' was not found.")
        return document

    def get_document_file(self, document_id: str) -> tuple[Document, BinaryIO]:
        """Looks up a document and opens its stored file for streaming. Raises
        StorageUnavailableError (rather than a bare FileNotFoundError) if the
        database record exists but the underlying object doesn't — a server-side
        data-consistency problem, not something the caller can fix."""
        document = self.get_document(document_id)
        if not self.storage_service.document_file_exists(document.file_path):
            raise StorageUnavailableError(
                f"The stored file for document '{document_id}' is missing."
            )
        return document, self.storage_service.open_document_file(document.file_path)

    def upload_document(
        self,
        *,
        project_id: str,
        filename: str,
        content: bytes,
        content_type: str | None,
        document_type: DocumentType,
    ) -> Document:
        self.project_service.get_project(project_id)  # 404s if the project doesn't exist

        if len(content) > settings.max_upload_size_bytes:
            raise PayloadTooLargeError(
                f"'{filename}' exceeds the {settings.max_upload_size_mb} MB upload limit."
            )

        extension = validate_upload(filename, content, content_type)
        checksum = hashlib.sha256(content).hexdigest()

        if self.document_repository.get_by_checksum(project_id, checksum) is not None:
            raise ConflictError(
                f"'{filename}' matches a document already uploaded to this project."
            )

        document = Document(
            id=str(uuid.uuid4()),  # generated up front so it can seed the storage key below
            project_id=project_id,
            name=filename,
            type=document_type,
            file_name=filename,
            file_size_bytes=len(content),
            content_type="application/pdf",
            checksum_sha256=checksum,
            processing_status=ProcessingStatus.uploaded,
        )
        storage_key = self.storage_service.save_document_file(
            project_id=project_id,
            document_id=document.id,
            extension=extension,
            content=content,
        )
        document.file_path = storage_key
        try:
            return self.document_repository.create(document)
        except Exception:
            # The file write already succeeded; don't leave it orphaned if persistence
            # fails for any reason — a concurrent-upload duplicate race (caught as
            # ConflictError by the repository) or any other DB failure.
            self.storage_service.delete_document_file(storage_key)
            raise

    def delete_document(self, document_id: str) -> None:
        document = self.get_document(document_id)
        try:
            self.storage_service.delete_document_file(document.file_path)
        except OSError as exc:
            # Deliberately raised *before* touching the DB record: deleting only the
            # row while the file remains would orphan it the other way, and silently
            # succeeding would lie about the document being gone. Nothing has changed
            # yet, so the same DELETE call can simply be retried.
            raise StorageUnavailableError(
                f"Could not delete the stored file for document '{document_id}'. "
                f"The document was not removed — try again."
            ) from exc
        self.document_repository.delete(document)
