# ADR-0002: SQLite as the Interim MVP Datastore

## Status

Accepted — 2026-07-21

## Context

[ARCHITECTURE.md](../../ARCHITECTURE.md) documents PostgreSQL 16 + pgvector as
the system's target datastore — one database serving both relational data and
vector similarity search (see [Database Architecture](../../ARCHITECTURE.md#database-architecture)).
That target is driven by Sprint 3's ingestion pipeline (chunk embeddings,
`document_chunks.embedding vector(1536)`) and Sprint 4's semantic retrieval —
neither of which exists yet.

This milestone (Backend Foundation + Document Upload) needs a real,
persistent Projects/Documents backend now, with no embeddings, no vector
search, and explicitly no AI. Standing up Postgres via Docker Compose is not
itself hard, but it adds a running-service dependency (start Postgres, wait
for it to be healthy, manage its connection string) to a milestone whose only
actual requirement is two relational tables and a repository layer neither of
which uses anything Postgres-specific.

## Decision

Use **SQLite via SQLAlchemy**, behind the same repository/service layering
ENGINEERING.md already mandates regardless of database engine. Concretely:

- `app/repositories/` is the only layer that issues queries; services and
  routes never touch SQLAlchemy directly.
- No SQLite-specific query features are used (no `JSON1` extension queries, no
  raw SQL) — everything goes through the SQLAlchemy Core expression language,
  which speaks Postgres identically.
- Every schema change is an Alembic migration from day one (not
  `Base.metadata.create_all()`), so the migration history itself carries over
  when the underlying engine changes.
- Enum columns use `native_enum=False` (`VARCHAR` + values, not SQLite's
  nonexistent native enum type), which is also what you'd want on Postgres
  unless you specifically need a DB-level enum type.

Switching to Postgres later is: change `DATABASE_URL`, add a migration for
the `vector` extension and any Postgres-specific indexes (e.g., `ivfflat` on
`document_chunks.embedding`), and re-point Alembic. No service, repository,
or API code changes.

## Alternatives Considered

### Stand up Postgres + pgvector now via docker-compose

Matches the documented target immediately. Rejected for *this* milestone
because it adds infrastructure setup (container orchestration, health
checks, connection retries) with zero present payoff — nothing in this
milestone's scope (Projects read, Document upload/list/delete) benefits from
Postgres over SQLite. Revisit as part of Sprint 0 Issue #1 once Sprint 3
(pgvector-dependent ingestion) is actually being built.

### In-memory / no persistence

Rejected outright — the explicit goal of this milestone is "make uploading
and managing documents actually work," which requires documents to survive a
server restart.

## Pros

- Zero external services to run locally for this milestone — `pip install`
  and go.
- Forces the repository layer to be genuinely database-agnostic from the
  start, rather than "we'll add the abstraction when we migrate."
- Alembic migration history starts on day one, so there's no retroactive
  "first migration" to write against a live dataset later.

## Cons

- SQLite's concurrency model (single-writer) does not reflect Postgres's
  behavior under concurrent load — this is not exercised or validated by
  this milestone's tests.
- No vector search capability — expected and irrelevant now, but Sprint 3
  cannot begin until this ADR's migration path is executed.
- Enum-as-`VARCHAR` (`native_enum=False`) forgoes Postgres's native enum type
  even after migrating, unless a follow-up migration opts into it.

## Consequences

- `backend/remy_review_studio.db` is a local file, gitignored, never a
  shared/staging datastore.
- The 3 seed projects (`scripts/seed.py`) use the same ids the frontend's
  placeholder data already used (`hospital-expansion`, `airport-renovation`,
  `office-tower`) instead of generated UUIDs, so every already-shipped
  frontend route (project switcher, breadcrumbs, review sessions) keeps
  working without changes. Documents created through the API do get
  UUID4 ids, per [ENGINEERING.md § Database Standards](../../ENGINEERING.md#database-standards).
  This is a deliberate, narrow exception scoped to the 3 fixture rows, not a
  precedent for future user-created projects.
- [ARCHITECTURE.md § Database Architecture](../../ARCHITECTURE.md#database-architecture)
  remains accurate as the *target* architecture; this ADR is the record of
  why the current implementation temporarily diverges from it.

## Future Considerations

- Migrate to Postgres + pgvector no later than the start of Sprint 3 (AI
  Ingestion Pipeline), which is the first sprint that actually requires
  vector search.
- When Project creation (`POST /projects`) ships, newly created projects
  must get generated UUIDs like Documents already do — only the 3 seed rows
  are exempt.
