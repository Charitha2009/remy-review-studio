from abc import ABC, abstractmethod


class StorageBackend(ABC):
    """
    Content-addressed by a logical `key` (e.g. "{project_id}/{document_id}.pdf"),
    never a filesystem path — that's what lets a future S3Backend implement this
    same interface (put_object/delete_object/head_object) with no caller changes.
    """

    @abstractmethod
    def save(self, key: str, content: bytes) -> None: ...

    @abstractmethod
    def delete(self, key: str) -> None: ...

    @abstractmethod
    def exists(self, key: str) -> bool: ...
