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
    assert body["status"] == "uploaded"
    assert body["revision"] == "Revision 1"

    list_response = client.get(f"/api/v1/projects/{seeded_project.id}/documents")
    assert [d["name"] for d in list_response.json()] == ["spec.pdf"]


def test_upload_docx_and_doc_are_accepted(client, seeded_project):
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

    assert docx_response.status_code == 201
    assert doc_response.status_code == 201


def test_upload_rejects_disallowed_extension(client, seeded_project):
    response = _upload(client, seeded_project.id, "malware.exe", b"MZ\x90\x00fake exe")

    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]


def test_upload_rejects_content_that_does_not_match_extension(client, seeded_project):
    response = _upload(client, seeded_project.id, "fake.pdf", b"not actually a pdf")

    assert response.status_code == 400
    assert "does not look like a valid PDF" in response.json()["detail"]


def test_upload_rejects_oversized_file(client, seeded_project):
    oversized = PDF_BYTES + b"0" * (settings.max_upload_size_bytes + 1)

    response = _upload(client, seeded_project.id, "huge.pdf", oversized)

    assert response.status_code == 413
    assert "MB upload limit" in response.json()["detail"]


def test_upload_rejects_duplicate_filename(client, seeded_project):
    first = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES)
    second = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES)

    assert first.status_code == 201
    assert second.status_code == 409
    assert "already exists" in second.json()["detail"]


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


def test_delete_document_removes_it(client, seeded_project):
    created = _upload(client, seeded_project.id, "spec.pdf", PDF_BYTES).json()

    delete_response = client.delete(f"/api/v1/documents/{created['id']}")
    get_response = client.get(f"/api/v1/documents/{created['id']}")

    assert delete_response.status_code == 204
    assert get_response.status_code == 404


def test_delete_missing_document_returns_404(client):
    response = client.delete("/api/v1/documents/does-not-exist")

    assert response.status_code == 404
