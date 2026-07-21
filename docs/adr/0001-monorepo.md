# ADR-0001: Use a Monorepo Architecture

## Status

Accepted — 2026-07-14

## Context

Remy Review Studio consists of two primary deployable units — a Next.js
frontend and a FastAPI backend — plus shared supporting assets such as
Docker Compose configuration, environment templates, and product
documentation (see [PRODUCT_SPEC.md](../PRODUCT_SPEC.md) and
[IMPLEMENTATION_ROADMAP.md](../IMPLEMENTATION_ROADMAP.md)).

At this stage the project is pre-launch, with a small team (currently a
single contributor) driving both frontend and backend development
concurrently. The two services are tightly coupled: API contract changes
in the FastAPI backend (e.g., new endpoints for document upload, AI
analysis, or citation retrieval) routinely require corresponding frontend
changes in the same unit of work. The system architecture
([ARCHITECTURE.md](../../ARCHITECTURE.md)) is a single linear pipeline
(Frontend → FastAPI → Document Service → AI Analysis Service →
PostgreSQL/pgvector → OpenAI), not a set of independently-owned services.

We need to decide how source code for these components should be
organized: as a single repository containing all components (monorepo),
or as separate repositories per component (polyrepo/multi-repo).

## Decision

We will use a **monorepo**: a single Git repository (`remy-review-studio`)
containing the `frontend/`, `backend/`, shared `docs/`, and deployment
configuration (`docker-compose.yml`, `.github/`, `scripts/`) as top-level
directories.

Cross-cutting changes — for example, adding a new API endpoint and its
corresponding frontend integration — will be made and reviewed as a
single, atomic commit or pull request wherever practical.

## Alternatives Considered

### Polyrepo (separate `remy-frontend` and `remy-backend` repositories)

Each service would own an independent repository, versioned and released
separately, with the API contract as the integration boundary.

### Monorepo with a build orchestration tool (e.g., Nx, Turborepo, Bazel)

Same single-repository approach, but with a dedicated monorepo tooling
layer for task graph orchestration, remote caching, and affected-package
detection from day one.

### Hybrid — shared contracts repo + separate service repos

A third repository (e.g., `remy-contracts`) would hold shared OpenAPI/type
definitions, consumed by independent frontend and backend repositories.

## Pros

- **Atomic cross-stack changes.** A single PR can update a FastAPI route
  and its Next.js consumer together, keeping the API contract and its
  usage in sync and reviewable in one diff.
- **Simplified dependency and version tracking.** One commit history, one
  set of issues/PRs, and one CI pipeline to reason about — no need to
  coordinate version pins or submodule references across repositories.
- **Lower operational overhead for a small team.** No repository-sprawl
  tax (multiple CI configs, multiple sets of branch protection rules,
  multiple places to open issues) while the team is small enough that
  code ownership boundaries add friction rather than value.
- **Easier onboarding.** A new contributor clones one repository and has
  the full system — frontend, backend, docs, and infra config — in front
  of them.
- **Shared documentation stays co-located with code.** `PRODUCT_SPEC.md`,
  `ARCHITECTURE.md`, and future ADRs live next to the code they describe,
  reducing drift between docs and implementation.

## Cons

- **Coarser-grained access control.** Anyone with write access to the
  repository can modify both frontend and backend; there is no
  repository-level boundary to restrict changes to a single component.
- **CI scope grows over time.** Without path-based filtering, changes to
  either component can trigger the full CI pipeline (frontend build +
  backend tests), increasing pipeline duration as the codebase grows.
- **No independent versioning or release cadence per component.** Tagging
  and releasing the frontend and backend separately requires
  convention (e.g., tag prefixes) rather than being enforced by
  repository structure.
- **Tooling assumptions can leak across stacks.** Editor/IDE tooling,
  linters, and language servers configured at the repository root need
  to be scoped carefully (`frontend/` vs. `backend/`) to avoid
  cross-contamination between the Node.js and Python toolchains.
- **Clone size grows unbounded.** As build artifacts, dependencies, and
  history accumulate across both stacks, repository size and clone time
  increase for all contributors, regardless of which component they work
  on.

## Consequences

- CI (`.github/`) will be configured with path filters so that frontend
  and backend jobs run independently based on which paths changed,
  mitigating the "CI scope grows" concern without adopting a dedicated
  monorepo build tool.
- Directory-level ownership conventions (e.g., `frontend/CLAUDE.md`,
  `frontend/AGENTS.md`) will continue to be used to scope tool and
  agent behavior per component within the single repository.
- Releases will be tracked via Git tags with component prefixes (e.g.,
  `frontend-v0.1.0`, `backend-v0.1.0`) if and when independent release
  cadences are needed, rather than via separate repositories.
- `docker-compose.yml` at the repository root remains the single source
  of truth for local multi-service orchestration, which is only possible
  because both services are co-located.
- This decision does not preclude splitting into separate repositories
  later; see Future Considerations.

## Future Considerations

- **Team growth.** If the engineering team grows to the point where
  frontend and backend are owned by distinct teams with independent
  release cadences and access-control requirements, re-evaluate in favor
  of a polyrepo or a hybrid contracts-repo model.
- **Build tooling.** If CI duration or local build times become a
  bottleneck as the codebase grows, evaluate adopting a monorepo build
  orchestrator (Nx, Turborepo, or similar) for affected-package detection
  and remote caching rather than splitting repositories.
- **Independent deployability.** If the frontend and backend need to be
  deployed on materially different cadences (e.g., backend hot-fixes
  multiple times a day while frontend ships weekly), introduce separate
  CI/CD pipelines scoped by path within the monorepo before considering
  a repository split.
- **Extraction of shared code.** If additional services are introduced
  (e.g., a standalone AI Analysis Service, per
  [ARCHITECTURE.md](../../ARCHITECTURE.md)) and shared types or client
  libraries emerge, consider a `packages/` or `libs/` directory within
  this monorepo before extracting a separate contracts repository.
- This ADR should be revisited if any of the above triggers occur, with a
  follow-up ADR documenting the outcome.
