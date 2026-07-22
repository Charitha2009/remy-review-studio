import pytest

from app.core.exceptions import ConflictError, NotFoundError, PayloadTooLargeError, ValidationError
from app.models.document import DocumentType
from app.repositories.document_repository import DocumentRepository
from app.repositories.project_repository import ProjectRepository
from app.services.document_service import DocumentService
from app.services.project_service import ProjectService
from app.services.storage_service import StorageService
from app.storage.local_storage import LocalStorageBackend
from tests.conftest import PDF_BYTES


@pytest.fixture
def document_service(db_session, upload_dir) -> DocumentService:
    return DocumentService(
        DocumentRepository(db_session),
        ProjectService(ProjectRepository(db_session)),
        StorageService(LocalStorageBackend(upload_dir)),
    )


def test_upload_document_persists_and_writes_file(document_service, seeded_project, upload_dir):
    document = document_service.upload_document(
        project_id=seeded_project.id,
        filename="spec.pdf",
        content=PDF_BYTES,
        document_type=DocumentType.specification,
    )

    assert document.id
    assert document.status.value == "uploaded"
    assert document.revision == "Revision 1"
    assert (upload_dir / document.file_path).read_bytes() == PDF_BYTES


def test_upload_document_unknown_project_raises_not_found(document_service):
    with pytest.raises(NotFoundError):
        document_service.upload_document(
            project_id="ghost",
            filename="spec.pdf",
            content=PDF_BYTES,
            document_type=DocumentType.specification,
        )


def test_upload_document_duplicate_filename_raises_conflict(document_service, seeded_project):
    document_service.upload_document(
        project_id=seeded_project.id,
        filename="spec.pdf",
        content=PDF_BYTES,
        document_type=DocumentType.specification,
    )

    with pytest.raises(ConflictError):
        document_service.upload_document(
            project_id=seeded_project.id,
            filename="spec.pdf",
            content=PDF_BYTES,
            document_type=DocumentType.specification,
        )


def test_upload_document_bad_extension_raises_validation_error(document_service, seeded_project):
    with pytest.raises(ValidationError):
        document_service.upload_document(
            project_id=seeded_project.id,
            filename="notes.txt",
            content=b"plain text",
            document_type=DocumentType.other,
        )


def test_upload_document_oversized_raises_payload_too_large(document_service, seeded_project):
    from app.core.config import settings

    with pytest.raises(PayloadTooLargeError):
        document_service.upload_document(
            project_id=seeded_project.id,
            filename="huge.pdf",
            content=PDF_BYTES + b"0" * (settings.max_upload_size_bytes + 1),
            document_type=DocumentType.specification,
        )


def test_delete_document_removes_row_and_file(document_service, seeded_project, upload_dir):
    document = document_service.upload_document(
        project_id=seeded_project.id,
        filename="spec.pdf",
        content=PDF_BYTES,
        document_type=DocumentType.specification,
    )
    file_path = upload_dir / document.file_path

    document_service.delete_document(document.id)

    assert not file_path.exists()
    with pytest.raises(NotFoundError):
        document_service.get_document(document.id)
