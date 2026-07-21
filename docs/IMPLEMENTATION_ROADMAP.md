# Remy Review Studio — Technical Implementation Roadmap

| Field | Value |
|---|---|
| **Source of Truth** | [PRODUCT_SPEC.md](../PRODUCT_SPEC.md) |
| **Status** | Draft |
| **Version** | 1.0 |
| **Last Updated** | July 14, 2026 |
| **Owner** | Engineering & Program Management |

---

## Overview

This roadmap translates the [Product Requirements Document](../PRODUCT_SPEC.md) into nine implementation milestones (Sprint 0–8). Each sprint delivers a shippable increment toward the MVP defined in the PRD.

### Complexity Legend

| Size | Estimate | Description |
|---|---|---|
| **S** | 1–2 days | Single component, well-defined scope |
| **M** | 3–5 days | Cross-layer change, moderate unknowns |
| **L** | 1–2 weeks | Multi-service feature, integration work |
| **XL** | 2–3 weeks | Core pipeline, AI/infra, high coordination |

### Milestone Dependency Graph

```
Sprint 0 ──▶ Sprint 1 ──▶ Sprint 2 ──▶ Sprint 3 ──▶ Sprint 4
                              │                        │
                              └──────────▶ Sprint 5 ◀──┘
                                              │
Sprint 4 ──▶ Sprint 6 ──▶ Sprint 7 ──▶ Sprint 8
```

### PRD Traceability Index

| Sprint | Primary FR Coverage |
|---|---|
| Sprint 0 | Infrastructure baseline for all FRs |
| Sprint 1 | FR-2 (Project Management), FR-1.2 (access control scaffold) |
| Sprint 2 | FR-3 (Document Upload & Storage) |
| Sprint 3 | FR-4 (Document Ingestion Pipeline) |
| Sprint 4 | FR-5 (AI Compliance Review), FR-6 (Citation Viewer — partial) |
| Sprint 5 | FR-8 (Knowledge Search) |
| Sprint 6 | FR-7 (Engineer Review), FR-6 (Citation Viewer — complete) |
| Sprint 7 | FR-9 (Report Export) |
| Sprint 8 | FR-1, NFR-P/S/R/SC/A (Production Readiness) |

---

## Sprint 0 — Project Foundation

### Goal

Establish a production-grade development foundation: containerized services, database schema, API scaffolding, CI pipeline, and shared conventions so feature sprints can ship independently.

### Deliverables

- Docker Compose stack: PostgreSQL (pgvector), Redis, FastAPI, Next.js
- Database migration framework (Alembic) with initial schema
- FastAPI project structure: routers, services, models, config
- Next.js app shell: layout, API client, environment config
- GitHub Actions CI: lint, type-check, test on PR
- Shared `.env.example` with documented variables
- Developer setup documented in README

### Estimated Complexity

**L** (1–2 weeks)

### Dependencies

- None (starting point)
- Partially complete: Next.js and FastAPI scaffolds exist; this sprint hardens and connects them

### Acceptance Criteria

- [ ] `docker compose up` starts all services without manual intervention
- [ ] FastAPI health endpoint returns `{ "status": "healthy" }` at `/`
- [ ] Next.js dev server connects to FastAPI via configured `NEXT_PUBLIC_API_URL`
- [ ] PostgreSQL accessible with pgvector extension enabled
- [ ] Redis accessible for future job queue use
- [ ] CI pipeline passes on `develop` branch
- [ ] New engineer can clone repo and run locally in ≤ 30 minutes using README

---

### GitHub Issues

#### Issue #1: Configure Docker Compose for full local stack

**Labels:** `sprint-0`, `infra`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** Architecture (Appendix A)

**Description**  
Create a `docker-compose.yml` that orchestrates PostgreSQL (with pgvector), Redis, FastAPI backend, and Next.js frontend for local development.

**Tasks**
- Add PostgreSQL 16 service with pgvector extension init script
- Add Redis 7 service
- Add backend service with hot-reload via volume mount
- Add frontend service with hot-reload
- Configure shared network and named volumes for DB persistence
- Document ports: API `8000`, frontend `3000`, Postgres `5432`, Redis `6379`

**Acceptance Criteria**
- `docker compose up --build` starts all four services
- pgvector extension verified: `SELECT * FROM pg_extension WHERE extname = 'vector'`
- Services restart cleanly after `docker compose down && docker compose up`

---

#### Issue #2: Scaffold FastAPI application structure

**Labels:** `sprint-0`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-* (foundation)

**Description**  
Organize the FastAPI backend into a maintainable module structure supporting routers, services, repositories, and configuration.

**Tasks**
- Create directory layout: `app/api/`, `app/core/`, `app/models/`, `app/schemas/`, `app/services/`
- Add `config.py` with Pydantic Settings (env-based: `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY`)
- Add CORS middleware configured for frontend origin
- Add global exception handler returning structured JSON errors
- Add request ID middleware for observability
- Wire existing `main.py` health endpoint into router pattern

**Acceptance Criteria**
- API starts via `uvicorn app.main:app --reload`
- `GET /` returns health JSON
- Invalid routes return `{ "detail": "...", "request_id": "..." }`
- Config loads from environment variables without hardcoded secrets

---

#### Issue #3: Set up Alembic migrations and base schema

**Labels:** `sprint-0`, `backend`, `database`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-2.5, FR-4.4

**Description**  
Initialize Alembic for database migrations. Create base tables that subsequent sprints extend.

**Tasks**
- Install and configure Alembic with async SQLAlchemy (or sync for MVP simplicity)
- Enable pgvector extension in initial migration
- Create `users` table: id, email, hashed_password, created_at
- Create `projects` table: id, user_id (FK), name, number, discipline, description, status, created_at, archived_at
- Add indexes on `projects.user_id` and `projects.created_at`
- Add migration run step to Docker backend entrypoint or documented script

**Acceptance Criteria**
- `alembic upgrade head` runs cleanly on fresh database
- Tables exist with correct constraints and indexes
- Rollback (`alembic downgrade -1`) works without data corruption

---

#### Issue #4: Configure Next.js API client and app shell

**Labels:** `sprint-0`, `frontend`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** NFR-P5, NFR-P6

**Description**  
Establish frontend conventions for API communication, layout, and navigation that all feature sprints will extend.

**Tasks**
- Create `lib/api.ts` fetch wrapper with base URL from env, error handling, and typed responses
- Create root layout with app header, navigation placeholder, and main content area
- Add environment variable `NEXT_PUBLIC_API_URL` to `.env.example`
- Add loading and error boundary components
- Configure Tailwind design tokens (colors, spacing) aligned with severity palette for future sprints

**Acceptance Criteria**
- Frontend fetches `GET /` from backend and displays connection status on a dev page
- API errors surface user-friendly messages
- Layout renders consistently across routes

---

#### Issue #5: Add GitHub Actions CI pipeline

**Labels:** `sprint-0`, `ci`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** NFR-R3

**Description**  
Automate quality checks on every pull request to `develop` and `main`.

