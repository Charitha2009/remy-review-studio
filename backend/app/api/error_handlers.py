from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request

from app.core.exceptions import (
    AppError,
    ConflictError,
    NotFoundError,
    PayloadTooLargeError,
    StorageUnavailableError,
    UnsupportedMediaTypeError,
    ValidationError,
)

_STATUS_BY_ERROR: dict[type[AppError], int] = {
    NotFoundError: status.HTTP_404_NOT_FOUND,
    ConflictError: status.HTTP_409_CONFLICT,
    ValidationError: status.HTTP_400_BAD_REQUEST,
    PayloadTooLargeError: status.HTTP_413_CONTENT_TOO_LARGE,
    UnsupportedMediaTypeError: status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
    StorageUnavailableError: status.HTTP_500_INTERNAL_SERVER_ERROR,
}


def _request_id(request: Request) -> str | None:
    return getattr(request.state, "request_id", None)


def _error_body(detail: str, request: Request) -> dict[str, str | None]:
    return {"detail": detail, "request_id": _request_id(request)}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        status_code = _STATUS_BY_ERROR.get(type(exc), status.HTTP_400_BAD_REQUEST)
        return JSONResponse(status_code=status_code, content=_error_body(exc.detail, request))

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        body = _error_body(str(exc.detail), request)
        return JSONResponse(status_code=exc.status_code, content=body)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_body("An unexpected error occurred.", request),
        )
