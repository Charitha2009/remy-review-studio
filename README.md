# Remy Review Studio

AI-powered construction submittal review platform inspired by Remy.

## Tech Stack

- Next.js 15
- FastAPI
- PostgreSQL + pgvector (target — current MVP runs on SQLite, see [ADR-0002](docs/adr/0002-sqlite-for-mvp-backend.md))
- Redis (not yet introduced)
- OpenAI (not yet introduced)
- Docker (not yet introduced)

## Features

- Upload project documents ✅ (specs, drawings, submittals, other — PDF/DOC/DOCX)
- AI-powered compliance review — not yet built
- Citation-based findings — not yet built
- Knowledge search — not yet built
- Report generation — not yet built

## Local Development

Two apps, run separately for now (no Docker Compose yet):

```bash
# Backend — http://localhost:8000
cd backend
python3 -m venv venv && venv/bin/pip install -r requirements-dev.txt
venv/bin/alembic upgrade head
venv/bin/python scripts/seed.py
venv/bin/uvicorn app.main:app --reload --port 8000

# Frontend — http://localhost:3000
cd frontend
npm install
npm run dev
```

See [backend/README.md](backend/README.md) for backend details (env vars, migrations, tests).

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md).