**Tasks**
- Create `.github/workflows/ci.yml`
- Frontend job: `npm ci`, ESLint, TypeScript check
- Backend job: install deps, run linter (ruff), run pytest (even if minimal initially)
- Fail PR on lint or type errors
- Cache node_modules and pip dependencies

**Acceptance Criteria**
- CI runs on PR open and push to `develop`
- Failed lint blocks merge (when branch protection enabled)
- CI completes in < 5 minutes

---

#### Issue #6: Document local development setup

**Labels:** `sprint-0`, `docs`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** G7 (onboarding)

**Description**  
Update README with step-by-step instructions for local development using Docker and manual setup alternatives.

**Tasks**
- Document prerequisites: Docker, Node 20+, Python 3.12+
- Document `docker compose up` workflow
- Document manual backend setup (venv, uvicorn) and frontend setup (npm run dev)
- Document environment variable configuration from `.env.example`
- Add troubleshooting section for common issues (port conflicts, pgvector)

**Acceptance Criteria**
- New developer follows README and has running stack within 30 minutes
- All required env vars documented with descriptions

---

## Sprint 1 — Project Dashboard

### Goal

Enable engineers to create, list, view, and archive project workspaces — the top-level container for all documents, reviews, and findings.

### Deliverables

- Project CRUD API endpoints (FastAPI)
- Project data models and migrations
- Project list page with sort and empty state
- Create project form (modal or dedicated page)
- Project detail page shell with metadata and stat placeholders
- Archive project functionality
- User-scoped project isolation (owner-only access)

### Estimated Complexity

**M** (3–5 days)

### Dependencies

- Sprint 0 complete (DB, API structure, frontend shell)
- PRD: FR-2.1 through FR-2.5

### Acceptance Criteria

- [ ] User can create a project with name (required), number, discipline, description
- [ ] User can view a paginated/sorted list of their projects
- [ ] User can open a project detail page showing metadata
- [ ] User can archive a project; archived projects hidden from default list
- [ ] User cannot access another user's projects (403)
- [ ] Empty state guides user to create first project
- [ ] All FR-2 P0 requirements satisfied

---

### GitHub Issues

#### Issue #7: Implement Project SQLAlchemy model and Alembic migration

**Labels:** `sprint-1`, `backend`, `database`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** FR-2.1, FR-2.5

**Description**  
Extend database schema with full Project model including archive support.

**Tasks**
- Add `Project` model: id (UUID), user_id (FK), name, number, discipline, description, status (active/archived), created_at, updated_at, archived_at
- Create Alembic migration
- Add Pydantic schemas: `ProjectCreate`, `ProjectUpdate`, `ProjectResponse`, `ProjectListResponse`
- Add repository layer with CRUD methods scoped by user_id

**Acceptance Criteria**
- Migration applies cleanly
- Repository enforces user_id scoping on all queries
- Archive sets `status=archived` and `archived_at` timestamp

---

#### Issue #8: Build Project CRUD REST API endpoints

**Labels:** `sprint-1`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-2.1, FR-2.2, FR-2.3, FR-2.4

**Description**  
Expose project management endpoints with validation and authorization.

**Tasks**
- `POST /api/v1/projects` — create project (name required)
- `GET /api/v1/projects` — list user's projects, sort by created_at desc, filter active by default
- `GET /api/v1/projects/{id}` — get project detail
- `PATCH /api/v1/projects/{id}` — update metadata
- `POST /api/v1/projects/{id}/archive` — soft archive
- Return 404 for non-existent, 403 for unauthorized access
- Add API tests for all endpoints

**Acceptance Criteria**
- All endpoints return correct status codes and response shapes
- Name validation rejects empty strings
- Archived projects excluded from default list unless `?include_archived=true`

---

#### Issue #9: Add temporary auth stub for user scoping

**Labels:** `sprint-1`, `backend`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** FR-1.2, FR-2.5

**Description**  
Implement a minimal auth mechanism so project isolation can be tested before full auth in Sprint 8.

**Tasks**
- Create hardcoded dev user or header-based `X-User-Id` for local development
- Add `get_current_user` dependency used by project routes
- Document that this will be replaced by JWT auth in Sprint 8
- Ensure all project queries filter by authenticated user_id

**Acceptance Criteria**
- Project endpoints require authentication context
- User A cannot read or modify User B's projects
- Dev mode documented in README

---

#### Issue #10: Build Project List page (frontend)

**Labels:** `sprint-1`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-2.2

**Description**  
Create the main dashboard showing all active projects.

**Tasks**
- Route: `/projects`
- Fetch and display project cards/table: name, number, discipline, created date
- Sort by created date (newest first)
- "Create Project" button
- Empty state with illustration and CTA
- Loading skeleton and error state
- Toggle to show archived projects

**Acceptance Criteria**
- Page loads projects from API
- Empty state shown when no projects exist
- Archived projects hidden by default

---

#### Issue #11: Build Create Project form (frontend)

**Labels:** `sprint-1`, `frontend`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** FR-2.1

**Description**  
Form for creating a new project workspace.

**Tasks**
- Modal or `/projects/new` page with form fields: name (required), number, discipline (select or text), description (textarea)
- Client-side validation for required name
- Submit calls `POST /api/v1/projects`
- Redirect to project detail on success
- Display API validation errors inline

**Acceptance Criteria**
- Cannot submit without project name
- Successful creation navigates to `/projects/{id}`
- Form resets on cancel

---

#### Issue #12: Build Project Detail page shell (frontend)

**Labels:** `sprint-1`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-2.3

**Description**  
Project detail page with metadata display and placeholder sections for documents, reviews, and findings (populated in later sprints).

**Tasks**
- Route: `/projects/[id]`
- Display project metadata header: name, number, discipline, description, created date
- Stat cards (placeholder counts): Documents, Reviews, Open Findings — show `0` until later sprints
- Tab navigation: Overview, Documents, Reviews, Search (tabs disabled until respective sprints)
- Archive project action with confirmation dialog
- Breadcrumb: Projects → {Project Name}

**Acceptance Criteria**
- Page loads project by ID from API
- 404 page for invalid project ID
- Archive action updates project and redirects to project list

---

## Sprint 2 — Document Management

### Goal

Allow users to upload, categorize, list, and delete PDF documents within a project — the input layer for ingestion and review.

### Deliverables

- Document database model and file storage (local volume for MVP)
- Upload API with validation (PDF only, ≤ 50 MB)
- Document list UI with type, size, status, upload date
- Upload progress indicator
- Document delete with confirmation
- Ingestion status field (pending — populated in Sprint 3)

### Estimated Complexity

**L** (1–2 weeks)

### Dependencies

- Sprint 1 complete (projects exist)
- PRD: FR-3.1 through FR-3.7

### Acceptance Criteria

