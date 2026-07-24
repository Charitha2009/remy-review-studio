import hashlib

import pytest

from app.core.exceptions import (
    ConflictError,
    NotFoundError,
    PayloadTooLargeError,
    StorageUnavailableError,
    UnsupportedMediaTypeError,
    ValidationError,
)
from app.models.document import DocumentType, ProcessingStatus
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


def _upload(
    document_service,
    project_id,
    filename="spec.pdf",
    content=PDF_BYTES,
    doc_type=DocumentType.specification,
):
    return document_service.upload_document(
        project_id=project_id,
        filename=filename,
        content=content,
        content_type="application/pdf",
        document_type=doc_type,
    )


def test_upload_document_persists_metadata_and_writes_file(
    document_service, seeded_project, upload_dir
):
    document = _upload(document_service, seeded_project.id)

    assert document.id
    assert document.processing_status == ProcessingStatus.uploaded
    assert document.revision == "Revision 1"
    assert document.content_type == "application/pdf"
    assert document.file_size_bytes == len(PDF_BYTES)
    assert document.checksum_sha256 == hashlib.sha256(PDF_BYTES).hexdigest()
    assert (upload_dir / document.file_path).read_bytes() == PDF_BYTES


def test_upload_document_unknown_project_raises_not_found(document_service):
    with pytest.raises(NotFoundError):
        _upload(document_service, "ghost")


def test_upload_document_duplicate_checksum_raises_conflict(document_service, seeded_project):
    _upload(document_service, seeded_project.id, filename="spec.pdf")

    with pytest.raises(ConflictError):
        _upload(document_service, seeded_project.id, filename="spec-renamed.pdf")


def test_upload_document_same_checksum_different_project_is_allowed(
    document_service, seeded_project, db_session
):
    from app.models.project import Project, ProjectStatus

    other_project = Project(
        id="other-project", name="Other Project", status=ProjectStatus.active
    )
    db_session.add(other_project)
    db_session.commit()

    first = _upload(document_service, seeded_project.id)
    second = _upload(document_service, other_project.id)

    assert first.checksum_sha256 == second.checksum_sha256
    assert first.project_id != second.project_id


def test_upload_document_empty_file_raises_validation_error(document_service, seeded_project):
    with pytest.raises(ValidationError):
        _upload(document_service, seeded_project.id, content=b"")


def test_upload_document_bad_extension_raises_unsupported_media_type(
    document_service, seeded_project
):
    with pytest.raises(UnsupportedMediaTypeError):
        _upload(document_service, seeded_project.id, filename="notes.txt", content=b"plain text")


def test_upload_document_bad_signature_raises_validation_error(document_service, seeded_project):
    with pytest.raises(ValidationError):
        _upload(document_service, seeded_project.id, content=b"not actually a pdf")


def test_upload_document_oversized_raises_payload_too_large(document_service, seeded_project):
    from app.core.config import settings

    with pytest.raises(PayloadTooLargeError):
        _upload(
            document_service,
            seeded_project.id,
            content=PDF_BYTES + b"0" * (settings.max_upload_size_bytes + 1),
        )


def test_upload_document_db_failure_after_storage_write_cleans_up_file(
    document_service, seeded_project, upload_dir, monkeypatch
):
    def _boom(_document):
        raise RuntimeError("simulated database failure")

    monkeypatch.setattr(document_service.document_repository, "create", _boom)

    with pytest.raises(RuntimeError):
        _upload(document_service, seeded_project.id)

    assert list(upload_dir.rglob("*.pdf")) == []


def test_delete_document_removes_row_and_file(document_service, seeded_project, upload_dir):
    document = _upload(document_service, seeded_project.id)
    file_path = upload_dir / document.file_path

    document_service.delete_document(document.id)

    assert not file_path.exists()
    with pytest.raises(NotFoundError):
        document_service.get_document(document.id)


def test_delete_document_storage_failure_preserves_db_record(
    document_service, seeded_project, monkeypatch
):
    document = _upload(document_service, seeded_project.id)

    def _boom(_key):
        raise OSError("simulated disk failure")

    monkeypatch.setattr(document_service.storage_service, "delete_document_file", _boom)

    with pytest.raises(StorageUnavailableError):
        document_service.delete_document(document.id)

    # The DB record must still be there — a storage failure must not silently
    # drop only the row, and the caller can retry the same delete call.
    assert document_service.get_document(document.id) is not None


def test_get_document_file_missing_storage_object_raises_storage_unavailable(
    document_service, seeded_project, upload_dir
):
    document = _upload(document_service, seeded_project.id)
    (upload_dir / document.file_path).unlink()

    with pytest.raises(StorageUnavailableError):
        document_service.get_document_file(document.id)
