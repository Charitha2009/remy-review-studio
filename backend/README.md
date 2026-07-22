# Remy Review Studio — Backend

FastAPI service for Projects and Documents. SQLite for MVP (see
[docs/adr/0002-sqlite-for-mvp-backend.md](../docs/adr/0002-sqlite-for-mvp-backend.md));
Postgres + pgvector remains the documented target once AI ingestion lands.

## Setup

```bash
cd backend
python3 -m venv venv        # if venv/ doesn't already exist
venv/bin/pip install -r requirements-dev.txt
venv/bin/alembic upgrade head
venv/bin/python scripts/seed.py   # inserts the 3 demo projects (idempotent)
```

## Run

```bash
venv/bin/uvicorn app.main:app --reload --port 8000
```

The frontend expects the API at `http://localhost:8000` by default
(`NEXT_PUBLIC_API_URL`, see the repo root `.env.example`).

## Environment variables

All have working defaults for local dev — see `app/core/config.py`. Override
via a `.env` file in `backend/` (gitignored) if needed:

| Variable | Default | Purpose |
|---|---|---|
| `REMY_DATABASE_URL` | `sqlite:///./remy_review_studio.db` | SQLAlchemy connection string |
| `REMY_UPLOAD_DIR` | `./uploads` | Local storage root for uploaded files |
| `REMY_MAX_UPLOAD_SIZE_MB` | `25` | Upload size cap enforced server-side |
| `REMY_CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed frontend origins |

## Migrations

Every schema change is an Alembic migration — never edit the schema by hand.

```bash
venv/bin/alembic revision --autogenerate -m "describe the change"
venv/bin/alembic upgrade head
```

## Tests / lint

```bash
venv/bin/ruff check .
venv/bin/black --check .
venv/bin/pytest
```

## Layout

```
app/
  api/          Route handlers (thin) + request-level deps and error handlers
  core/          Settings, custom exceptions, middleware
  database/      SQLAlchemy Base, engine, session
  models/        ORM models (Project, Document)
  schemas/       Pydantic request/response contracts
  repositories/  Data access, one per aggregate
  services/      Business logic (ProjectService, DocumentService, StorageService)
  storage/        StorageBackend interface + LocalStorageBackend
alembic/         Migrations
scripts/seed.py  Demo project seed data
tests/           pytest suite
uploads/         Uploaded files land here (gitignored)
```