- [ ] User can upload PDF files up to 50 MB to a project
- [ ] User assigns document type: Specification, Drawing, Submittal, Other
- [ ] Upload progress displayed during transfer
- [ ] Non-PDF files rejected with clear error message
- [ ] Document list shows type, size, status, upload date
- [ ] User can delete a document with confirmation
- [ ] Documents isolated to owning project
- [ ] All FR-3 P0 requirements satisfied

---

### GitHub Issues

#### Issue #13: Implement Document model and storage layer

**Labels:** `sprint-2`, `backend`, `database`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-3.5, FR-3.6

**Description**  
Create document persistence and local file storage for MVP.

**Tasks**
- Add `Document` model: id, project_id (FK), filename, original_filename, file_path, file_size, mime_type, document_type (enum: specification, drawing, submittal, other), ingestion_status (enum: pending, processing, ready, failed), uploaded_at
- Alembic migration with index on `project_id`
- Storage service: save file to `storage/{project_id}/{document_id}.pdf`, retrieve path, delete file
- Pydantic schemas for document responses

**Acceptance Criteria**
- Files stored in project-scoped directories
- Delete removes both DB record and file from disk
- Document type enum validated on create

---

#### Issue #14: Build document upload API endpoint

**Labels:** `sprint-2`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-3.1, FR-3.2, FR-3.3, FR-3.4

**Description**  
Handle multipart PDF upload with validation and project authorization.

**Tasks**
- `POST /api/v1/projects/{project_id}/documents` — multipart upload
- Validate: file is PDF (magic bytes + content-type), size ≤ 50 MB
- Accept `document_type` form field
- Set initial `ingestion_status=pending`
- Return document metadata on success
- Return 400 with message "Only PDF files are supported" for invalid types
- Return 413 for oversized files
- Verify project belongs to authenticated user

**Acceptance Criteria**
- Valid PDF upload returns 201 with document metadata
- Invalid file types rejected with specified error message
- 50 MB limit enforced

---

#### Issue #15: Build document list and delete API endpoints

**Labels:** `sprint-2`, `backend`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** FR-3.6, FR-3.7

**Description**  
Endpoints for listing and deleting project documents.

**Tasks**
- `GET /api/v1/projects/{project_id}/documents` — list with type, size, status, upload date
- `GET /api/v1/projects/{project_id}/documents/{id}` — single document metadata
- `DELETE /api/v1/projects/{project_id}/documents/{id}` — delete document and file
- Optional: filter by document_type query param

**Acceptance Criteria**
- List returns all documents for project sorted by uploaded_at desc
- Delete returns 204 and removes file from storage
- 404 for non-existent document

---

#### Issue #16: Build Document Upload UI component

**Labels:** `sprint-2`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-3.1, FR-3.2, FR-3.3, FR-3.4

**Description**  
Drag-and-drop and file picker upload with progress and type selection.

**Tasks**
- Upload zone component on project Documents tab
- Document type selector (Specification, Drawing, Submittal, Other) — required before upload
- Upload progress bar using XMLHttpRequest or fetch with progress events
- Client-side pre-validation: PDF extension, size check
- Error toast for rejected files
- Refresh document list on successful upload

**Acceptance Criteria**
- Progress bar updates during upload
- Wrong file type shows error before upload attempt
- Multiple sequential uploads supported

---

#### Issue #17: Build Document List UI

**Labels:** `sprint-2`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-3.6

**Description**  
Table view of uploaded documents with status badges and actions.

**Tasks**
- Enable Documents tab on project detail page
- Table columns: filename, type (badge), size (formatted), status (badge), upload date
- Status badges: Pending (gray), Processing (blue), Ready (green), Failed (red) — Pending shown until Sprint 3
- Delete action with confirmation modal
- Empty state: "No documents uploaded yet"
- Filter by document type

**Acceptance Criteria**
- List reflects API data accurately
- Delete removes document from list without page reload (optimistic or refetch)
- Status badge colors meet accessibility contrast requirements (NFR-A3)

---

#### Issue #18: Add document storage volume to Docker Compose

**Labels:** `sprint-2`, `infra`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** FR-3.5, NFR-R3

**Description**  
Persist uploaded files across container restarts.

**Tasks**
- Add named volume `document_storage` mounted to backend `/app/storage`
- Document volume management in README
- Add `storage/` to `.gitignore`

**Acceptance Criteria**
- Uploaded files survive `docker compose restart backend`
- Storage directory not tracked by git

---

## Sprint 3 — AI Ingestion Pipeline

### Goal

Automatically extract text from uploaded PDFs, chunk content, generate embeddings, and index in pgvector — enabling semantic search and AI review.

### Deliverables

- Async ingestion worker (Redis-backed job queue)
- PDF text extraction pipeline
- Text chunking with overlap (500–1000 tokens)
- OpenAI embedding generation
- pgvector storage with chunk metadata
- Ingestion status lifecycle (pending → processing → ready → failed)
- Retry mechanism for failed jobs
- Real-time status updates on document list

### Estimated Complexity

**XL** (2–3 weeks)

### Dependencies

- Sprint 2 complete (documents uploaded)
- Sprint 0 complete (Redis, pgvector)
- PRD: FR-4.1 through FR-4.6
- External: OpenAI API key configured

### Acceptance Criteria

- [ ] Uploading a PDF automatically queues ingestion job
- [ ] Text extracted from digital PDFs with ≥ 95% page coverage on test corpus
- [ ] Chunks stored with embeddings in pgvector
- [ ] Document status transitions: pending → processing → ready (or failed)
- [ ] Failed ingestion retryable via API without re-upload
- [ ] P95 ingestion ≤ 2 minutes for 100-page PDF (NFR-P2)
- [ ] All FR-4 P0 requirements satisfied

---

### GitHub Issues

#### Issue #19: Design and create document_chunks schema with pgvector

**Labels:** `sprint-3`, `backend`, `database`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-4.4

**Description**  
Store text chunks and vector embeddings for semantic retrieval.

**Tasks**
- Add `document_chunks` table: id, document_id (FK), project_id (FK), chunk_index, content, token_count, page_number, section_ref, embedding (vector(1536)), created_at
- Create ivfflat or hnsw index on embedding column scoped by project_id
- Alembic migration enabling pgvector if not already done
- Add chunk repository with insert batch and similarity search stub

**Acceptance Criteria**
- Vector column accepts 1536-dimension embeddings
- Index created for cosine similarity queries
- Chunks cascade-delete when document deleted

---

#### Issue #20: Implement PDF text extraction service

**Labels:** `sprint-3`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-4.1, FR-4.7

**Description**  
Extract text from uploaded PDFs page by page with metadata.

**Tasks**
- Integrate PDF library (pymupdf or pdfplumber)
- Return list of `{ page_number, text, confidence }` per page
- Flag pages with low extraction confidence (< threshold or empty text on non-blank page)
- Handle encrypted/corrupt PDFs gracefully with descriptive errors
- Unit tests with sample digital PDF fixtures

**Acceptance Criteria**
- Digital PDF text extracted with page numbers preserved
- Corrupt PDF returns structured error without crashing worker
- Low-confidence pages flagged in metadata

---

#### Issue #21: Implement text chunking service

