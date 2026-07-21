# Architecture — Remy Review Studio

This document describes how Remy Review Studio is built: the system's components, how data flows through them, the technology choices behind each layer, and the repository layout that implements it. For *what* we're building and *why*, see [PRODUCT_SPEC.md](./PRODUCT_SPEC.md). For engineering conventions and coding standards, see [ENGINEERING.md](./ENGINEERING.md). For the reasoning behind specific hard-to-reverse technical choices, see [docs/adr/](./docs/adr/).

---

## System Overview

Remy Review Studio is a single web application backed by a relational database with vector search, and an asynchronous processing layer for document ingestion and AI review generation. There is no separate microservice fleet — "Document Service" and "AI Analysis Service" below are logical responsibilities inside the FastAPI backend and its background workers, not separately deployed services. Splitting them out is an option for later, not a starting assumption (see [ADR-0001](./docs/adr/0001-monorepo.md)).

### High-Level Component Diagram

```
┌────────────────┐      HTTPS       ┌──────────────────┐
│  Frontend        │ ───────────────▶ │  FastAPI Backend   │
│  Next.js 15       │ ◀─────────────── │  (API layer)        │
└────────────────┘                  └────────┬─────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                          │                          │
              ┌─────▼─────┐            ┌───────▼────────┐         ┌──────▼──────┐
              │ Document   │            │ AI Analysis      │         │ Redis-backed │
              │ Service     │            │ Service (LLM)     │         │ Job Queue     │
              │ (extract,   │            │ (retrieval,        │         │ (ingestion +  │
              │  chunk,      │◀──────────▶│  prompting,         │◀───────▶│  review jobs)  │
              │  storage)    │            │  citation build)    │         │                │
              └─────┬─────┘            └───────┬────────┘         └─────────────┘
                    │                          │
                    │                          ▼
                    │                  ┌────────────────┐
                    │                  │ OpenAI            │
                    │                  │ (LLM + Embeddings)  │
                    │                  └────────────────┘
                    ▼
          ┌───────────────────────┐
          │ PostgreSQL + pgvector    │
          │ (relational data +        │
          │  chunk embeddings)         │
          └───────────────────────┘
```

