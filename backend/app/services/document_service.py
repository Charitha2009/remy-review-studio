import uuid

from app.core.config import settings
from app.core.exceptions import ConflictError, NotFoundError, PayloadTooLargeError
from app.models.document import Document, DocumentType
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

    def upload_document(
        self, *, project_id: str, filename: str, content: bytes, document_type: DocumentType
    ) -> Document:
        self.project_service.get_project(project_id)  # 404s if the project doesn't exist

        if len(content) > settings.max_upload_size_bytes:
            raise PayloadTooLargeError(
                f"'{filename}' exceeds the {settings.max_upload_size_mb} MB upload limit."
            )

        extension = validate_upload(filename, content)

        if self.document_repository.get_by_filename(project_id, filename) is not None:
            raise ConflictError(
                f"A document named '{filename}' already exists in this project. "
                f"Rename the file or delete the existing document first."
            )

        document = Document(
            id=str(uuid.uuid4()),  # generated up front so it can seed the storage key below
            project_id=project_id,
            name=filename,
            type=document_type,
            file_name=filename,
            file_size_bytes=len(content),
        )
        document.file_path = self.storage_service.save_document_file(
            project_id=project_id,
            document_id=document.id,
            extension=extension,
            content=content,
        )
        return self.document_repository.create(document)

    def delete_document(self, document_id: str) -> None:
        document = self.get_document(document_id)
        self.storage_service.delete_document_file(document.file_path)
        self.document_repository.delete(document)
