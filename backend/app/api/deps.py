from typing import Annotated

from fastapi import Depends, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import PayloadTooLargeError
from app.database.session import get_db
from app.repositories.document_repository import DocumentRepository
from app.repositories.project_repository import ProjectRepository
from app.services.document_service import DocumentService
from app.services.project_service import ProjectService
from app.services.storage_service import StorageService
from app.storage.local_storage import LocalStorageBackend

DbSession = Annotated[Session, Depends(get_db)]


def get_project_service(db: DbSession) -> ProjectService:
    return ProjectService(ProjectRepository(db))


def get_storage_service() -> StorageService:
    return StorageService(LocalStorageBackend(settings.upload_dir))


def get_document_service(
    db: DbSession,
    project_service: Annotated[ProjectService, Depends(get_project_service)],
    storage_service: Annotated[StorageService, Depends(get_storage_service)],
) -> DocumentService:
    return DocumentService(DocumentRepository(db), project_service, storage_service)


async def read_upload_limited(file: UploadFile, max_bytes: int) -> bytes:
    """
    Reads an UploadFile in bounded chunks, aborting as soon as the size cap is
    exceeded — protects against a huge body regardless of its claimed
    Content-Length. The service re-checks the final size as the canonical rule.
    """
    chunks: list[bytes] = []
    total = 0
    chunk_size = 1024 * 1024
    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        total += len(chunk)
        if total > max_bytes:
            raise PayloadTooLargeError(
                f"'{file.filename}' exceeds the {max_bytes // (1024 * 1024)} MB upload limit."
            )
        chunks.append(chunk)
    return b"".join(chunks)
