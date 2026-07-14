# Remy Review Studio — Product Specification

**Document Owner:** Product & Engineering  
**Status:** Draft  
**Last Updated:** July 14, 2026  
**Version:** 1.0

---

## 1. Product Vision

Remy Review Studio is an AI-powered construction submittal review platform that helps project engineers review specifications, drawings, and vendor submittals in a fraction of the time required by manual workflows.

The product turns unstructured project documents into structured, citation-backed compliance findings so engineers can focus on judgment and decision-making rather than document hunting and cross-referencing.

Our long-term vision is to become the system of record for submittal review: a trusted workspace where teams upload project documents, run AI-assisted reviews, trace every finding to its source, and produce defensible review reports for owners, contractors, and design teams.

---

## 2. Problem Statement

Construction submittal review is a high-stakes, labor-intensive process. Project engineers must compare vendor-provided product data, shop drawings, and cut sheets against contract documents, specifications, and design intent. In practice, this work is:

- **Time-consuming:** Reviews often require hours of searching across hundreds of pages of PDFs.
- **Error-prone:** Manual cross-referencing increases the risk of missed non-compliance.
- **Difficult to audit:** Findings are frequently captured in email threads or ad hoc notes without clear citations.
- **Inconsistent:** Review quality varies by engineer experience, workload, and project complexity.

Existing document management tools store files but do not understand their content. Generic AI chat tools can summarize text but lack project context, structured review workflows, and traceable citations required for professional engineering use.

Remy Review Studio addresses this gap by combining document ingestion, semantic search, and AI analysis into a purpose-built review workflow for construction teams.

---

## 3. Target Users

| Segment | Description |
|---|---|
| **Primary** | Project engineers and design engineers responsible for reviewing submittals |
| **Secondary** | Project managers overseeing review timelines and deliverable quality |
| **Tertiary** | Contractors and vendors submitting documentation for approval |
| **Internal stakeholders** | QA/QC leads, BIM coordinators, and specification writers |

Initial go-to-market focus is on **engineering firms and owner-side project teams** managing active construction projects with recurring submittal review workloads.

---

## 4. User Personas

### Persona 1: Alex Chen — Project Engineer

- **Role:** Project Engineer at a mid-size A/E firm
- **Experience:** 5 years in commercial construction
- **Goals:** Review submittals quickly, reduce rework, maintain defensible documentation
- **Pain Points:** Spends 4–6 hours per week searching specs; struggles to remember prior project decisions
- **Tools Today:** Bluebeam, email, Excel trackers, SharePoint
- **Success Criteria:** Can complete a standard submittal review in under 30 minutes with confidence in findings

### Persona 2: Maria Santos — Senior Project Manager

- **Role:** PM responsible for schedule and coordination across multiple trades
- **Experience:** 12 years managing healthcare and institutional projects
- **Goals:** Keep submittal log current, avoid schedule delays caused by review bottlenecks
- **Pain Points:** Limited visibility into review status; inconsistent review quality across team members
- **Tools Today:** Procore, Primavera, shared spreadsheets
- **Success Criteria:** Real-time visibility into review progress and exportable reports for owner meetings

### Persona 3: Jordan Lee — QA/QC Lead

- **Role:** Quality lead ensuring review consistency across offices
- **Experience:** 15 years; sets review standards and trains junior staff
- **Goals:** Standardize review methodology; reduce risk of missed compliance items
- **Pain Points:** Hard to audit how a finding was determined; junior engineers need more oversight
- **Tools Today:** Internal checklists, PDF markups, manual spot checks
- **Success Criteria:** Every finding links to a source citation; review history is searchable and auditable

---

## 5. Goals

### Product Goals

1. **Reduce review time** by at least 50% for standard submittal packages compared to manual review.
2. **Increase finding accuracy** through citation-backed AI analysis tied to project source documents.
3. **Improve auditability** by maintaining a searchable record of reviews, findings, and supporting evidence.
4. **Accelerate onboarding** so junior engineers can perform high-quality reviews with AI assistance.
5. **Enable knowledge reuse** across projects via semantic search over historical submittals and decisions.

### Business Goals

1. Validate product-market fit with 3–5 pilot engineering teams within 90 days of MVP launch.
2. Establish Remy Review Studio as a credible alternative to manual review workflows before expanding into enterprise integrations.
3. Build a foundation for future monetization via per-project or per-seat pricing.

---

## 6. Non Goals

The following are explicitly **out of scope** for the initial release:

1. **Replacing formal approval authority** — The product assists review; final approval remains with licensed professionals.
2. **Full construction management** — We are not building a Procore/Autodesk competitor (RFIs, scheduling, cost control).
3. **Automated submittal routing to owners/authorities** — Workflow orchestration beyond basic status tracking is deferred.
4. **CAD/BIM model analysis** — MVP focuses on document-based review (PDFs, specs); 3D model comparison is future work.
5. **On-premise deployment** — MVP is cloud-hosted; self-hosted enterprise deployment is not a launch requirement.
6. **Multi-language support** — English-language documents only at launch.
7. **Legal/compliance certification** — The product does not claim regulatory certification; it is a productivity and analysis tool.

