import hashlib

from app.core.config import settings
from tests.conftest import DOC_BYTES, DOCX_BYTES, PDF_BYTES


def _upload(
    client, project_id, filename, content, mime="application/pdf", doc_type="specification"
):
    return client.post(
        f"/api/v1/projects/{project_id}/documents",
        files={"file": (filename, content, mime)},
        data={"type": doc_type},
    )


def test_list_documents_empty_for_new_project(client, seeded_project):
    response = client.get(f"/api/v1/projects/{seeded_project.id}/documents")

    assert response.status_code == 200
    assert response.json() == []


def test_upload_valid_pdf_appears_immediately_in_list(client, seeded_project):
    upload_response = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES)

    assert upload_response.status_code == 201
    body = upload_response.json()
    assert body["name"] == "spec.pdf"
    assert body["projectId"] == seeded_project.id
    assert body["type"] == "specification"
    assert body["processingStatus"] == "uploaded"
    assert body["revision"] == "Revision 1"
    assert body["fileSizeBytes"] == len(PDF_BYTES)
    assert body["contentType"] == "application/pdf"

    list_response = client.get(f"/api/v1/projects/{seeded_project.id}/documents")
    assert [d["name"] for d in list_response.json()] == ["spec.pdf"]


def test_upload_rejects_docx_and_doc_now_that_mvp_is_pdf_only(client, seeded_project):
    docx_response = _upload(
        client,
        seeded_project.id,
        "shop-drawing.docx",
        DOCX_BYTES,
        mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        doc_type="drawing",
    )
    doc_response = _upload(
        client,
        seeded_project.id,
        "submittal.doc",
        DOC_BYTES,
        mime="application/msword",
        doc_type="submittal",
    )

    assert docx_response.status_code == 415
    assert doc_response.status_code == 415


def test_upload_rejects_disallowed_extension(client, seeded_project):
    response = _upload(client, seeded_project.id, "malware.exe", b"MZ\x90\x00fake exe")

    assert response.status_code == 415
    assert "Unsupported file type" in response.json()["detail"]


def test_upload_rejects_mismatched_declared_content_type(client, seeded_project):
    response = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES, mime="image/png")

    assert response.status_code == 415


def test_upload_rejects_empty_file(client, seeded_project):
    response = _upload(client, seeded_project.id, "empty.pdf", b"")

    assert response.status_code == 400
    assert "empty" in response.json()["detail"]


def test_upload_rejects_content_that_does_not_match_extension(client, seeded_project):
    response = _upload(client, seeded_project.id, "fake.pdf", b"not actually a pdf")

    assert response.status_code == 400
    assert "does not look like a valid PDF" in response.json()["detail"]


def test_upload_rejects_oversized_file(client, seeded_project):
    oversized = PDF_BYTES + b"0" * (settings.max_upload_size_bytes + 1)

    response = _upload(client, seeded_project.id, "huge.pdf", oversized)

    assert response.status_code == 413
    assert "MB upload limit" in response.json()["detail"]


def test_upload_rejects_duplicate_content_same_project(client, seeded_project):
    first = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES)
    # Different filename, identical bytes — still a duplicate under the
    # (project_id, checksum) rule.
    second = _upload(client, seeded_project.id, "spec-renamed.pdf", PDF_BYTES)

    assert first.status_code == 201
    assert second.status_code == 409
    assert "already uploaded" in second.json()["detail"]


def test_upload_same_content_different_project_is_allowed(client, seeded_project, db_session):
    from app.models.project import Project, ProjectStatus

    other_project = Project(id="other-project", name="Other Project", status=ProjectStatus.active)
    db_session.add(other_project)
    db_session.commit()

    first = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES)
    second = _upload(client, other_project.id, "spec.pdf", PDF_BYTES)

    assert first.status_code == 201
    assert second.status_code == 201


def test_upload_to_missing_project_returns_404(client):
    response = _upload(client, "does-not-exist", "spec.pdf", PDF_BYTES)

    assert response.status_code == 404


def test_get_document_by_id(client, seeded_project):
    created = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES).json()

    response = client.get(f"/api/v1/documents/{created['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_get_missing_document_returns_404(client):
    response = client.get("/api/v1/documents/does-not-exist")

    assert response.status_code == 404


def test_download_document_returns_original_content_and_filename(client, seeded_project):
    created = _upload(client, seeded_project.id, "Division 08 Spec.pdf", PDF_BYTES).json()

    response = client.get(f"/api/v1/documents/{created['id']}/download")

    assert response.status_code == 200
    assert response.content == PDF_BYTES
    assert response.headers["content-type"] == "application/pdf"
    assert "Division 08 Spec.pdf" in response.headers["content-disposition"]


def test_download_missing_document_returns_404(client):
    response = client.get("/api/v1/documents/does-not-exist/download")

    assert response.status_code == 404


def test_download_missing_storage_object_returns_server_error(client, seeded_project, upload_dir):
    created = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES).json()
    # Simulate the file having disappeared from disk out-of-band.
    stored_files = list(upload_dir.rglob("*.pdf"))
    assert len(stored_files) == 1
    stored_files[0].unlink()

    response = client.get(f"/api/v1/documents/{created['id']}/download")

    assert response.status_code == 500


def test_delete_document_removes_it(client, seeded_project):
    created = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES).json()

    delete_response = client.delete(f"/api/v1/documents/{created['id']}")
    get_response = client.get(f"/api/v1/documents/{created['id']}")

    assert delete_response.status_code == 204
    assert get_response.status_code == 404


def test_delete_missing_document_returns_404(client):
    response = client.delete("/api/v1/documents/does-not-exist")

    assert response.status_code == 404


def test_checksum_is_deterministic_sha256_of_content(client, seeded_project, db_session):
    from app.models.document import Document

    created = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES).json()

    document = db_session.get(Document, created["id"])
    assert document.checksum_sha256 == hashlib.sha256(PDF_BYTES).hexdigest()