**Labels:** `sprint-3`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-4.2

**Description**  
Split extracted text into semantically sized chunks with overlap for retrieval quality.

**Tasks**
- Chunk pages into 500–1000 token segments using tiktoken
- 100-token overlap between consecutive chunks
- Preserve page_number and section_ref metadata on each chunk
- Attempt to break on paragraph boundaries when possible
- Unit tests verifying chunk sizes and overlap

**Acceptance Criteria**
- Chunks fall within 500–1000 token range (except final chunk)
- Overlap maintained between consecutive chunks
- Page metadata preserved on every chunk

---

#### Issue #22: Implement OpenAI embedding service

**Labels:** `sprint-3`, `backend`, `ai`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-4.3, NFR-S4

**Description**  
Generate vector embeddings for document chunks via OpenAI Embeddings API.

**Tasks**
- Create embedding service wrapping `text-embedding-3-small` (or spec-aligned model)
- Batch embed up to 100 chunks per API call
- Cache embeddings by content hash to avoid re-embedding identical text
- Handle rate limits with exponential backoff
- Log token usage per document for cost tracking
- Configure API to not retain data (per OpenAI enterprise/default policy)

**Acceptance Criteria**
- Embeddings returned as 1536-dimension vectors
- Rate limit errors retried up to 3 times
- Token usage logged per ingestion job

---

#### Issue #23: Build Redis-backed ingestion worker

**Labels:** `sprint-3`, `backend`, `infra`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** FR-4.5, FR-4.6, NFR-R2

**Description**  
Async worker that orchestrates the full ingestion pipeline.

