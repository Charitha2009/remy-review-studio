from app.core.exceptions import ValidationError

# Magic-byte signatures — validated in addition to the extension so a renamed
# file can't slip past the extension check (ENGINEERING.md Security Standards:
# "File uploads are validated by content, not just extension").
_SIGNATURES: dict[str, tuple[bytes, ...]] = {
    ".pdf": (b"%PDF-",),
    ".docx": (b"PK\x03\x04", b"PK\x05\x06"),
    ".doc": (b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1",),
}

ALLOWED_EXTENSIONS = tuple(_SIGNATURES)


def extension_of(filename: str) -> str:
    dot_index = filename.rfind(".")
    return filename[dot_index:].lower() if dot_index != -1 else ""


def validate_upload(filename: str, content: bytes) -> str:
    """Validates extension + content signature; returns the (lowercased) extension."""
    extension = extension_of(filename)
    if extension not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file type '{extension or filename}'. "
            f"Only PDF, DOC, and DOCX files are supported."
        )

    signatures = _SIGNATURES[extension]
    if not content.startswith(signatures):
        raise ValidationError(
            f"'{filename}' does not look like a valid {extension.lstrip('.').upper()} file."
        )

    return extension
