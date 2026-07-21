# Engineering Standards — Remy Review Studio

This document is the detailed coding standards and conventions reference for Remy Review Studio. It answers "how do we write code here" — naming, structure, layering, and per-domain rules for frontend, backend, AI, and database work.

For *why* the project exists and what it must do, see [PRODUCT_SPEC.md](./PRODUCT_SPEC.md). For *how the system is put together*, see [ARCHITECTURE.md](./ARCHITECTURE.md). For the high-level principles and AI operating rules that govern how work gets planned and reviewed, see [CLAUDE.md](./CLAUDE.md) — that document is the summary; this one is the reference.

---

## Table of Contents

- [Coding Standards](#coding-standards)
- [Frontend Standards](#frontend-standards)
- [Backend Standards](#backend-standards)
- [AI Standards](#ai-standards)
- [Database Standards](#database-standards)
- [Testing Standards](#testing-standards)
- [Performance Standards](#performance-standards)
- [Security Standards](#security-standards)

---

## Coding Standards

### TypeScript

- `strict: true` in `tsconfig.json`, always. Never weaken it to make an error go away.
- No `any`. Use `unknown` and narrow, or fix the underlying type. If you truly cannot type something (e.g., a third-party module with no types), isolate it behind a typed wrapper function and leave a one-line comment explaining why.
- Prefer `type` for data shapes and unions; use `interface` only when you need declaration merging or are defining a component's props in a way the team has already standardized on.
- No non-null assertions (`!`) as a substitute for actually handling the `null`/`undefined` case, except where you can prove — in a comment — that the runtime guarantee holds (e.g., immediately after a length check).

### Python

- Type hints on every function signature (parameters and return type). No untyped `def`.
- Follow PEP 8; enforced via `ruff` in CI (per docs/IMPLEMENTATION_ROADMAP.md Sprint 0, Issue #5).
- Use Pydantic models for anything crossing a boundary (API request/response, LLM structured output, settings) — never pass around bare `dict`s for structured data.
- Prefer `async def` for anything that does I/O (DB, HTTP, OpenAI calls). See [Backend Standards](#backend-standards).

### Naming Conventions

- Names describe the domain concept, not the implementation. `SubmittalDocument`, not `Doc2`. `pendingFindings`, not `data`.
- Match the vocabulary in PRODUCT_SPEC.md §15 (Glossary) exactly: `Submittal`, `Specification`, `Finding`, `Citation`, `Disposition`, `Chunk`. Do not invent synonyms for concepts the glossary already names.
- TypeScript: `camelCase` for variables/functions, `PascalCase` for components/types, `SCREAMING_SNAKE_CASE` for module-level constants.
- Python: `snake_case` for variables/functions/modules, `PascalCase` for classes, `SCREAMING_SNAKE_CASE` for constants.
- Booleans read as predicates: `isReady`, `has_citation`, not `ready_flag` or `status2`.

### Folder Conventions

- Group by feature/domain concept first, by technical layer second, within each app (see [ARCHITECTURE.md § Repository Structure](./ARCHITECTURE.md#repository-structure)).
- One primary export per file where practical; file name matches the export (`ProjectCard.tsx` exports `ProjectCard`).
- Tests live next to the code they test (`foo.ts` + `foo.test.ts`) or in a mirrored `tests/` tree on the backend — pick the convention already used in that app and stay consistent within it.

### Import Ordering

Group imports in this order, with a blank line between groups:

1. External/third-party packages
2. Internal absolute imports (e.g., `@/lib/...`, `app.services...`)
3. Relative imports (`./`, `../`)
4. Type-only imports last within their group (TypeScript `import type`)

Let the linter/formatter (ESLint import ordering on the frontend, `ruff` on the backend) enforce this automatically rather than hand-sorting.

### Formatting

- Frontend: Prettier defaults via the project's ESLint config. Do not hand-format against the tool.
- Backend: `ruff format` (or `black`-compatible formatting). Do not hand-format against the tool.
- Never mix formatting-only changes into a functional PR.

### Comments

- Default to no comments. Well-named code is the primary documentation.
- Write a comment only when it explains a non-obvious *why*: a workaround for a specific bug, a hidden invariant, a regulatory/spec reason for an odd threshold, a reason a "simpler" approach was rejected.
- Never write a comment that restates what the code already says.
- Docstrings on public service/repository functions in the backend are encouraged when the function's contract (side effects, exceptions raised) isn't obvious from its signature — keep them to one or two lines.

### Error Handling

- Backend: raise typed, specific exceptions from the service layer; let a global exception handler (per docs/IMPLEMENTATION_ROADMAP.md Sprint 0, Issue #2) translate them into structured JSON responses (`{ "detail": ..., "request_id": ... }`). Route handlers should not contain bare `try/except`.
- Never swallow an exception silently. If you catch it, either handle it meaningfully or re-raise.
- Frontend: every data-fetching hook must surface a distinguishable error state to its component (see [Frontend Standards](#frontend-standards) — loading/empty/error states are mandatory, not optional).
- Validate at system boundaries (API request bodies, file uploads, LLM responses). Do not add defensive checks for conditions that are already guaranteed by types or by an earlier validation step.

### Logging

- Structured (JSON) logs on the backend, including `request_id`, `user_id` where available, and latency — see docs/IMPLEMENTATION_ROADMAP.md Sprint 8, Issue #52.
- Log background job lifecycle events (ingestion/review: queued, started, completed, failed) with enough context to debug without reproducing locally.
- Log OpenAI request latency and token usage per call — this feeds cost-per-review tracking (PRD Secondary Metrics).
- Never log secrets, full document contents, or raw PII. Log identifiers (`document_id`, `project_id`), not payloads.

### Configuration

- All configuration and secrets come from environment variables, loaded via a typed Pydantic `Settings` object on the backend (`app/core/config.py`) and `NEXT_PUBLIC_*` env vars on the frontend.
- `.env.example` is the documentation of what variables exist — keep it current whenever you add or remove a variable (see [Security Standards](#security-standards) for the "never commit secrets" rule).
- No hardcoded URLs, API keys, or environment-specific values in application code.

---

## Frontend Standards

- **Server Components first.** Default every new component to a Server Component. Only add `"use client"` when the component genuinely needs interactivity, browser APIs, or React state/effects that can't live on the server.
- **Client Components only when required** — and pushed as far down the tree (as "leaf" as possible) so the surrounding layout and data-fetching stay on the server.
- **Use React Query** for all server-state fetching, caching, and mutation on the client. Do not hand-roll `useEffect` + `fetch` data fetching. The `QueryClientProvider` is mounted once in the root layout (`components/providers/query-provider.tsx`) — don't create a second one.
- **State management, in order of preference: Server Components → React Query → component-local `useState` → Zustand.** The first three cover the large majority of state in this app. Reach for Zustand only for the fixed set of *global* UI state that many unrelated components need to read or write and that doesn't belong to either the server or a single component subtree:
  - Sidebar collapsed
  - Theme
  - Current project (the *selection* — which project is active; the project's own data is a React Query result, not a store field)
  - Global filters
  - Command palette (open state, query)

  If a piece of state is scoped to one component or a tightly nested subtree (a form's current step, a single panel's expanded/collapsed state), that's component-local `useState`, not a global store — don't add it to Zustand by default just because Zustand is available. Server data (projects, documents, findings, anything the backend owns) always goes through React Query, never into Zustand. If you're tempted to mirror a React Query result into Zustand "for convenience," don't — that's a cache-invalidation bug waiting to happen. Introducing a new top-level Zustand store (beyond the list above) is a "major decision" under [CLAUDE.md](./CLAUDE.md#claude-operating-instructions) — surface it rather than adding one ad hoc.
- **Use React Hook Form + Zod** for every form, pairing a Zod schema (via `@hookform/resolvers`) as both the client-side validation source and the shape that mirrors the backend's Pydantic request schema. Don't hand-roll form state with `useState` once a form has more than one or two fields.
- **Use the shared Axios client** (`lib/api-client.ts`) for all HTTP requests to the backend — a single configured instance (base URL from `NEXT_PUBLIC_API_URL`, shared error handling), not ad hoc `axios.get(...)` calls scattered across components. Pair it with React Query (`queryFn`/`mutationFn` call the client) rather than using it directly inside components.
- **Use Sonner** for toast notifications (e.g., "Project created," "Upload failed"). One `<Toaster />` renders once, near the app's providers — don't mount a second instance per page.
- **Use react-dropzone** for drag-and-drop file upload interactions (document upload, Sprint 2). Client-side file-type/size pre-validation is a UX nicety only — the backend remains the source of truth per [Security Standards](#security-standards).
- **Use react-pdf** for in-app PDF rendering (Citation Viewer, Sprint 4+). Always provide the excerpt-text fallback (FR-6.4) for when rendering fails — don't let a PDF.js error blank the whole panel.
- **Use Recharts** for data visualization (throughput/analytics, Sprint 6+). Follow the same color-independent-status principle as severity badges: don't make a chart's only signal be color.
- **Use Framer Motion sparingly.** Reach for it only when a transition genuinely needs orchestration (shared layout animations, exit transitions) that Tailwind's CSS transition utilities can't express. Simple hover/focus/opacity changes stay in CSS — don't wrap every interactive element in a `motion.div` by default.
- **Use shadcn/ui** as the base component layer. Extend/compose these components rather than introducing a second competing UI kit.
- **Accessibility is required, not aspirational.** WCAG 2.1 AA on the core review workflow is a PRD requirement (NFR-A1–A5): keyboard-navigable, screen-reader-compatible, 4.5:1 contrast minimum, and — critically — severity must never be conveyed by color alone (icon + label always).
- **No inline styles.** Use Tailwind utility classes and the project's design tokens. An inline `style={{ ... }}` is a signal something belongs in the design system instead.
- **No duplicated components.** Before writing a new component, check `components/` and `components/ui/` for an existing one to extend or compose. Two near-identical components is a bug waiting to diverge.
- **Responsive design** is required for all shipped UI — desktop-primary per PRD Assumption 4, but tablet-readable at minimum.
- **Loading, empty, and error states are mandatory** for every view that fetches data. A screen that only handles the "happy path with data" is an incomplete feature, not a finished one — this is explicit in the roadmap's acceptance criteria for every list/detail page (e.g., Issues #10, #17, #35).

---

## Backend Standards

- **FastAPI** route handlers are the outermost layer only: parse/validate the request (via Pydantic schemas), call a service method, return the response. **No business logic inside route handlers.** If a route handler contains an `if` statement deciding domain behavior, move it to a service.
- **Dependency Injection** via FastAPI's `Depends()` for things like the current user, DB session, and service instances. Don't reach for globals or module-level singletons where DI is the idiomatic tool.
- **Service layer architecture**: `app/services/` holds orchestration and business rules (e.g., "running a review" coordinates retrieval, the LLM call, and persistence). Services depend on repositories and other services — never directly on route-level request/response objects.
- **Repositories**: `app/repositories/` isolate all data access behind an interface per aggregate (`ProjectRepository`, `DocumentRepository`, `FindingRepository`). Services never construct raw SQLAlchemy queries inline — they call a repository method. This is what makes services testable without a database.
- **Pydantic models** define every API request/response shape (`app/schemas/`) and are distinct from ORM models (`app/models/`). Do not return SQLAlchemy model instances directly from a route.
- **Typed responses**: every endpoint declares a `response_model`. No endpoint returns a bare `dict` or untyped JSON.
- **Async first**: any function performing I/O (DB queries, HTTP/OpenAI calls, file I/O) is `async def`. Do not mix blocking calls into the async request path — push blocking work to a background worker.
- User-scoping and authorization checks belong in the service or repository layer (scoped queries), not sprinkled ad hoc across route handlers — see docs/IMPLEMENTATION_ROADMAP.md Sprint 8, Issue #50 for the authorization audit pattern this generalizes from.

---

## AI Standards

All AI-generated content in this product — compliance findings, search relevance, any future generated text — must satisfy every item below. These are correctness requirements, not style preferences; a finding that fails one of these is a defect, not an edge case. (The product-level rationale for these rules is in [CLAUDE.md § Product Vision](./CLAUDE.md#product-vision) — this section is the implementation contract.)

- **Explainable.** A user must be able to see, for any AI output, what inputs (document chunks, prompt version, model version) produced it.
- **Include citations.** Every finding includes at least one citation object (`document_id`, `page_number`, `section_ref`, `excerpt`). Output that produces zero citations must be rejected before it reaches persistence — validate this in code, don't rely on prompt instructions alone.
- **Produce structured JSON.** All LLM calls that feed the product (not ad hoc exploration) use a defined output schema (Pydantic) and are validated against it. Malformed output is treated as a failed review, not silently accepted or auto-corrected.
- **Avoid hallucinations.** Findings must be grounded in retrieved context (spec/drawing chunks), not the model's general knowledge of construction. `temperature = 0` for review generation. If retrieval returns no relevant context, the system should say so rather than let the model fill the gap.
- **Never fabricate evidence.** A citation's `excerpt` must be text that actually exists in the cited chunk at the cited location — never a paraphrase presented as a quote. If you can't trace an excerpt back to a stored chunk, the citation is invalid.

Structural rules:

- **Prompt templates belong in one location**: `backend/app/ai/prompts/` (or equivalent single directory). Do not inline prompt strings inside services or workers. Every prompt template is versioned (e.g., `v1.0.0`) and the version is persisted with every review run (PRD FR-5.7) so output can be reproduced and audited.
- **LLM logic is isolated** behind a thin client interface in `app/ai/` (e.g., `LLMClient`, `EmbeddingClient`). Services call this interface, never the OpenAI SDK directly. This is what lets us swap providers or mock the LLM in tests without touching business logic.
- Findings always start in `pending` status. Nothing in the AI pipeline may set a finding to `accepted` — that transition belongs exclusively to an explicit engineer action.
- The immutable `ai_original` payload on a finding is written once, at creation, and never mutated afterward — engineer edits go into the mutable fields, not over the original.

---

## Database Standards

- **Normalize data.** Model relationships explicitly (foreign keys between `projects`, `documents`, `reviews`, `findings`, `citations`, `document_chunks`) rather than duplicating or denormalizing data prematurely. Denormalize only with a documented performance justification.
- **Use migrations.** Every schema change ships as an Alembic migration, committed alongside the code that depends on it. Never hand-edit the schema against a running database. Migrations must be reversible (`alembic downgrade` must not corrupt data) wherever practical.
- **Soft deletes** for anything a user can "delete" that we need to retain for audit/compliance purposes — e.g., archiving a project sets `status=archived` and `archived_at`, it does not remove the row (PRD FR-2.4). Hard deletes are reserved for genuinely ephemeral data (e.g., a document's file + chunks when the user explicitly deletes that document, per FR-3.7).
- **UUID primary keys** on all tables, not auto-incrementing integers — avoids leaking sequential IDs across project boundaries and simplifies future multi-tenant/distributed concerns.
- **Audit timestamps** (`created_at`, `updated_at`, and action-specific timestamps like `archived_at`, `uploaded_at`, `completed_at`) on every table. These are not optional metadata — they are how QA/QC audits review history (PRD Persona C) and how we measure Time to Completed Review (PRD §12 North Star Metric).
- All project-scoped tables must be queryable and indexed by `project_id` — every review, document, finding, and chunk belongs to exactly one project, and project isolation is a hard security boundary (PRD FR-2.5, NFR-S3).

---

## Testing Standards

- **Unit tests** for service-layer business logic, repository query behavior, chunking/extraction logic, and prompt/schema validation. Business logic isolated per [Backend Standards](#backend-standards) should be trivially unit-testable without a live database or LLM call.
- **Integration tests** for pipelines that cross boundaries: document ingestion end-to-end (upload → extract → chunk → embed → ready), review generation (retrieval → LLM → persisted findings with citations), and report export. Mock the OpenAI API in CI (per docs/IMPLEMENTATION_ROADMAP.md Issue #25) — never spend real API budget or introduce nondeterminism into CI runs.
- **No feature is complete without tests.** A roadmap issue's acceptance criteria are the minimum test bar, not a ceiling — if you find an edge case while implementing, add a test for it.
- Frontend: cover data-fetching hooks and non-trivial client components; critical multi-step flows (upload → review → disposition → export) get end-to-end coverage (Playwright/Cypress, per docs/IMPLEMENTATION_ROADMAP.md Issue #57) rather than being left to manual QA.

---

## Performance Standards

- **Avoid unnecessary renders.** Keep Server Components as the default (see [Frontend Standards](#frontend-standards)) and memoize/scope Client Component state tightly — don't lift state higher than the component that needs it.
- **Optimize database queries.** Every project-scoped query must hit an index (see [Database Standards](#database-standards)). Watch for N+1 query patterns in list endpoints; use eager loading or batched queries instead.
- **Paginate large datasets.** Project lists, document lists, findings lists, and search results are all paginated — never return an unbounded result set from an API endpoint.
- **Cache expensive operations.** Embeddings are cached by content hash to avoid redundant OpenAI spend (docs/IMPLEMENTATION_ROADMAP.md Issue #22). Consider Redis caching for repeated expensive reads as the product matures, but don't cache prematurely — measure first.
- These map directly to the PRD's NFR-P targets (search ≤ 2s P95, ingestion ≤ 2min P95 for 100 pages, review ≤ 5min P95, general API ≤ 500ms P95) — treat those numbers as acceptance criteria, not aspirations.

---

## Security Standards

- **Never commit secrets.** API keys, database credentials, and tokens live in environment variables only, sourced from `.env` (gitignored) and documented (not filled in) in `.env.example`. Enable secret scanning in CI.
- **Validate every request.** Every API input is validated via a Pydantic schema. Never trust client-supplied data, including IDs used for authorization checks.
- **Sanitize uploads.** File uploads are validated by content (magic bytes), not just extension or client-reported `Content-Type`. Enforce the 50 MB PDF limit server-side, not just in the UI (PRD FR-3.1, NFR-S6).
- **Protect AI prompts.** Treat extracted document text as untrusted input to the LLM — it can contain prompt-injection attempts. System prompts and instructions must be isolated from user/document-derived content, and LLM output must be schema-validated before it is trusted (PRD AI Risks: Prompt injection via uploaded documents).
- **Use least privilege.** Project-level authorization is enforced on every resource-scoped endpoint (PRD FR-1.2, NFR-S3) — a user must never be able to read or modify another user's project data. Unauthorized access returns 403, and cross-tenant existence should not be leaked via 404-vs-403 differences (see docs/IMPLEMENTATION_ROADMAP.md Issue #50).
- All data in transit uses TLS 1.2+; OpenAI is configured not to retain data for model training (NFR-S1, NFR-S4).
