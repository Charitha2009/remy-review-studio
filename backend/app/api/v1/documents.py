from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.api.deps import get_document_service, read_upload_limited
from app.core.config import settings
from app.models.document import Document, DocumentType
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService

documents_router = APIRouter(tags=["documents"])

DocumentServiceDep = Annotated[DocumentService, Depends(get_document_service)]


@documents_router.get("/projects/{project_id}/documents", response_model=list[DocumentResponse])
def list_project_documents(project_id: str, document_service: DocumentServiceDep) -> list[Document]:
    return document_service.list_documents(project_id)


@documents_router.post(
    "/projects/{project_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_project_document(
    project_id: str,
    document_service: DocumentServiceDep,
    file: Annotated[UploadFile, File()],
    type: Annotated[DocumentType, Form()],
) -> Document:
    content = await read_upload_limited(file, settings.max_upload_size_bytes)
    return document_service.upload_document(
        project_id=project_id,
        filename=file.filename or "untitled",
        content=content,
        document_type=type,
    )


@documents_router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, document_service: DocumentServiceDep) -> Document:
    return document_service.get_document(document_id)


@documents_router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: str, document_service: DocumentServiceDep) -> None:
    document_service.delete_document(document_id)
