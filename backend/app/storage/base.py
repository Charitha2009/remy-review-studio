from abc import ABC, abstractmethod
from typing import BinaryIO


class StorageBackend(ABC):
    """
    Content-addressed by a logical `key` (e.g. "{project_id}/{document_id}.pdf"),
    never a filesystem path — that's what lets a future S3Backend implement this
    same interface (put_object/delete_object/head_object/get_object) with no
    caller changes.
    """

    @abstractmethod
    def save(self, key: str, content: bytes) -> None: ...

    @abstractmethod
    def delete(self, key: str) -> None: ...

    @abstractmethod
    def exists(self, key: str) -> bool: ...

    @abstractmethod
    def open(self, key: str) -> BinaryIO:
        """Returns a readable binary file object for streaming — caller must close it."""
        ...
