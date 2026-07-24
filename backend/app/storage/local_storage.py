from pathlib import Path
from typing import BinaryIO

from app.storage.base import StorageBackend


class LocalStorageBackend(StorageBackend):
    """Stores files under a root directory on local disk. MVP default; see docs/adr/."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.root.mkdir(parents=True, exist_ok=True)

    def save(self, key: str, content: bytes) -> None:
        path = self._resolve(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)

    def delete(self, key: str) -> None:
        self._resolve(key).unlink(missing_ok=True)

    def exists(self, key: str) -> bool:
        return self._resolve(key).exists()

    def open(self, key: str) -> BinaryIO:
        return self._resolve(key).open("rb")

    def _resolve(self, key: str) -> Path:
        path = (self.root / key).resolve()
        if self.root.resolve() not in path.parents and path != self.root.resolve():
            raise ValueError(f"Storage key escapes root: {key!r}")
        return path
