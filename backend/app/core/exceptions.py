class AppError(Exception):
    """Base for service-layer errors that the API layer translates to HTTP responses."""

    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)


class NotFoundError(AppError):
    """A requested resource (project, document) does not exist."""


class ConflictError(AppError):
    """The request conflicts with existing state (e.g., duplicate filename)."""


class ValidationError(AppError):
    """The request payload failed a business-rule check (bad file type, etc.)."""


class PayloadTooLargeError(AppError):
    """The uploaded file exceeds the configured size limit."""