**Tasks**
- Set up Redis queue (RQ, Celery, or ARQ)
- Ingestion job flow: extract → chunk → embed → store chunks → update status
- Update document `ingestion_status` at each stage
- On success: status = ready
- On failure: status = failed, store error message, allow retry
- `POST /api/v1/projects/{pid}/documents/{id}/retry-ingestion` endpoint
- Auto-enqueue ingestion on document upload (Issue #14 hook)
- Add worker service to Docker Compose

**Acceptance Criteria**
- Upload triggers ingestion automatically
- Status transitions visible via document API
- Failed job retried without re-upload
- Worker runs as separate Docker Compose service

---

#### Issue #24: Display ingestion status in frontend document list

**Labels:** `sprint-3`, `frontend`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** FR-4.5, NFR-P5

**Description**  
Poll document status and update UI during ingestion.

**Tasks**
- Poll document list every 3s while any document has status pending or processing
- Update status badges dynamically
- Show error message tooltip on failed status
- "Retry" button on failed documents calling retry endpoint
- Stop polling when all documents ready or failed

**Acceptance Criteria**
- Status updates without manual page refresh
- Failed documents show retry action
- Polling stops when no in-progress documents remain

---

#### Issue #25: Add ingestion integration tests

**Labels:** `sprint-3`, `backend`, `testing`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** FR-4.1–FR-4.6

**Description**  
End-to-end test validating the ingestion pipeline with fixture PDFs.

**Tasks**
- Test fixture: 10-page digital PDF
- Test: upload → wait for ready → verify chunks exist in DB
- Test: corrupt PDF → status failed
- Test: retry failed ingestion → status ready
- Mock OpenAI embedding API in CI to avoid cost

**Acceptance Criteria**
- Integration test passes in CI with mocked embeddings
- Chunk count > 0 for valid PDF

---

## Sprint 4 — Compliance Review Engine

### Goal

Enable AI-assisted compliance review: retrieve relevant spec context, analyze submittals via LLM, and generate structured findings with citations.

### Deliverables

- Review and Finding database models
- Semantic context retrieval (top-K chunks from spec/drawing docs)
- LLM review pipeline with structured output schema
- Async review worker with status tracking
- Findings list UI with severity badges and citation links
- Citation viewer (basic: excerpt display)
- Review history per project

### Estimated Complexity

**XL** (2–3 weeks)

### Dependencies

- Sprint 3 complete (documents ingested, embeddings indexed)
- PRD: FR-5.1 through FR-5.8, FR-6.1 through FR-6.3
- External: OpenAI API (GPT-4 class model)

### Acceptance Criteria

- [ ] User can initiate review by selecting a submittal document
- [ ] System retrieves relevant spec/drawing chunks via semantic search
- [ ] LLM generates findings with title, description, severity, recommendation
- [ ] Every finding includes ≥ 1 citation (document, page, excerpt)
- [ ] Review runs asynchronously with status polling
- [ ] Model version and prompt template logged per review
- [ ] P95 review completion ≤ 5 minutes for ≤ 50-page submittal (NFR-P3)
- [ ] All FR-5 P0 and FR-6 P0 (partial) requirements satisfied

---

### GitHub Issues

#### Issue #26: Design Review and Finding database models

**Labels:** `sprint-4`, `backend`, `database`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-5.4, FR-5.5, FR-5.7

**Description**  
Persist review runs, findings, and citations.

**Tasks**
- Add `reviews` table: id, project_id, submittal_document_id, status (queued, running, completed, failed), model_version, prompt_version, started_at, completed_at, error_message
- Add `findings` table: id, review_id, title, description, severity (critical, major, minor, info), recommendation, status (pending, accepted, rejected, edited), ai_original (JSONB), created_at
- Add `citations` table: id, finding_id, document_id, page_number, section_ref, excerpt
- Alembic migration with indexes on review_id, project_id

**Acceptance Criteria**
- Foreign keys enforce project/document relationships
- ai_original JSONB preserves immutable AI output
- Citations link to source documents

---

#### Issue #27: Implement semantic context retrieval for review

**Labels:** `sprint-4`, `backend`, `ai`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** FR-5.2

**Description**  
Retrieve top-K relevant specification and drawing chunks for a given submittal.

**Tasks**
- Embed submittal summary or chunk queries
- Query pgvector for top-K chunks (K=20) from specification and drawing documents in same project
- Exclude submittal document from retrieval source set
- Re-rank by relevance score; deduplicate overlapping chunks
- Return chunks with document metadata for citation building

**Acceptance Criteria**
- Retrieval scoped to current project only
- Spec and drawing documents prioritized over submittal
- Returns chunks with document_id, page_number, section_ref, content, score

---

#### Issue #28: Design and implement compliance review prompt template

**Labels:** `sprint-4`, `ai`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** FR-5.3, FR-5.4, FR-5.5, G2, G6

**Description**  
Create versioned prompt template that produces structured, citation-backed findings.

**Tasks**
- System prompt: construction compliance reviewer role, citation requirements, no auto-approval disclaimer
- User prompt template: submittal content + retrieved spec context
- Structured output schema (JSON): findings array with title, description, severity, recommendation, citations[]
- Prompt version constant (e.g., `v1.0.0`) stored with each review
- Temperature = 0 for consistency
- Validate LLM output against Pydantic schema; reject malformed responses

**Acceptance Criteria**
- 100% of generated findings include ≥ 1 citation (G2)
- Output validates against schema or review marked failed
- Prompt version logged per review run

---

#### Issue #29: Build compliance review worker

**Labels:** `sprint-4`, `backend`, `ai`, `priority-p0`  
**Complexity:** XL  
**PRD Ref:** FR-5.1, FR-5.3, FR-5.6, FR-5.7, NFR-R2, NFR-R4

**Description**  
Async worker orchestrating retrieval, LLM call, and finding persistence.

**Tasks**
- `POST /api/v1/projects/{pid}/reviews` — initiate review (body: submittal_document_id)
- Validate submittal doc exists, is type=submittal, ingestion_status=ready
- Enqueue review job on Redis
- Worker flow: retrieve context → build prompt → call OpenAI → parse findings → store findings + citations → update review status
- Handle LLM timeout/failure: status=failed, error message, retryable
- `GET /api/v1/projects/{pid}/reviews/{id}` — review status + findings
- `GET /api/v1/projects/{pid}/reviews` — review history list

**Acceptance Criteria**
- Review completes asynchronously
- Findings persisted with citations
- Failed reviews retryable
- Model and prompt version stored

---

#### Issue #30: Build "Run Review" UI flow

**Labels:** `sprint-4`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-5.1, FR-5.6, FR-5.8

**Description**  
Frontend flow to initiate and monitor compliance reviews.

**Tasks**
- Enable Reviews tab on project detail
- Submittal selector dropdown (only documents with type=submittal, status=ready)
- "Run Review" button with confirmation
- Progress indicator while review running (poll every 3s)
- Review history list: submittal name, date, status, finding count
- Navigate to findings view on completion

**Acceptance Criteria**
- Cannot run review without ready submittal
- Progress shown during async processing
- Review history displays past runs

---

#### Issue #31: Build Findings List UI with severity badges

**Labels:** `sprint-4`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-5.4, FR-5.5, NFR-A3

**Description**  
Display AI-generated findings with severity indicators and citation links.

**Tasks**
- Findings list view for a completed review
- Columns/cards: severity badge (with icon + label), title, description, recommendation
- Severity colors: critical (red), major (orange), minor (yellow), info (blue) — icons required per NFR-A3
- Citation links displayed per finding
- Expand/collapse for full description
- Empty state if review returned zero findings

**Acceptance Criteria**
- All findings rendered with severity badge and citation count
- Severity distinguishable without color alone (icons + labels)

---

#### Issue #32: Build basic Citation Viewer component

**Labels:** `sprint-4`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-6.1, FR-6.2, FR-6.3

**Description**  
Panel or modal showing citation source details when user clicks a citation link.

**Tasks**
- Click citation → open side panel or modal
- Display: document name, page number, section reference, excerpt text
- Highlight excerpt within surrounding context paragraph
- Close button and keyboard escape to dismiss
- If page unavailable, show excerpt with warning banner (FR-6.4)

**Acceptance Criteria**
- Citation click opens viewer within 500ms
- All citation metadata fields displayed
- Keyboard accessible (NFR-A2)

---

## Sprint 5 — Knowledge Search

### Goal

Enable natural language semantic search across all ingested documents in a project, supporting engineer research and spec navigation.

### Deliverables

- Search API endpoint with pgvector similarity query
- Query embedding and ranked result response
- Search UI with query input and result list
- Click-through to citation/source viewer
- Empty results state with search tips

### Estimated Complexity

**M** (3–5 days)

### Dependencies

- Sprint 3 complete (embeddings indexed)
- Sprint 4 complete (citation viewer reusable for result click-through)
- PRD: FR-8.1 through FR-8.4

### Acceptance Criteria

- [ ] User can search project documents with natural language queries
- [ ] Results ranked by semantic relevance with score displayed
- [ ] Results show document name, location, excerpt snippet
- [ ] Click result opens source viewer at cited location
- [ ] P95 search latency ≤ 2 seconds (NFR-P4)
- [ ] Empty results show helpful tips
- [ ] All FR-8 requirements satisfied

---

### GitHub Issues

#### Issue #33: Implement semantic search API endpoint

**Labels:** `sprint-5`, `backend`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** FR-8.1, FR-8.2, NFR-P4

**Description**  
Project-scoped vector search over document chunks.

**Tasks**
- `POST /api/v1/projects/{pid}/search` — body: `{ "query": "...", "limit": 10 }`
- Embed query via OpenAI Embeddings API
- pgvector cosine similarity search filtered by project_id
- Return ranked results: document_name, document_type, page_number, section_ref, excerpt, relevance_score
- Limit results to chunks from documents with ingestion_status=ready

**Acceptance Criteria**
- Search scoped to project only
- Results returned in < 2s P95 for projects with ≤ 100K chunks
- Relevance score included (0–1 normalized)

---

#### Issue #34: Add search result ranking and excerpt truncation

**Labels:** `sprint-5`, `backend`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** FR-8.2

**Description**  
Improve search result quality and readability.

**Tasks**
- Truncate excerpt to 300 characters with ellipsis
- Highlight query terms in excerpt (basic string match)
- Deduplicate results from overlapping chunks (same page)
- Optional: hybrid boost for keyword matches in section_ref

**Acceptance Criteria**
- No duplicate page results in top 10
- Excerpts readable and truncated consistently

---

#### Issue #35: Build Knowledge Search UI

**Labels:** `sprint-5`, `frontend`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** FR-8.1, FR-8.2, FR-8.3, FR-8.4

**Description**  
Search tab on project detail with query input and results.

**Tasks**
- Enable Search tab on project detail page
- Search input with submit on Enter and button click
- Loading state during search
- Results list: document name, type badge, page/section, excerpt, relevance score
- Click result → open citation viewer (reuse Sprint 4 component)
- Empty results state: "No results found. Try different keywords or check document ingestion status."
- Search tips in empty state

**Acceptance Criteria**
- Search returns and displays results
- Click navigates to source viewer
- Empty state displayed with tips when no results

---

#### Issue #36: Add search analytics logging

**Labels:** `sprint-5`, `backend`, `priority-p2`  
**Complexity:** S  
**PRD Ref:** Success Metrics (search click-through rate)

**Description**  
Log search queries and click events for success metric tracking.

**Tasks**
- Log search query, result count, project_id, timestamp
- Log result click events with chunk_id
- Store in `search_logs` table or structured log output

**Acceptance Criteria**
- Search and click events logged
- Logs queryable for click-through rate calculation

---

## Sprint 6 — Engineer Review Workflow

### Goal

Complete the human-in-the-loop workflow: engineers accept, reject, or edit AI findings, add notes, and verify citations — preserving audit trail of AI vs. human decisions.

### Deliverables

- Finding disposition API (accept, reject, edit)
- Engineer notes on findings
- AI original vs. modified diff view
- Findings filter by severity and status
- Enhanced citation viewer with PDF page rendering
- Review completion workflow

### Estimated Complexity

**L** (1–2 weeks)

### Dependencies

- Sprint 4 complete (findings generated)
- PRD: FR-7.1 through FR-7.7, FR-6.4

### Acceptance Criteria

- [ ] Engineer can accept, reject, or edit any finding
- [ ] Engineer can add free-text notes to findings
- [ ] Original AI output preserved alongside modifications
- [ ] Edited findings show diff between AI original and current state
- [ ] Findings filterable by severity and status
- [ ] Zero auto-approved findings — all start as pending (G6)
- [ ] All FR-7 P0 requirements satisfied

---

### GitHub Issues

#### Issue #37: Implement finding disposition API endpoints

**Labels:** `sprint-6`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-7.2, FR-7.3, FR-7.4, FR-7.5, FR-7.6

**Description**  
API for engineers to disposition AI findings.

**Tasks**
- `POST /api/v1/findings/{id}/accept` — status → accepted
- `POST /api/v1/findings/{id}/reject` — status → rejected
- `PATCH /api/v1/findings/{id}` — edit title, description, severity, recommendation; status → edited
- `POST /api/v1/findings/{id}/notes` — add/update engineer notes
- Preserve `ai_original` JSONB immutable; store edits in main fields
- Validate finding belongs to user's project

**Acceptance Criteria**
- Accept/reject/edit transitions update status correctly
- ai_original never modified after creation
- Notes persisted and returned in finding response

---

#### Issue #38: Build findings filter and query API

**Labels:** `sprint-6`, `backend`, `priority-p0`  
**Complexity:** S  
**PRD Ref:** FR-7.1

**Description**  
Support filtered findings list for review UI.

**Tasks**
- Extend `GET /api/v1/projects/{pid}/reviews/{rid}/findings` with query params: severity, status
- Return counts by severity and status for summary badges
- Sort by severity (critical first) then created_at

**Acceptance Criteria**
- Filters combine correctly (e.g., severity=critical AND status=pending)
- Summary counts match filtered results

---

#### Issue #39: Build Finding Disposition UI

**Labels:** `sprint-6`, `frontend`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** FR-7.2, FR-7.3, FR-7.4, FR-7.5, FR-7.7, G6

**Description**  
Interactive finding cards with accept/reject/edit actions and notes.

**Tasks**
- Action buttons: Accept (green), Reject (red), Edit (blue) — all findings start as Pending
- Edit mode: inline form for title, description, severity, recommendation
- Notes textarea with save button
- Status badge updates immediately after action
- Confirmation dialog for reject
- Disable accept/reject after disposition (allow edit on accepted/edited)

**Acceptance Criteria**
- No finding auto-approved on generation (all pending)
- All three disposition actions functional
- Notes saved and displayed on finding card

---

#### Issue #40: Build AI vs. Engineer diff view

**Labels:** `sprint-6`, `frontend`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** FR-7.6, FR-7.7

**Description**  
Show what the engineer changed compared to original AI output.

**Tasks**
- "View Original" toggle on edited findings
- Side-by-side or inline diff for changed fields (title, description, severity, recommendation)
- Visual indicator: "Modified by engineer" badge on edited findings
- Original AI text styled differently (muted/italic)

**Acceptance Criteria**
- Edited findings show diff accurately
- Original AI output accessible but visually distinct

---

#### Issue #41: Enhance Citation Viewer with PDF page display

**Labels:** `sprint-6`, `frontend`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** FR-6.2, FR-6.4, NFR-A4

**Description**  
Upgrade citation viewer to render actual PDF page with highlighted excerpt.

**Tasks**
- Integrate PDF viewer library (react-pdf or pdf.js)
- Fetch document PDF from backend `GET /api/v1/documents/{id}/file`
- Navigate to cited page number
- Highlight excerpt text on page
- Fallback: excerpt text with warning if PDF render fails
- Screen reader accessible excerpt text (NFR-A4)

**Acceptance Criteria**
- Cited PDF page renders in viewer
- Excerpt highlighted on page
- Graceful fallback on render failure

---

#### Issue #42: Add review completion workflow

**Labels:** `sprint-6`, `frontend`, `backend`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** G6, Success Metrics (review completion rate)

**Description**  
Allow engineer to mark review as complete after dispositioning findings.

**Tasks**
- `POST /api/v1/projects/{pid}/reviews/{id}/complete` — mark review complete
- UI: "Complete Review" button enabled when all findings dispositioned (accepted/rejected/edited)
- Show summary: X accepted, Y rejected, Z edited
- Warn if pending findings remain

**Acceptance Criteria**
- Cannot complete review with pending findings without override confirmation
- Completed reviews show summary stats

---

## Sprint 7 — Report Generation

### Goal

Generate downloadable review reports (PDF and Markdown) containing project metadata, finding summaries, detailed findings with citations, and engineer dispositions.

### Deliverables

- Report generation service (backend)
- PDF export template
- Markdown export template
- Download UI on completed reviews
- Report indicates AI-generated vs. engineer-modified findings

### Estimated Complexity

**M** (3–5 days)

### Dependencies

- Sprint 6 complete (findings dispositioned)
- PRD: FR-9.1 through FR-9.5

### Acceptance Criteria

- [ ] User can export report for completed or in-progress reviews
- [ ] Report includes project metadata and review date
- [ ] Report includes finding count by severity
- [ ] Each finding lists description, severity, recommendation, citations, disposition
- [ ] AI-generated vs. engineer-modified findings clearly indicated
- [ ] Downloadable as PDF and Markdown
- [ ] All FR-9 requirements satisfied

---

### GitHub Issues

#### Issue #43: Design report data aggregation service

**Labels:** `sprint-7`, `backend`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** FR-9.2, FR-9.3, FR-9.4

**Description**  
Backend service compiling all report data from a review.

**Tasks**
- Report data model: project metadata, review date, reviewer, finding summary counts by severity/status
- Per finding: title, description, severity, recommendation, citations, disposition, engineer notes, is_modified flag
- `GET /api/v1/projects/{pid}/reviews/{id}/report` — return report JSON

**Acceptance Criteria**
- Report JSON includes all required fields per FR-9.2–FR-9.4
- is_modified=true when finding status=edited

---

#### Issue #44: Implement Markdown report export

**Labels:** `sprint-7`, `backend`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** FR-9.5

**Description**  
Generate Markdown formatted report from report data.

**Tasks**
- Jinja2 or f-string template for Markdown output
- Sections: header, summary table, findings detail
- Include citation references as footnotes
- `GET /api/v1/projects/{pid}/reviews/{id}/report.md` — download endpoint

**Acceptance Criteria**
- Valid Markdown rendered correctly
- All findings and citations included
- File downloads with filename `{project_name}_review_{date}.md`

---

#### Issue #45: Implement PDF report export

**Labels:** `sprint-7`, `backend`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** FR-9.5

**Description**  
Generate PDF report from report data.

**Tasks**
- Use WeasyPrint or reportlab for PDF generation
- Professional template: logo placeholder, project header, summary table, findings
- Severity color coding in PDF (with text labels for accessibility)
- `GET /api/v1/projects/{pid}/reviews/{id}/report.pdf` — download endpoint

**Acceptance Criteria**
- PDF renders correctly with all sections
- Downloadable with appropriate filename
- Readable on standard PDF viewers

---

#### Issue #46: Build Report Export UI

**Labels:** `sprint-7`, `frontend`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** FR-9.1, FR-9.5, G5

**Description**  
Download buttons on review detail page.

**Tasks**
- "Export Report" dropdown: PDF, Markdown
- Download triggers API endpoint and saves file
- Loading state during generation
- Preview summary before download (finding counts)
- Available for in-progress and completed reviews

**Acceptance Criteria**
- Both formats download successfully
- Loading indicator shown during generation
- Report export rate trackable (G5)

---

#### Issue #47: Add report generation tests

**Labels:** `sprint-7`, `backend`, `testing`, `priority-p2`  
**Complexity:** S  
**PRD Ref:** FR-9.1–FR-9.5

**Description**  
Verify report output completeness and format.

**Tasks**
- Fixture: completed review with 5 findings (mix of accepted, rejected, edited)
- Test Markdown output contains all findings and citations
- Test PDF generation returns valid PDF bytes
- Test is_modified flag present on edited findings

**Acceptance Criteria**
- Tests pass in CI
- Report content matches review data exactly

---

## Sprint 8 — Production Readiness

### Goal

Harden the platform for pilot deployment: real authentication, security controls, observability, performance validation, accessibility audit, and deployment automation.

### Deliverables

- JWT authentication (email/password)
- Project-level authorization enforcement
- Rate limiting and input validation hardening
- Structured logging and error monitoring
- Performance benchmarks validated against NFRs
- WCAG 2.1 AA audit on core workflow
- Production Docker Compose / deployment config
- Pilot onboarding documentation

### Estimated Complexity

**XL** (2–3 weeks)

### Dependencies

- Sprints 1–7 complete (full MVP feature set)
- PRD: FR-1, all NFR sections

### Acceptance Criteria

- [ ] Users authenticate via email/password; sessions expire on inactivity
- [ ] All endpoints enforce project-level authorization
- [ ] Rate limiting active on API endpoints
- [ ] Secrets loaded from environment only (NFR-S2)
- [ ] Structured logs with request IDs on all API calls
- [ ] P95 latency targets met: search ≤ 2s, ingestion ≤ 2min, review ≤ 5min
- [ ] Core workflow passes WCAG 2.1 AA audit
- [ ] Production deployment documented and reproducible
- [ ] Pilot team onboarded within 1 business day (G7)

---

### GitHub Issues

#### Issue #48: Implement JWT authentication system

**Labels:** `sprint-8`, `backend`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** FR-1.1, FR-1.3, NFR-S5

**Description**  
Replace auth stub with production JWT authentication.

**Tasks**
- `POST /api/v1/auth/register` — email/password registration with bcrypt hashing
- `POST /api/v1/auth/login` — return access token (15min) + refresh token (7d)
- `POST /api/v1/auth/refresh` — refresh access token
- `POST /api/v1/auth/logout` — invalidate refresh token
- JWT middleware replacing Sprint 1 auth stub
- Configurable session inactivity timeout

**Acceptance Criteria**
- Login returns valid JWT
- Expired tokens rejected with 401
- Refresh flow works without re-login
- Passwords hashed with bcrypt

---

#### Issue #49: Build login and registration UI

**Labels:** `sprint-8`, `frontend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-1.1

**Description**  
Frontend auth pages and token management.

**Tasks**
- `/login` and `/register` pages
- Store tokens in httpOnly cookie or secure storage
- Auth context provider wrapping app
- Redirect unauthenticated users to login
- Logout button in header
- Form validation and error display

**Acceptance Criteria**
- Unauthenticated access to `/projects` redirects to login
- Successful login navigates to project list
- Token refresh happens transparently

---

#### Issue #50: Enforce authorization on all API endpoints

**Labels:** `sprint-8`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** FR-1.2, NFR-S3

**Description**  
Audit and enforce project-level access control on every endpoint.

**Tasks**
- Audit all endpoints for `get_current_user` dependency
- Project ownership check on all project-scoped routes
- Return 403 for unauthorized access (never 404 to prevent enumeration)
- Add authorization integration tests for cross-user access attempts

**Acceptance Criteria**
- Every endpoint requires authentication except /auth and /health
- Cross-user access returns 403 on all resource types
- Test suite covers authorization scenarios

---

#### Issue #51: Add rate limiting and security hardening

**Labels:** `sprint-8`, `backend`, `priority-p0`  
**Complexity:** M  
**PRD Ref:** NFR-S6, NFR-S7

**Description**  
Protect API from abuse and validate all inputs.

**Tasks**
- Rate limiting middleware: 100 req/min per user (Redis-backed)
- Stricter limits on auth endpoints: 10 req/min
- File upload MIME validation beyond extension check
- Input sanitization on all text fields
- CORS restricted to configured frontend origin in production
- Remove dev auth stub and `X-User-Id` header support

**Acceptance Criteria**
- Rate limit returns 429 with Retry-After header
- Non-PDF uploads rejected even with spoofed content-type
- CORS blocks unauthorized origins in production config

---

#### Issue #52: Add structured logging and error monitoring

**Labels:** `sprint-8`, `backend`, `infra`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** NFR observability (PRD §11)

**Description**  
Production-grade observability for debugging and monitoring.

**Tasks**
- Structured JSON logging with request_id, user_id, endpoint, latency
- Log ingestion/review job start, complete, fail events
- Error tracking integration (Sentry or equivalent)
- Health check endpoint expanded: DB, Redis, storage connectivity
- Log OpenAI API latency and token usage per request

**Acceptance Criteria**
- All API requests logged with structured fields
- Failed jobs logged with error details and stack trace
- Health endpoint reports dependency status

---

#### Issue #53: Run performance benchmarks against NFRs

**Labels:** `sprint-8`, `backend`, `testing`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** NFR-P1 through NFR-P6

**Description**  
Validate system meets performance targets before pilot.

**Tasks**
- Benchmark: upload 25 MB PDF — target ≤ 30s
- Benchmark: ingest 100-page PDF — target P95 ≤ 2min
- Benchmark: review 50-page submittal — target P95 ≤ 5min
- Benchmark: search query — target P95 ≤ 2s
- Benchmark: API endpoints — target P95 ≤ 500ms (excluding upload/review)
- Document results in `docs/PERFORMANCE.md`

**Acceptance Criteria**
- All NFR-P targets met or documented exceptions with mitigation plan
- Benchmark scripts runnable in CI (with mocked OpenAI)

---

#### Issue #54: Conduct WCAG 2.1 AA accessibility audit

**Labels:** `sprint-8`, `frontend`, `priority-p1`  
**Complexity:** M  
**PRD Ref:** NFR-A1 through NFR-A5

**Description**  
Audit and remediate accessibility issues on core review workflow.

**Tasks**
- Run axe-core or Lighthouse accessibility audit on: project list, document upload, findings list, citation viewer, search
- Fix: keyboard navigation gaps, missing ARIA labels, contrast issues
- Verify severity badges use icons + labels (not color alone)
- Screen reader test on finding disposition flow
- Document audit results and fixes

**Acceptance Criteria**
- Zero critical accessibility violations on core workflow pages
- Keyboard-only navigation completes full review workflow
- Contrast ratio ≥ 4.5:1 on all text

---

#### Issue #55: Create production deployment configuration

**Labels:** `sprint-8`, `infra`, `priority-p0`  
**Complexity:** L  
**PRD Ref:** NFR-R1, NFR-SC1, NFR-S1

**Description**  
Deployment config for pilot environment.

**Tasks**
- Production Docker Compose or deployment manifest (Railway, Fly.io, or AWS ECS — TBD)
- Environment-specific config: prod `.env` template
- TLS termination configuration (NFR-S1)
- Database backup strategy
- Worker scaling: separate worker container/process
- Deployment runbook in `docs/DEPLOYMENT.md`

**Acceptance Criteria**
- One-command deploy to pilot environment
- TLS enabled on all public endpoints
- Worker processes restart automatically on failure

---

#### Issue #56: Write pilot onboarding guide

**Labels:** `sprint-8`, `docs`, `priority-p1`  
**Complexity:** S  
**PRD Ref:** G7

**Description**  
Guide for onboarding pilot teams within 1 business day.

**Tasks**
- Account creation and first login walkthrough
- Step-by-step: create project → upload docs → run review → disposition findings → export report
- Sample project with pre-loaded spec and submittal PDFs
- FAQ: data handling, AI limitations, supported file types
- Support contact information

**Acceptance Criteria**
- New pilot user completes first review within 1 business day following guide
- Sample project available for immediate exploration

---

#### Issue #57: Add E2E test for complete user journey

**Labels:** `sprint-8`, `testing`, `priority-p1`  
**Complexity:** L  
**PRD Ref:** §7 Core User Journey, G1, G2, G5, G6

**Description**  
End-to-end test covering the full workflow from PRD.

**Tasks**
- Playwright or Cypress E2E test suite
- Test flow: register → create project → upload spec + submittal → wait ingestion → run review → accept/reject findings → export PDF report
- Mock OpenAI API in test environment
- Run in CI on PR to main/develop

**Acceptance Criteria**
- E2E test passes in CI
- Covers all six journey steps from PRD §7
- Test completes in < 10 minutes

---

## Summary Timeline

| Sprint | Name | Complexity | Cumulative |
|---|---|---|---|
| Sprint 0 | Project Foundation | L | Week 1–2 |
| Sprint 1 | Project Dashboard | M | Week 2–3 |
| Sprint 2 | Document Management | L | Week 3–5 |
| Sprint 3 | AI Ingestion Pipeline | XL | Week 5–8 |
| Sprint 4 | Compliance Review Engine | XL | Week 8–11 |
| Sprint 5 | Knowledge Search | M | Week 11–12 |
| Sprint 6 | Engineer Review Workflow | L | Week 12–14 |
| Sprint 7 | Report Generation | M | Week 14–15 |
| Sprint 8 | Production Readiness | XL | Week 15–18 |

**Estimated MVP delivery:** 18 weeks from Sprint 0 start.

---

## Issue Index

| Issue | Title | Sprint | Complexity |
|---|---|---|---|
| #1 | Configure Docker Compose for full local stack | 0 | M |
| #2 | Scaffold FastAPI application structure | 0 | M |
| #3 | Set up Alembic migrations and base schema | 0 | M |
| #4 | Configure Next.js API client and app shell | 0 | S |
| #5 | Add GitHub Actions CI pipeline | 0 | S |
| #6 | Document local development setup | 0 | S |
| #7 | Implement Project SQLAlchemy model and migration | 1 | S |
| #8 | Build Project CRUD REST API endpoints | 1 | M |
| #9 | Add temporary auth stub for user scoping | 1 | S |
| #10 | Build Project List page | 1 | M |
| #11 | Build Create Project form | 1 | S |
| #12 | Build Project Detail page shell | 1 | M |
| #13 | Implement Document model and storage layer | 2 | M |
| #14 | Build document upload API endpoint | 2 | M |
| #15 | Build document list and delete API endpoints | 2 | S |
| #16 | Build Document Upload UI component | 2 | M |
| #17 | Build Document List UI | 2 | M |
| #18 | Add document storage volume to Docker Compose | 2 | S |
| #19 | Design document_chunks schema with pgvector | 3 | M |
| #20 | Implement PDF text extraction service | 3 | M |
| #21 | Implement text chunking service | 3 | M |
| #22 | Implement OpenAI embedding service | 3 | M |
| #23 | Build Redis-backed ingestion worker | 3 | L |
| #24 | Display ingestion status in frontend | 3 | S |
| #25 | Add ingestion integration tests | 3 | M |
| #26 | Design Review and Finding database models | 4 | M |
| #27 | Implement semantic context retrieval | 4 | L |
| #28 | Design compliance review prompt template | 4 | L |
| #29 | Build compliance review worker | 4 | XL |
| #30 | Build "Run Review" UI flow | 4 | M |
| #31 | Build Findings List UI | 4 | M |
| #32 | Build basic Citation Viewer component | 4 | M |
| #33 | Implement semantic search API endpoint | 5 | M |
| #34 | Add search result ranking and excerpt truncation | 5 | S |
| #35 | Build Knowledge Search UI | 5 | M |
| #36 | Add search analytics logging | 5 | S |
| #37 | Implement finding disposition API endpoints | 6 | M |
| #38 | Build findings filter and query API | 6 | S |
| #39 | Build Finding Disposition UI | 6 | L |
| #40 | Build AI vs. Engineer diff view | 6 | M |
| #41 | Enhance Citation Viewer with PDF page display | 6 | L |
| #42 | Add review completion workflow | 6 | S |
| #43 | Design report data aggregation service | 7 | M |
| #44 | Implement Markdown report export | 7 | S |
| #45 | Implement PDF report export | 7 | M |
| #46 | Build Report Export UI | 7 | S |
| #47 | Add report generation tests | 7 | S |
| #48 | Implement JWT authentication system | 8 | L |
| #49 | Build login and registration UI | 8 | M |
| #50 | Enforce authorization on all API endpoints | 8 | M |
| #51 | Add rate limiting and security hardening | 8 | M |
| #52 | Add structured logging and error monitoring | 8 | M |
| #53 | Run performance benchmarks against NFRs | 8 | M |
| #54 | Conduct WCAG 2.1 AA accessibility audit | 8 | M |
| #55 | Create production deployment configuration | 8 | L |
| #56 | Write pilot onboarding guide | 8 | S |
| #57 | Add E2E test for complete user journey | 8 | L |

**Total issues:** 57

---

*This roadmap is derived from [PRODUCT_SPEC.md](../PRODUCT_SPEC.md) and should be updated as sprints complete and scope changes.*