Both the Document Service and AI Analysis Service read from and write to PostgreSQL/pgvector; ingestion and review both run as background jobs off the Redis queue rather than inline in an HTTP request (see [Async Processing Model](#async-processing-model)).

---

## Component Responsibilities

### Frontend — Next.js 15

Renders the project workspace UI: project dashboard, document upload, findings review, citation viewer, knowledge search, and report export. Talks to the backend exclusively over its typed HTTP API — it holds no direct database or storage access. See [ENGINEERING.md § Frontend Standards](./ENGINEERING.md#frontend-standards).

### FastAPI Backend — API Layer

The single entry point for all client requests. Owns authentication/authorization, request validation, and orchestration of the service layer. Route handlers are thin — see [ENGINEERING.md § Backend Standards](./ENGINEERING.md#backend-standards) for the layering (routes → services → repositories) enforced underneath this layer.

### Document Service

Logical responsibility, implemented as backend services + a background worker, covering the document lifecycle: file validation and storage, PDF text extraction, chunking (500–1000 tokens with overlap), and handing chunks off for embedding. Tracks per-document ingestion status (`pending → processing → ready → failed`) so the frontend can reflect progress without polling the filesystem or job queue directly.

### AI Analysis Service

Logical responsibility, implemented as backend services + a background worker, covering: semantic retrieval of relevant spec/drawing chunks for a given submittal, prompt construction, the LLM call, and structured-output parsing into findings + citations. This is the component most directly bound by the product's AI Standards — every output it produces must be citation-backed, schema-validated, and traceable to a prompt/model version. See [ENGINEERING.md § AI Standards](./ENGINEERING.md#ai-standards) for the implementation rules.

### PostgreSQL + pgvector

The single source of truth for all relational data (users, projects, documents, reviews, findings, citations) and for chunk embeddings (vector similarity search, project-scoped). One database, not a separate vector store — see [Database Architecture](#database-architecture).

### Redis

Backs the async job queue for ingestion and review pipelines. Also the intended home for future caching (e.g., expensive read paths) as the product matures.

### OpenAI

External dependency for both the LLM (compliance review generation) and the embeddings model (semantic search and retrieval). Configured not to retain data for model training (PRD NFR-S4) — this is a hard product requirement given the sensitivity of contract documents, not a configuration nicety.

---

## Core Data Flow — Submittal Review

This is the primary flow the architecture is optimized for (see PRODUCT_SPEC.md §7 for the full user journey):

1. **Upload** — Frontend uploads a PDF to the backend; Document Service validates type/size and stores the file, creating a `Document` record with `ingestion_status=pending`.
2. **Ingestion (async)** — A worker picks up the ingestion job: extract text → chunk → embed (OpenAI Embeddings) → store chunks + vectors in pgvector → set `ingestion_status=ready` (or `failed`, retryable).
3. **Review initiation** — User selects a `submittal`-type document and requests a review; backend creates a `Review` record and enqueues a review job.
4. **Review generation (async)** — A worker retrieves the top-K relevant chunks from `specification`/`drawing` documents in the same project via pgvector similarity search, builds the prompt (retrieved context + submittal content), calls the LLM with `temperature=0`, and validates the structured JSON response against a Pydantic schema.
5. **Persistence** — Validated findings and their citations are persisted, each finding starting in `pending` status; the prompt version and model version are stored on the `Review` record for auditability.
6. **Engineer disposition** — User accepts, rejects, or edits each finding via the API; the original AI output (`ai_original`) is preserved immutably alongside any edits.
7. **Export** — A report is assembled from the review + findings + dispositions and rendered as PDF/Markdown.

Every step in this flow is scoped to a single `project_id` — project isolation is both a product boundary (PRD FR-2.5) and a security boundary (NFR-S3), enforced at the repository query layer (see [ENGINEERING.md § Database Standards](./ENGINEERING.md#database-standards)).

---

## Async Processing Model

Ingestion and review generation are the two operations expensive enough (seconds to minutes) that they must never run inline inside an HTTP request. Both follow the same pattern:

1. The API endpoint validates the request, creates a record with a `pending`/`queued` status, enqueues a job on Redis, and returns immediately.
2. A worker process consumes the job, executes the pipeline, and updates the record's status at each stage.
3. The frontend polls (or, in a future iteration, subscribes to) status until the job reaches a terminal state (`ready`/`completed` or `failed`).
4. Failed jobs are retryable without requiring the user to re-upload or re-submit — status and error detail are persisted, not just logged.

This keeps API endpoints within the NFR-P6 latency target (≤ 500ms P95, excluding upload/review endpoints) and keeps the UI responsive during long-running processing (NFR-P5).

---

## Database Architecture

A single PostgreSQL instance with the `pgvector` extension serves both relational and vector-search needs — there is no separate vector database. Rationale: at MVP scale (PRD NFR-SC3: 100K chunks per project), pgvector's performance is sufficient, and one database means one transactional boundary, one backup story, and one place to enforce project-scoped access control. Revisit only if `pgvector` query latency becomes a measured bottleneck (PRD Technical Risks) — see [docs/adr/](./docs/adr/) for the decision record if/when that happens.

Core entities and their relationships:

```
User ──< Project ──< Document ──< DocumentChunk (embedding)
                 └──< Review ──< Finding ──< Citation
```

- A `Project` is the isolation boundary — every document, review, finding, and chunk belongs to exactly one project.
- A `Document` (specification, drawing, submittal, or other) owns its `DocumentChunk`s once ingested.
- A `Review` targets one submittal `Document` and owns the `Finding`s it generates; each `Finding` owns one or more `Citation`s pointing back to source `DocumentChunk`s/`Document`s.

See [ENGINEERING.md § Database Standards](./ENGINEERING.md#database-standards) for schema conventions (UUID keys, soft deletes, audit timestamps, migrations).

---

## Technology Stack

### Frontend

| Component | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components by default |
| Language | TypeScript (strict mode) | |
| Styling | Tailwind CSS | Design tokens for severity palette (NFR-A3) |
| Components | shadcn/ui | Composable, owned components |
| Server State | React Query (TanStack Query) | All server data fetching/caching; `QueryClientProvider` mounted in the root layout from Sprint 1. Together with Server Components and component-local state, this covers the large majority of state in the app |
| Global UI State | Zustand | Reserved for a short, fixed list of cross-cutting UI state that many unrelated components need to read/write and that isn't server data: sidebar collapsed, theme, current project (selection, not the project's data — that's React Query's), global filters, command palette (open/query). Not a general-purpose state layer — see [ENGINEERING.md § Frontend Standards](./ENGINEERING.md#frontend-standards). No global store exists yet; introduced starting Sprint 3 |
| Forms | React Hook Form + Zod | Paired with `@hookform/resolvers`; introduced starting Sprint 2 (first real form: Create Project) |
| HTTP Client | Axios | Shared, typed client in `lib/api-client.ts`; introduced starting Sprint 2. Supersedes the plain-`fetch` wrapper originally planned for Sprint 0 Issue #4 |
| Notifications | Sonner | Toast notifications; introduced starting Sprint 2 alongside the API client |
| File Upload | react-dropzone | Drag-and-drop document upload UI; introduced starting Sprint 2 (FR-3) |
| PDF Rendering | react-pdf | In-app PDF page rendering for the Citation Viewer; introduced starting Sprint 4 (FR-6) |
| Data Visualization | Recharts | Review/throughput analytics; introduced starting Sprint 6+ (Phase 3 analytics) |
| Animation | Framer Motion | Used sparingly for polish (page/panel transitions); prefer plain CSS transitions for simple hover/focus states — see [ENGINEERING.md § Frontend Standards](./ENGINEERING.md#frontend-standards) |

### Backend

| Component | Technology | Notes |
|---|---|---|
| Framework | FastAPI (Python 3.12+) | Async-first |
| ORM | SQLAlchemy (async) | Behind a repository layer |
| Migrations | Alembic | Every schema change is a migration |
| Validation | Pydantic v2 | Requests, responses, settings, LLM structured output |
| Background jobs | Redis-backed queue (RQ, Celery, or ARQ) | Selected in Sprint 3 |
| Auth | JWT (access + refresh tokens) | Replaces Sprint 1 dev auth stub in Sprint 8 |

### Database

| Component | Technology | Notes |
|---|---|---|
| Primary store | PostgreSQL 16 | Single source of truth |
| Vector search | pgvector extension | Project-scoped cosine similarity |
| Cache / queue | Redis 7 | Background jobs; future caching |

### AI

| Component | Technology | Notes |
|---|---|---|
| LLM | OpenAI, GPT-4 class model | `temperature=0` for review generation |
| Embeddings | OpenAI `text-embedding-3-small` (or spec-aligned equivalent) | 1536-dim vectors, batched, content-hash cached |
| Data policy | No retention for model training (NFR-S4) | Non-negotiable given document sensitivity |

### Infrastructure

| Component | Technology | Notes |
|---|---|---|
| Containerization | Docker, Docker Compose | Full local stack: Postgres, Redis, backend, frontend, worker |
| CI/CD | GitHub Actions | Lint, type-check, test on every PR |
| File storage | Local volume for MVP | Object storage deferred (NFR-SC4) — don't hardcode local-path assumptions into business logic |

Do not introduce a new framework, database, or AI provider without a corresponding ADR explaining what it replaces and why.

---

## Repository Structure

This is a monorepo (see [ADR-0001](./docs/adr/0001-monorepo.md)). Top-level layout:

```
remy-review-studio/
├── frontend/          Next.js application (App Router)
├── backend/           FastAPI application
├── docs/              Product spec, roadmap, ADRs, and other durable documentation
│   └── adr/           Architecture Decision Records
├── scripts/           One-off and repeatable dev/ops scripts (migrations, seeding, etc.)
├── docker-compose.yml Full local stack orchestration
├── .env.example        Documented environment variables (never commit real .env)
├── .github/            CI workflows
├── ARCHITECTURE.md     This file
├── ENGINEERING.md      Coding standards and conventions
├── PRODUCT_SPEC.md     Product requirements — the "what" and "why"
├── README.md           Entry point: what this is, how to run it
└── CLAUDE.md           AI operating instructions
```

Inside `backend/`, the target module structure (per docs/IMPLEMENTATION_ROADMAP.md Sprint 0, Issue #2) is:

```
backend/
└── app/
    ├── api/            Route handlers (routers), grouped by resource — thin, no business logic
    ├── core/            Config, security, middleware, cross-cutting concerns
    ├── models/          SQLAlchemy ORM models — persistence shape
    ├── schemas/         Pydantic request/response models — API contract shape
    ├── services/        Business logic and orchestration — the domain layer
    ├── repositories/    Data-access layer, one per aggregate (Project, Document, Review, Finding)
    ├── ai/               LLM/embedding clients, prompt templates, structured-output parsing
    ├── workers/          Background job definitions (ingestion, review)
    └── main.py           Application entrypoint
```

Inside `frontend/`, follow Next.js App Router conventions: routes under `app/`; shared UI in `components/`, split by purpose — `components/ui/` for shadcn/ui primitives, `components/layout/` for the application shell (sidebar, top nav, feature-based subfolders), `components/providers/` for app-wide context/provider wrappers (React Query, tooltips) mounted once in the root layout; data-fetching hooks in `hooks/` or colocated with the feature; and a shared, typed Axios client in `lib/api-client.ts` (per docs/IMPLEMENTATION_ROADMAP.md Sprint 0, Issue #4 — superseded from a plain-`fetch` wrapper to Axios per the Sprint 1 dependency decision).

If you add a new top-level directory, document its purpose here in the same change.

---

## Non-Functional Constraints Driving the Architecture

The full NFR list lives in PRODUCT_SPEC.md §11; the ones that most directly shape architectural decisions:

- **Project isolation is a hard boundary** (FR-2.5, NFR-S3) — every query path must be scoped by `project_id`; this is why isolation is enforced at the repository layer rather than left to individual route handlers.
- **Long-running work must be async** (NFR-P5, NFR-P6) — see [Async Processing Model](#async-processing-model).
- **Horizontal scalability of API and workers** (NFR-SC1) — statelessness of the API layer and worker processes is a constraint on any feature design, not an afterthought.
- **Graceful degradation on AI outage** (NFR-R4) — if OpenAI is unavailable, jobs queue and the user is notified; the system does not fail silently or block unrelated functionality.

---

## Architectural Decisions

Significant, hard-to-reverse technical decisions are recorded as ADRs rather than buried in this document's prose. See [docs/adr/](./docs/adr/) for the full log, starting with [ADR-0001: Monorepo Architecture](./docs/adr/0001-monorepo.md).
