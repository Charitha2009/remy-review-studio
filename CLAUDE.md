# CLAUDE.md — AI Operating Instructions

This document governs how Claude (or any AI agent) works in the Remy Review Studio repository: how to behave, what principles to apply, and what workflow to follow. It is intentionally short. Detailed coding conventions live in [ENGINEERING.md](./ENGINEERING.md), system design lives in [ARCHITECTURE.md](./ARCHITECTURE.md), and product requirements live in [PRODUCT_SPEC.md](./PRODUCT_SPEC.md). Read this file first on every session; consult the others as the task requires.

## Document Map

| Document | Answers | Read it when |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) (this file) | How should I behave and work? | Every session, first |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | What are we building, for whom, and why? | Before any feature work |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | How is the system put together? | Before touching a new component or boundary |
| [ENGINEERING.md](./ENGINEERING.md) | What are the exact coding conventions? | While writing code |
| [docs/IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md) | What's the build sequence and current sprint? | Before scoping a new task |
| [docs/adr/](./docs/adr/) | Why was a hard-to-reverse decision made this way? | Before proposing an alternative |

**Session start checklist** — run through this before touching code, every session:

1. Skim this file if it's been more than a few sessions since you last read it in full.
2. Identify the roadmap sprint/issue the task belongs to (see [Working With the Roadmap](#working-with-the-roadmap)).
3. Check [Current State of the Codebase](#current-state-of-the-codebase) so you don't assume infrastructure that isn't built yet.
4. Note anything in [Red Flags — Stop and Ask](#red-flags--stop-and-ask) that might apply to the task.

---

## Project Overview

Remy Review Studio is an AI-powered platform for reviewing construction submittals against project specifications and drawings. Project engineers currently spend 4–8 hours a week manually cross-referencing hundreds of pages of PDFs. Remy Review Studio replaces that manual search-and-compare loop with a structured workflow: upload documents, let AI surface candidate compliance findings backed by citations, and let the engineer accept, reject, or edit each finding before it reaches a report.

The mission is narrow and deliberate: **make submittal review faster, more consistent, and fully traceable — without removing the engineer from the decision.**

**Explicitly out of scope for MVP** (PRODUCT_SPEC.md §6) — treat a request that resembles any of these as a signal to confirm scope before building:

| Non-goal | Why it's excluded |
|---|---|
| Autonomous submittal approval | Engineers retain final authority; AI assists only |
| Full construction management platform | Not competing with Procore, Autodesk Build, Primavera |
| CAD/BIM model analysis | MVP is document-based (PDF) only |
| Contractor submission portal | GC users consume outputs; submission workflow is Phase 2 |
| Multi-language document support | English-only at launch |
| On-premise / air-gapped deployment | Cloud-hosted MVP |
| Real-time collaborative markup | Multi-user simultaneous editing is Phase 2 |
| Automated RFI creation | Finding-to-RFI workflow is future scope |
| Mobile-native app | Desktop-first, responsive web only |

---

## Current State of the Codebase

Do not assume the target structure described in [ARCHITECTURE.md](./ARCHITECTURE.md) and [ENGINEERING.md](./ENGINEERING.md) already exists — it describes where the code is heading, per the roadmap, not necessarily where it is today. As of writing:

- `backend/` has a real module layout (`api/ core/ database/ models/ schemas/ repositories/ services/ storage/`) with Projects (`GET /projects`, `GET /projects/{id}`) and Documents (`GET/POST /projects/{id}/documents`, `GET/DELETE /documents/{id}`) implemented end-to-end — routes → services → repositories, per ENGINEERING.md. `ai/` and `workers/` don't exist yet (no ingestion, no review pipeline). Runs on SQLite via SQLAlchemy + Alembic migrations, not the Postgres+pgvector target in ARCHITECTURE.md — see [ADR-0002](./docs/adr/0002-sqlite-for-mvp-backend.md) for why and the migration path. No auth: any caller can hit any project/document. `backend/uploads/` is local file storage behind a `StorageBackend` interface (see [ADR-0002](./docs/adr/0002-sqlite-for-mvp-backend.md) and `app/storage/`).
- `frontend/` is a Next.js 15 App Router app with React Query, axios, react-dropzone, Sonner, and shadcn/ui-derived components in active use (check `package.json` for the current set before assuming something is/isn't available). The Documents tab (`app/projects/[projectId]/documents/`) fetches and uploads through the real backend via `lib/documents-api.ts` + `hooks/use-project-documents.ts` — no more placeholder document data. Projects themselves (workspace shell header, switcher, breadcrumbs) and Review Sessions still read from static placeholder fixtures (`lib/placeholder-projects.ts`, `lib/placeholder-reviews.ts`) — the 3 seeded backend projects intentionally share ids with `lib/placeholder-projects.ts` so those routes keep resolving.
- `docker-compose.yml` is still an empty placeholder (Sprint 0 Issue #1 not started). Root `.env.example` is filled in for both apps; `frontend/.env.local` and any `backend/.env` are local-only and gitignored.
- Alembic migrations exist (`backend/alembic/`) for `projects`/`documents`. No auth, no ingestion pipeline, no review-generation pipeline, no report generation exist yet.

When a task requires infrastructure that isn't there yet, either scope the task to include creating it (if it's small and in line with the current sprint) or flag the gap to the user rather than silently building on top of an assumption.

`frontend/CLAUDE.md` and `frontend/AGENTS.md` contain Next.js-version-specific agent notes scoped to that directory — they supplement, not replace, this file when working inside `frontend/`. `scripts/` exists but is currently empty; it's the intended home for one-off and repeatable dev/ops scripts (seeding, migration helpers) as they're introduced.

Keep this section current: when a sprint's foundational work lands (e.g., Sprint 0 fills in `docker-compose.yml`, or Sprint 3 stands up the ingestion worker), update the bullets above in the same PR so the next session isn't working from a stale picture.

---

## Glossary Quick Reference

Use this vocabulary exactly — in code, comments, commit messages, and conversation with the user. Full definitions in PRODUCT_SPEC.md §15.

| Term | Meaning |
|---|---|
| **Submittal** | Contractor/vendor package (product data, shop drawings, certifications) submitted for compliance review |
| **Specification (Spec)** | Contract document describing material/performance requirements, organized by CSI MasterFormat division |
| **Drawing** | Graphical contract document (plan, elevation, section, detail), identified by sheet number |
| **Finding** | A single AI-generated (or engineer-edited) compliance observation: title, description, severity, recommendation |
| **Citation** | A finding's link back to a source location: document, page, section, excerpt |
| **Disposition** | An engineer's decision on a finding: accepted, rejected, or edited |
| **Chunk** | A 500–1000 token segment of extracted document text — the unit of embedding and retrieval |
| **CSI MasterFormat** | Industry-standard 50-division spec organization (e.g., Division 23 = HVAC) |

---

## Common Task Patterns

These are the standard shapes most implementation tasks take. Use them as a checklist starting point, not a substitute for reading the specific ENGINEERING.md sections they reference.

**Adding a new backend API endpoint:**
1. Pydantic request/response schemas in `app/schemas/`
2. Repository method(s) in `app/repositories/` if new data access is needed
3. Service method in `app/services/` containing the actual business logic
4. Thin route handler in `app/api/` wiring request → service → response
5. Alembic migration if the data model changed
6. Unit test(s) for the service logic, integration test if it crosses a boundary (DB, LLM)
7. Confirm project-scoping/authorization is enforced (see [ENGINEERING.md § Security Standards](./ENGINEERING.md#security-standards))

**Adding a new frontend page/view:**
1. Route under `app/` (Server Component by default)
2. React Query hook for data fetching if the page needs server state
3. Loading, empty, and error states (all three — not optional)
4. Compose from existing `components/ui/` (shadcn/ui) before creating new primitives
5. Verify keyboard navigation and color-independent status indicators if the view touches the review workflow
6. Check responsiveness at desktop and tablet widths

**Changing anything in the AI pipeline (retrieval, prompting, parsing):**
1. Re-read [ENGINEERING.md § AI Standards](./ENGINEERING.md#ai-standards) and the [Red Flags](#red-flags--stop-and-ask) list below first
2. Bump the prompt template version if the prompt text changes
3. Confirm structured-output validation still rejects malformed/uncited responses
4. Add or update a test fixture proving citation coverage is unaffected

**Recording a significant technical decision:**
1. Create `docs/adr/NNNN-short-title.md`, numbered sequentially after the last existing ADR
2. Follow the format in [ADR-0001](./docs/adr/0001-monorepo.md): Status, Context, Decision, Alternatives Considered, Pros, Cons, Consequences, Future Considerations
3. Cross-link it from [ARCHITECTURE.md](./ARCHITECTURE.md) if it affects system design
4. Do this *before* implementing the decision, not as a retroactive writeup

---

## Product Vision — The Four Non-Negotiables

Every feature decision, and especially every AI-adjacent decision, is constrained by four principles from PRODUCT_SPEC.md. They are not style preferences — they are the product's reason for existing:

1. **AI assists engineers; it does not replace them.** The system generates candidate findings. It never auto-approves, auto-rejects, or auto-submits anything. Zero auto-approved findings is a hard MVP goal (PRD G6).
2. **Engineers make the final decision.** Every finding begins `pending`. UI copy and interaction design must reinforce engineer authority, not AI authority.
3. **Every AI answer must have citations.** A finding with zero citations is not a valid finding — it is a bug. 100% citation coverage is a hard product goal (PRD G2).
4. **Explainability is mandatory.** An engineer must be able to see *why* the AI produced a finding: which document, which page, which excerpt. If you cannot explain a finding's provenance, do not ship the feature that produces it.

Any change that weakens these four principles requires explicit product sign-off — treat it as a "major architectural decision" under [Claude Operating Instructions](#claude-operating-instructions) below, not a routine implementation call. The technical rules that enforce these principles in code live in [ENGINEERING.md § AI Standards](./ENGINEERING.md#ai-standards).

**Who you're building for.** The primary user is a Project Engineer (PRD Persona A) making a compliance judgment call they will personally stand behind. When a design choice is ambiguous, resolve it in favor of the person who has to defend the finding, not the person who wants the fastest possible answer.

| Persona | Cares most about |
|---|---|
| Project Engineer (primary) | Defensible findings with clear spec references; not being embarrassed by a wrong AI claim |
| Construction Manager | Visibility into review status/bottlenecks; exportable summaries |
| QA/QC Engineer | Auditing *how* a finding was reached, not just the conclusion; consistency across reviewers |
| General Contractor | Specific, actionable review comments instead of vague rejections |

**Success metrics that should shape trade-offs** (full list in PRD §12): 100% citation coverage on AI findings (G2), zero auto-approved findings (G6), ≥ 60% finding acceptance rate (G3), 50% reduction in time-to-review (G1). If a proposed change would move the product away from any of these, that's a reason to flag it, not just implement it.

---

## Engineering Philosophy

- **Build for maintainability, not for the resume.** Optimize for a codebase a new engineer can understand in an afternoon and safely change a year from now.
- **Prefer simple over clever.** If a junior engineer can't read a function and understand it in one pass, it's too clever.
- **Domain-driven design.** Model code around real construction-review concepts — Project, Document, Review, Finding, Citation, Disposition — not database tables or framework primitives.
- **Clean Architecture.** Business rules do not depend on frameworks, databases, or the LLM provider. Route handlers, ORM models, and OpenAI SDK calls are details that plug into the domain, not the other way around.
- **Human-centered AI.** Every AI-touching decision is evaluated first against the four principles above.
- **Documentation first.** Update the relevant doc (PRD, ARCHITECTURE, ROADMAP, or an ADR) before or alongside a change that affects behavior — see [Documentation Standards](#documentation-standards).
- **Small, incremental changes.** Ship the smallest change that delivers value and can be reviewed in one sitting.
- **Strong typing.** TypeScript `strict` mode and Python type hints validated by static analysis are not optional.
- **Testability.** If logic is hard to test, that's a design smell — usually business logic leaking into a route handler or component.

Full conventions implementing these principles are in [ENGINEERING.md](./ENGINEERING.md).

---

## Working With the Roadmap

[docs/IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md) decomposes the MVP into nine sprints (0–8) and 57 issues, each sized to land as one pull request, each traced back to a PRD functional requirement. Use it as your default scoping tool:

- **Before starting a task, find its issue (or nearest equivalent).** If the user's request matches an existing roadmap issue, use that issue's description, tasks, and acceptance criteria as your spec — don't re-derive requirements from scratch or from assumptions.
- **Respect sprint dependencies.** The roadmap's dependency graph exists because later sprints assume earlier ones are done (e.g., you cannot build the Compliance Review Engine (Sprint 4) correctly without the ingestion pipeline (Sprint 3) it retrieves context from). If a request jumps ahead of a dependency that isn't actually done yet, say so before starting.
- **If a request falls outside the roadmap entirely** (a feature not in PRODUCT_SPEC.md's MVP scope, or explicitly listed under §6 Non Goals), flag that explicitly and confirm the user wants to go outside the documented plan rather than silently expanding scope.
- **The roadmap is a plan, not a cage.** If, while implementing, you discover the roadmap's approach is wrong (e.g., an issue's task list conflicts with what Sprint 0's actual foundation ended up looking like), surface the discrepancy — don't silently deviate and don't silently force a bad fit either.

**Sprint timeline at a glance** (full detail, dependencies, and issue lists in docs/IMPLEMENTATION_ROADMAP.md):

| Sprint | Name | Primary PRD Coverage |
|---|---|---|
| 0 | Project Foundation | Infrastructure baseline for all FRs |
| 1 | Project Dashboard | FR-2 (Project Management) |
| 2 | Document Management | FR-3 (Document Upload & Storage) |
| 3 | AI Ingestion Pipeline | FR-4 (Document Ingestion) |
| 4 | Compliance Review Engine | FR-5 (AI Review), FR-6 (Citations — partial) |
| 5 | Knowledge Search | FR-8 (Knowledge Search) |
| 6 | Engineer Review Workflow | FR-7 (Engineer Review), FR-6 (Citations — complete) |
| 7 | Report Generation | FR-9 (Report Export) |
| 8 | Production Readiness | FR-1, all NFRs |

---

## Verification Workflow

Before reporting a task as complete, actually verify it — do not treat "the code looks right" as equivalent to "the code works":

- **Backend changes:** run the relevant tests and the linter/type-checker locally (or via the project's CI configuration) rather than asserting they would pass.
- **Frontend changes:** start the dev server and exercise the actual feature in a browser — the golden path and at least one edge case (empty state, error state). Type-checking and unit tests verify code correctness, not feature correctness; if you cannot drive the UI yourself, say so explicitly instead of claiming the feature works.
- **AI pipeline changes:** verify citation coverage and structured-output validation didn't regress — a review that "looks plausible" but silently drops the citation-validation step is a regression, not a success.
- **Migrations:** confirm `alembic upgrade head` applies cleanly and, where practical, that `alembic downgrade -1` doesn't corrupt data.
- **Report/export changes:** open the generated PDF/Markdown output and confirm it actually contains what the code claims to produce — a template that renders without error can still omit a required field.

Only after verification should a change be presented as done against the [Definition of Done](#definition-of-done) checklist below.

---

## Git Workflow

- **Feature branches.** All work happens on a branch off `develop` (or `main` once `develop` is retired), named descriptively (e.g., `feat/project-crud-api`, `fix/citation-viewer-keyboard-nav`).
- **Conventional commits.** `type(scope): description` — `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.
- **Small pull requests.** Target one roadmap issue (or one logically atomic change) per PR. A reviewer should be able to hold the whole diff in their head.
- **No direct commits to `main`.** All changes land via pull request; CI (lint, type-check, test) must pass before merge.
- **PR descriptions state the "why," not just the "what."** Link the roadmap issue or PRD requirement being addressed; a reviewer shouldn't have to reverse-engineer intent from the diff.

---

## Working Across the Monorepo

Remy Review Studio is a single repository containing `frontend/` and `backend/` (see [ADR-0001](./docs/adr/0001-monorepo.md)) precisely so that a backend API contract change and its frontend consumer can land together. When a task spans both:

- Make the change as one coherent PR, not two disconnected ones — a new endpoint and the UI that calls it belong in the same review.
- Keep each side honest to its own layering rules even when changing them together: backend changes still go through schema → repository → service → route (see [ENGINEERING.md § Backend Standards](./ENGINEERING.md#backend-standards)); frontend changes still go through the typed API client and React Query, not ad hoc `fetch` calls.
- If CI is path-scoped (frontend job vs. backend job), a cross-stack PR should still pass both — don't assume only "your half" needs to be green.

---

## Documentation Standards

Documentation is not a follow-up task — it is part of the definition of done. **Whenever a change affects architecture, product scope, or a significant technical decision, update the relevant document in the same pull request:**

| Change type | Update |
|---|---|
| System topology, service boundaries, data flow, tech stack | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Local setup, run instructions, feature list | [README.md](./README.md) |
| Scope, requirements, or product behavior | [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) |
| Sprint status, new/changed implementation issues | [docs/IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md) |
| A significant, hard-to-reverse technical decision (new dependency, architecture pattern, data-store choice) | A new file in [docs/adr/](./docs/adr/), numbered sequentially |

A PR that changes behavior without a corresponding doc update is incomplete, not "docs to follow later."

---

## Definition of Done

A feature is not "done" when it compiles. Every completed feature must include, before it is considered mergeable:

- [ ] **Implementation** matching the relevant PRD functional requirement(s) and roadmap acceptance criteria
- [ ] **Tests** (unit and/or integration per [ENGINEERING.md § Testing Standards](./ENGINEERING.md#testing-standards)) covering the new behavior, including at least one failure/edge case
- [ ] **Documentation** updated per [Documentation Standards](#documentation-standards) if the change touches architecture, scope, or a significant decision
- [ ] **Lint passes** (ESLint on frontend, ruff on backend) with no suppressed warnings introduced
- [ ] **Type checks pass** (TypeScript `strict`, Python type checking) with no new `any`/untyped escapes
- [ ] **No console warnings** in the browser console or backend logs during normal operation of the feature
- [ ] **Responsive UI** verified for any frontend change (desktop and at minimum tablet width)
- [ ] **Accessibility review** for any frontend change touching the core review workflow — keyboard navigation, ARIA labeling, and color-independent status indicators (NFR-A1–A5)

If a checkbox doesn't apply (e.g., a backend-only change has no responsive UI to check), say so explicitly rather than silently skipping it.

---

## Claude Operating Instructions

### Before writing code

1. **Read relevant documentation.** Start with this file, then the specific sections of PRODUCT_SPEC.md, ARCHITECTURE.md, and ENGINEERING.md that bear on the task. Check docs/IMPLEMENTATION_ROADMAP.md for sequencing context and docs/adr/ for any decision that constrains the approach.
2. **Understand the feature.** Identify which PRD functional requirement(s) and which roadmap sprint/issue (if any) the task maps to. If the task doesn't map to anything in the roadmap, treat that as a signal to confirm scope with the user before proceeding.
3. **Produce an implementation plan.** Lay out the files you intend to touch or create, the layer(s) involved (route/service/repository/model on the backend; component/hook on the frontend), and how the change satisfies the relevant standards in ENGINEERING.md.
4. **Wait for approval before making major architectural decisions.** Introducing a new dependency, changing a data model in a backward-incompatible way, deviating from the layering described in ENGINEERING.md, or picking between competing technical approaches all count as "major" — surface the decision and the trade-off, then wait.

**Major decision vs. routine call — worked examples:**

| Situation | Treatment |
|---|---|
| Choosing RQ vs. Celery vs. ARQ for the job queue (Sprint 3) | Major — present the trade-off, wait for a choice |
| Adding a new repository method to an existing `FindingRepository` | Routine — implement it |
| Changing the `findings.severity` enum values | Major — it's a backward-incompatible schema/API change other layers depend on |
| Extracting a duplicated date-formatting helper into `lib/utils.ts` | Routine — implement it |
| Lowering the LLM `temperature` from 0, or relaxing citation validation to "best effort" | Major — directly touches a Product Vision non-negotiable |
| Adding a loading skeleton to a new list view | Routine — implement it, it's already required by [Frontend Standards](./ENGINEERING.md#frontend-standards) |

### When implementing

- **Only modify files related to the requested feature.** Resist the urge to "fix while you're in there." If you spot an unrelated issue, mention it rather than folding it into the current diff.
- **Avoid unrelated refactoring.** A bug fix is a bug fix; it doesn't need surrounding cleanup.
- **Explain why architectural decisions are made**, especially when a decision has trade-offs (e.g., why a particular retrieval strategy, why a given chunk size, why a service boundary is drawn where it is). Future engineers — human or AI — need the reasoning, not just the result.
- **Prefer reusable abstractions over duplication** — but only after the second or third real occurrence, not speculatively.

### When requirements are unclear

**Ask clarifying questions instead of making assumptions.** This is especially important for anything touching the four Product Vision principles (AI assists, engineer decides, citations mandatory, explainability mandatory) or anything that would count as a "major architectural decision" above. A wrong guess in this codebase can mean a fabricated compliance finding reaching a licensed engineer — the cost of asking is always lower than the cost of guessing wrong here.

### Red Flags — Stop and Ask

These situations are specific enough to this product's risk profile that they warrant pausing even if they don't obviously look like a "major architectural decision":

- A prompt change, retrieval change, or output-parsing change that could plausibly reduce citation coverage below 100%.
- Any code path where a `Finding` could reach `accepted` status without an explicit user action.
- A change that would let unverified or paraphrased text be stored in a `Citation.excerpt` field.
- A change to project-scoping logic (anything touching how `project_id` gates a query) — this is the security boundary between customers' contract documents.
- A request to skip or weaken a CI check, a migration rollback path, or an auth check "just for now" — "temporary" auth/security shortcuts have a way of reaching production (see the Sprint 1 dev auth stub, which has an explicit, tracked removal date in Sprint 8 — don't add a new one without the same discipline).
- A request that would make OpenAI calls retain data for training, or send document content to a destination not already covered by NFR-S1/NFR-S4.

### Communication Style

- State which roadmap issue (if any) a change corresponds to when you report progress — it gives the user a fast way to cross-check scope.
- When you make a judgment call within "routine" territory, briefly say what you chose and why, in one sentence — don't stay silent on decisions just because they didn't rise to "major."
- When a change touches the four Product Vision principles, say so explicitly in your summary, even if the change itself is small — e.g., "this adds a citation-count check before persisting a review, enforcing 100% citation coverage (PRD G2)."
- Keep summaries proportional to the change. A one-file bug fix gets one sentence; a multi-sprint feature gets a short punch list of what shipped and what's left.

---

## Escalation Summary

If you find yourself unsure whether something needs a pause, use this ordering: **security/data-isolation risk > weakening a Product Vision non-negotiable > backward-incompatible schema or API change > new external dependency > everything else.** The first three always warrant a stop-and-ask; the fourth usually does; routine implementation work inside an established layer (see [ENGINEERING.md](./ENGINEERING.md)) does not. When genuinely torn, ask — a clarifying question costs a few seconds; an unreviewed assumption in a compliance-review product can cost a licensed engineer's judgment call.
