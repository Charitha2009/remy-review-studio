from app.core.exceptions import UnsupportedMediaTypeError, ValidationError

# MVP scope is PDF-only (PRODUCT_SPEC.md §6 non-goals: "MVP is document-based
# (PDF) only") — the ingestion pipeline this milestone prepares documents for
# only ever parses PDFs.
PDF_EXTENSION = ".pdf"
PDF_SIGNATURE = b"%PDF-"
ALLOWED_CONTENT_TYPES = ("application/pdf",)


def extension_of(filename: str) -> str:
    dot_index = filename.rfind(".")
    return filename[dot_index:].lower() if dot_index != -1 else ""


def validate_upload(filename: str, content: bytes, content_type: str | None) -> str:
    """
    Validates presence, extension, declared content type, emptiness, and PDF
    magic-byte signature. Returns the (lowercased) extension on success.

    Extension/content-type mismatches are "unsupported media type" (415) —
    the caller asked for something this API doesn't handle. Missing filename,
    empty content, and a bad signature despite a `.pdf` name/type are
    "malformed or empty upload" (400) — the request claimed to be a PDF but
    isn't a usable one.
    """
    if not filename or not filename.strip():
        raise ValidationError("A filename is required.")

    extension = extension_of(filename)
    if extension != PDF_EXTENSION:
        raise UnsupportedMediaTypeError(
            f"Unsupported file type '{extension or filename}'. Only PDF files are supported."
        )

    if content_type and content_type not in ALLOWED_CONTENT_TYPES:
        raise UnsupportedMediaTypeError(
            f"Unsupported content type '{content_type}'. Only PDF files are supported."
        )

    if len(content) == 0:
        raise ValidationError(f"'{filename}' is empty.")

    if not content.startswith(PDF_SIGNATURE):
        raise ValidationError(f"'{filename}' does not look like a valid PDF file.")

    return extension
