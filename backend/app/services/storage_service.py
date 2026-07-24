from typing import BinaryIO

from app.storage.base import StorageBackend


class StorageService:
    """
    Domain-facing wrapper around a StorageBackend: owns the key-naming
    convention so callers never construct storage keys themselves. Swapping
    LocalStorageBackend for an S3Backend later is a constructor change here —
    DocumentService and everything above it stays the same.
    """

    def __init__(self, backend: StorageBackend) -> None:
        self.backend = backend

    def save_document_file(
        self, *, project_id: str, document_id: str, extension: str, content: bytes
    ) -> str:
        key = f"{project_id}/{document_id}{extension}"
        self.backend.save(key, content)
        return key

    def delete_document_file(self, key: str) -> None:
        self.backend.delete(key)

    def document_file_exists(self, key: str) -> bool:
        return self.backend.exists(key)

    def open_document_file(self, key: str) -> BinaryIO:
        return self.backend.open(key)