---

## 7. Core User Journey

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Create     │───▶│  Upload      │───▶│  Run AI     │───▶│  Review      │───▶│  Export     │
│  Project    │    │  Documents   │    │  Analysis   │    │  Findings    │    │  Report     │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
```

### Step-by-step

1. **Create Project**  
   Engineer creates a project workspace and defines basic metadata (name, number, discipline, review type).

2. **Upload Documents**  
   User uploads contract documents: specifications, drawings, and the vendor submittal package (PDF).

3. **Document Processing**  
   System extracts text, chunks content, generates embeddings, and indexes documents for search and analysis.

4. **Run AI Review**  
   User initiates an AI-assisted compliance review. The system compares submittal content against relevant specification sections and prior project context.

5. **Review Findings**  
   Engineer reviews AI-generated findings. Each finding includes severity, description, recommendation, and source citations (spec section, page number, excerpt).

6. **Search Knowledge Base**  
   User queries prior submittals, spec language, and historical decisions using natural language search.

7. **Generate Report**  
   User exports a structured review report (PDF/Markdown) suitable for submittal log updates and stakeholder communication.

8. **Track Status**  
   Project dashboard shows review status, open findings, and completion metrics.

---

## 8. MVP Features

| Feature | Description | Priority |
|---|---|---|
| **Project workspace** | Create and manage projects with metadata | P0 |
| **Document upload** | Upload PDFs (specs, drawings, submittals); store in project | P0 |
| **Document ingestion** | Extract text, chunk, embed, and index uploaded files | P0 |
| **AI compliance review** | Analyze submittal against specs; generate structured findings | P0 |
| **Citation-backed findings** | Each finding links to source document, section, and excerpt | P0 |
| **Findings review UI** | Accept, reject, or edit findings; add engineer notes | P0 |
| **Knowledge search** | Semantic search across project documents | P1 |
| **Review report export** | Generate downloadable report of findings and citations | P1 |
| **Basic auth** | Email/password or OAuth login; project-level access control | P1 |
| **Review dashboard** | Summary view of projects, review status, and finding counts | P2 |

### MVP Definition of Done

A pilot user can upload a submittal package, run an AI review, inspect citation-backed findings, and export a report — all within a single project workspace — without engineering support.

---

## 9. Future Features

| Feature | Rationale | Target Phase |
|---|---|---|
| **Submittal log integration** | Sync with Procore, Autodesk Build, or CSV import/export | Phase 2 |
| **Multi-user collaboration** | Comments, assignments, review handoffs | Phase 2 |
| **Custom review checklists** | Discipline-specific templates (mechanical, electrical, structural) | Phase 2 |
| **Batch review** | Process multiple submittals in a single run | Phase 2 |
| **Drawing markup sync** | Link findings to drawing sheet references | Phase 3 |
| **Fine-tuned domain models** | Improve accuracy on CSI specs and construction terminology | Phase 3 |
| **Enterprise SSO & RBAC** | SAML/OIDC, org-level admin, audit logs | Phase 3 |
| **API access** | Programmatic upload, review, and report retrieval | Phase 3 |
| **Mobile review** | Read-only findings review on tablet/mobile | Phase 4 |
| **Analytics & insights** | Team productivity metrics, common non-compliance patterns | Phase 4 |

---

## 10. Success Metrics

### North Star Metric

**Time to completed review (TCR):** Median time from submittal upload to engineer-approved review report.

**Target:** Reduce TCR by 50% vs. baseline manual workflow within 60 days of pilot launch.

### Primary Metrics

| Metric | Definition | MVP Target |
|---|---|---|
| **Review completion rate** | % of uploaded submittals that reach "review complete" status | ≥ 70% |
| **Finding acceptance rate** | % of AI findings accepted or edited (not rejected) by engineers | ≥ 60% |
| **Citation click-through rate** | % of findings where engineer views source citation | ≥ 80% |
| **Weekly active reviewers** | Unique users completing at least one review per week | ≥ 3 per pilot org |
| **Report export rate** | % of completed reviews that generate an exported report | ≥ 50% |

### Secondary Metrics

| Metric | Definition |
|---|---|
| **Document processing success rate** | % of uploads successfully indexed |
| **Search query success rate** | % of knowledge searches returning user-clicked results |
| **P95 review latency** | Time from "Run Review" to findings displayed |
| **Pilot retention** | % of pilot teams active after 30 days |

### Qualitative Signals

- Engineers report increased confidence in review outcomes
- Findings are cited in official submittal responses
- Users voluntarily upload additional document types beyond MVP scope

---

## 11. Functional Requirements

### FR-1: Project Management

| ID | Requirement |
|---|---|
| FR-1.1 | Users shall be able to create a project with name, description, and optional project number |
| FR-1.2 | Users shall be able to list, view, and archive projects |
| FR-1.3 | Each project shall isolate its documents, findings, and search index |

### FR-2: Document Upload & Storage

| ID | Requirement |
|---|---|
| FR-2.1 | Users shall upload PDF files up to 50 MB per file |
| FR-2.2 | System shall accept document types: specification, drawing, submittal, other |
| FR-2.3 | System shall display upload progress and confirm successful ingestion |
| FR-2.4 | System shall reject unsupported file types with a clear error message |
| FR-2.5 | Uploaded documents shall be stored durably and associated with the project |

### FR-3: Document Ingestion & Indexing

| ID | Requirement |
|---|---|
| FR-3.1 | System shall extract text from uploaded PDFs |
| FR-3.2 | System shall chunk extracted text into semantically meaningful segments |
| FR-3.3 | System shall generate vector embeddings for each chunk |
| FR-3.4 | System shall store embeddings in pgvector for similarity search |
| FR-3.5 | System shall track ingestion status: pending, processing, ready, failed |

### FR-4: AI Compliance Review

| ID | Requirement |
|---|---|
| FR-4.1 | Users shall initiate a review against a selected submittal and project document set |
| FR-4.2 | System shall retrieve relevant specification sections via semantic search |
| FR-4.3 | System shall generate findings with: title, description, severity, status, recommendation |
| FR-4.4 | Each finding shall include at least one citation (document, page/section, excerpt) |
| FR-4.5 | Review runs shall be asynchronous with status polling or notification |
| FR-4.6 | System shall log the model version and prompt template used for each review |

### FR-5: Findings Management

| ID | Requirement |
|---|---|
| FR-5.1 | Users shall view a list of findings filtered by severity and status |
| FR-5.2 | Users shall accept, reject, or edit finding details |
| FR-5.3 | Users shall add engineer notes to any finding |
| FR-5.4 | System shall preserve original AI output alongside user modifications |
| FR-5.5 | Users shall click a citation to view the source excerpt in context |

### FR-6: Knowledge Search

| ID | Requirement |
|---|---|
| FR-6.1 | Users shall search project documents using natural language queries |
| FR-6.2 | Search results shall rank by semantic relevance |
| FR-6.3 | Results shall display source document, location, and excerpt snippet |
| FR-6.4 | Search shall scope to the current project by default |

### FR-7: Report Generation

| ID | Requirement |
|---|---|
| FR-7.1 | Users shall export a review report for a completed or in-progress review |
| FR-7.2 | Report shall include project metadata, finding summary, and detailed findings with citations |
| FR-7.3 | Report shall be downloadable as PDF or Markdown |
| FR-7.4 | Report shall indicate which findings were AI-generated vs. engineer-modified |

### FR-8: Authentication & Authorization

| ID | Requirement |
|---|---|
| FR-8.1 | Users shall authenticate before accessing any project data |
| FR-8.2 | Users shall only access projects they own or are granted access to |
| FR-8.3 | System shall support session management with secure token storage |

---

## 12. Non Functional Requirements

### Performance

| ID | Requirement |
|---|---|
| NFR-1.1 | Document upload shall complete within 30 seconds for files ≤ 25 MB on standard broadband |
| NFR-1.2 | P95 ingestion time shall be ≤ 2 minutes for a 100-page PDF |
| NFR-1.3 | P95 review completion time shall be ≤ 5 minutes for a standard submittal package |
| NFR-1.4 | Search queries shall return results within 2 seconds (P95) |
| NFR-1.5 | UI shall remain responsive during background processing (async jobs) |

### Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-2.1 | System shall target 99.5% uptime during business hours |
| NFR-2.2 | Failed ingestion or review jobs shall be retryable without re-upload |
| NFR-2.3 | No data loss on single-component failure (durable storage, transactional writes) |

### Security

| ID | Requirement |
|---|---|
| NFR-3.1 | All data in transit shall use TLS 1.2+ |
| NFR-3.2 | Secrets (API keys, DB credentials) shall not be stored in source control |
| NFR-3.3 | Project documents shall be access-controlled at the application layer |
| NFR-3.4 | OpenAI API calls shall not retain customer data beyond provider policy allowances |
| NFR-3.5 | Authentication tokens shall expire and be refreshable |

### Scalability

| ID | Requirement |
|---|---|
| NFR-4.1 | Architecture shall support horizontal scaling of API and worker services |
| NFR-4.2 | MVP shall support 10 concurrent pilot users without degradation |
| NFR-4.3 | Vector index shall scale to 100K chunks per project without query timeout |

### Observability

| ID | Requirement |
|---|---|
| NFR-5.1 | All API endpoints shall emit structured logs with request ID |
| NFR-5.2 | Review and ingestion jobs shall emit status events for monitoring |
| NFR-5.3 | Error rates and latency shall be trackable per service |

### Usability

| ID | Requirement |
|---|---|
| NFR-6.1 | Core review workflow shall be completable in ≤ 5 clicks after upload |
| NFR-6.2 | UI shall follow responsive design principles (desktop-first; tablet-readable) |
| NFR-6.3 | Error messages shall be actionable (what failed, what to do next) |

---

## 13. Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **AI hallucination / incorrect findings** | High — engineers lose trust; potential compliance miss | Medium | Require citations for every finding; surface confidence scores; preserve human-in-the-loop approval |
| **Poor PDF extraction quality** | High — garbage in, garbage out for scanned or complex drawings | Medium | Support OCR fallback; validate extraction quality; flag low-confidence pages |
| **OpenAI API cost overruns** | Medium — unsustainable unit economics at scale | Medium | Cache embeddings; batch requests; monitor cost per review; evaluate smaller models for retrieval |
| **Slow review latency** | Medium — users abandon async workflow | Medium | Optimize chunk retrieval; stream partial results; set clear progress indicators |
| **Data privacy concerns** | High — firms reluctant to upload contract documents | Medium | Clear data handling policy; encryption at rest; no training on customer data; future SOC 2 path |
| **Scope creep toward full PM platform** | Medium — delays MVP | High | Enforce non-goals; phase-gate feature requests against success metrics |
| **Specification format variability** | Medium — CSI MasterFormat vs. custom spec structures reduce accuracy | High | Start with structured spec PDFs; build discipline-specific prompt templates iteratively |
| **Pilot adoption friction** | Medium — teams revert to manual process | Medium | White-glove onboarding; measure TCR in pilots; iterate on UX based on engineer feedback |

---

## 14. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 15 (App Router, TypeScript, Tailwind) | Modern React framework; SSR/SSG; strong DX for rapid UI iteration |
| **Backend API** | FastAPI (Python) | High-performance async API; strong ecosystem for AI/ML integrations |
| **Database** | PostgreSQL | Relational data model for projects, users, findings; mature and reliable |
| **Vector Store** | pgvector | Native vector similarity search within PostgreSQL; simplifies ops |
| **Cache / Queue** | Redis | Job queue for async ingestion/review; session and rate-limit caching |
| **AI / LLM** | OpenAI (GPT-4 class models) | Best-in-class reasoning for document analysis; embeddings API for search |
| **Document Processing** | Python PDF libraries + OCR (TBD) | Text extraction pipeline for uploaded PDFs |
| **Infrastructure** | Docker, docker-compose | Local dev parity; containerized deployment |
| **CI/CD** | GitHub Actions | Automated test and deploy pipelines (`.github/workflows/`) |

### Architecture Reference

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the high-level system diagram.

---

## 15. Assumptions

1. **Users have digital PDFs.** MVP assumes submittals and specifications are available as PDF; scanned documents may require OCR with reduced accuracy.
2. **English-language documents.** NLP models and prompt templates are optimized for English construction specifications.
3. **Engineers retain approval authority.** The product is an assistant, not an autonomous approver. All findings require human review before formal submittal response.
4. **Pilot users tolerate MVP limitations.** Early adopters accept missing integrations, limited collaboration features, and occasional AI inaccuracy in exchange for speed gains.
5. **OpenAI API remains available and cost-effective.** Core analysis depends on third-party LLM availability; fallback models may be evaluated post-MVP.
6. **Single-tenant project isolation is sufficient.** MVP does not require multi-org enterprise tenancy; one user account maps to one workspace.
7. **Desktop is the primary review surface.** Engineers perform detailed review on desktop/laptop; mobile is not required for MVP.
8. **Standard submittal packages are ≤ 200 pages.** Ingestion and review pipelines are sized for typical packages; larger documents may require chunked processing or user warning.
9. **Internet connectivity is required.** Cloud-hosted architecture; offline mode is not in scope.
10. **Regulatory context is US commercial construction.** CSI MasterFormat conventions and US project delivery methods inform prompt design and UX copy.

---

## Appendix: Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Which OCR provider for scanned PDFs? | Engineering | Open |
| 2 | Per-project vs. per-seat pricing model? | Product | Open |
| 3 | Minimum viable auth: email/password vs. Google OAuth? | Product | Open |
| 4 | Report format preferences from pilot users (PDF vs. Word)? | Product | Open |
| 5 | Data retention policy for uploaded documents? | Legal/Product | Open |

---

*This document is intended for internal use by Product, Engineering, and Design. It will be updated as pilot feedback and technical discovery inform scope changes.*
