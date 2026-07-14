# Remy Review Studio — Product Requirements Document (PRD)

| Field | Value |
|---|---|
| **Product** | Remy Review Studio |
| **Document Type** | Product Requirements Document |
| **Status** | Draft |
| **Version** | 1.0 |
| **Last Updated** | July 14, 2026 |
| **Owner** | Product & Engineering |

---

## Background

Remy Review Studio is inspired by Remy, an AI-powered construction document review platform.

The platform helps construction project engineers review:

- **Project Specifications**
- **Construction Drawings**
- **Vendor Submittals**

Instead of manually searching through hundreds of PDF pages, engineers upload project documents and receive AI-assisted compliance findings with citations.

The application **augments engineers rather than replacing them**. Every AI recommendation must be explainable and traceable back to source documents.

---

## Audience

This document is written for:

- Product Managers
- Software Engineers
- AI Engineers
- UX Designers

---

## 1. Product Vision

Remy Review Studio will become the trusted AI workspace where construction teams upload project documents, run structured compliance reviews, and produce defensible findings backed by source citations.

We believe project engineers should spend their time on judgment and decision-making — not hunting through PDFs. By combining document intelligence, semantic search, and citation-first AI analysis, Remy Review Studio reduces review time while improving consistency, auditability, and confidence in submittal outcomes.

**Vision statement:** *Every submittal review should be faster, clearer, and fully traceable to its source.*

---

## 2. Problem Statement

Construction submittal review is a critical path activity on every commercial project. Before a product, material, or shop drawing can be approved for installation, project engineers must verify that vendor submissions comply with contract documents and design intent.

### Pain Points

| Pain Point | Description |
|---|---|
| **Document volume** | A single submittal package may span 50–300+ pages across specs, drawings, and product data sheets |
| **Manual cross-referencing** | Engineers must locate relevant spec sections (e.g., Division 23 for HVAC) and compare language line-by-line against vendor claims |
| **Time pressure** | Review delays block procurement, fabrication, and field installation — directly impacting schedule |
| **Inconsistent quality** | Review thoroughness varies by engineer experience, workload, and familiarity with the spec |
| **Poor audit trail** | Findings often live in email, markup PDFs, or spreadsheets with no structured link to source evidence |
| **Knowledge loss** | Prior project decisions and approved substitutions are rarely searchable across engagements |
| **False confidence from generic AI** | Off-the-shelf chat tools summarize text but cannot produce traceable, project-scoped compliance findings |

### Impact

- Engineers spend **4–8 hours per week** on repetitive document search and comparison
- Missed non-compliance items create **rework, RFIs, and field conflicts**
- Junior engineers require **heavy senior oversight** due to lack of structured review guidance
- Project managers lack **visibility into review bottlenecks** until schedules slip

Remy Review Studio addresses these problems with a purpose-built review workflow: upload documents, run AI analysis, inspect citation-backed findings, and export professional reports — all within a single project workspace.

---

## 3. Target Users

### Project Engineers

Primary users who perform submittal reviews. Responsible for comparing vendor submissions against specifications and drawings, documenting findings, and issuing review responses (approved, approved as noted, revise and resubmit, rejected).

### Construction Managers

Oversee project delivery, submittal log status, and coordination between design team, contractor, and owner. Need visibility into review progress and exportable summaries for meetings.

### QA/QC Engineers

Ensure review consistency across teams and offices. Define review standards, audit finding quality, and train junior staff. Require traceable citations and review history.

### General Contractors

Submit vendor submittals and receive review responses. While not the primary user in MVP, their submittal packages are the core input to the review workflow. Future phases may include submission portals and status tracking.

---

## 4. User Personas

### Persona A: Alex Chen — Project Engineer

| Attribute | Detail |
|---|---|
| **Role** | Project Engineer, mid-size A/E firm |
| **Experience** | 5 years, commercial and healthcare projects |
| **Discipline** | Mechanical (HVAC, plumbing) |

**Goals**
- Complete submittal reviews in under 30 minutes for standard packages
- Produce defensible findings with clear spec references
- Reduce back-and-forth with contractors on ambiguous items
- Build confidence in review decisions without constant senior escalation

**Frustrations**
- Spends hours searching CSI spec sections across 800+ page spec binders
- Difficulty remembering how similar products were handled on prior projects
- Markup tools don't understand spec language — search is literal, not semantic
- Generic AI tools hallucinate compliance claims without verifiable sources

**Typical Workflow**
1. Receive submittal notification from contractor via Procore or email
2. Download PDF package (product data, shop drawings, certifications)
3. Open spec PDF and search for relevant sections (e.g., Section 23 05 00)
4. Compare vendor claims against spec requirements manually
5. Mark up PDF or write review comments in submittal log
6. Return response: Approved / Approved as Noted / Revise & Resubmit / Rejected

---

### Persona B: Maria Santos — Construction Manager

| Attribute | Detail |
|---|---|
| **Role** | Senior Project Manager, general contractor |
| **Experience** | 12 years, institutional and healthcare |
| **Focus** | Schedule, coordination, submittal log management |

**Goals**
- Keep submittal log current with no review bottlenecks
- Provide owners with timely status updates
- Identify recurring compliance issues across trades
- Minimize schedule impact from delayed approvals

**Frustrations**
- No visibility into where a submittal sits in the review pipeline
- Engineers provide inconsistent turnaround times without explanation
- Hard to aggregate findings across multiple trades for owner reports
- Submittal log data lives in Procore; review detail lives in email

**Typical Workflow**
1. Track submittal log in Procore with due dates and responsible parties
2. Chase engineers for overdue reviews
3. Compile status summaries for weekly owner meetings
4. Coordinate resubmittals when reviews come back as "Revise & Resubmit"
5. Close out approved submittals and release for procurement/fabrication

---

### Persona C: Jordan Lee — QA/QC Engineer

| Attribute | Detail |
|---|---|
| **Role** | QA/QC Lead, regional engineering firm |
| **Experience** | 15 years; sets firm-wide review standards |
| **Focus** | Consistency, risk reduction, training |

**Goals**
- Standardize review methodology across offices and disciplines
- Audit review quality without manually re-reading every submittal
- Ensure every finding is backed by a verifiable source citation
- Accelerate junior engineer development with structured AI assistance

**Frustrations**
- Cannot easily audit *how* a junior engineer reached a finding
- Review quality varies significantly across team members
- No centralized searchable history of past review decisions
- Concerned that AI tools will erode professional accountability

**Typical Workflow**
1. Define discipline-specific review checklists and standards
2. Spot-check completed reviews on high-risk submittals
3. Train new engineers on spec navigation and review conventions
4. Investigate field issues traced back to missed submittal non-compliance
5. Report review metrics to firm leadership quarterly

---

### Persona D: Sam Ortiz — General Contractor Project Engineer

| Attribute | Detail |
|---|---|
| **Role** | Project Engineer (GC side), large commercial contractor |
| **Experience** | 7 years, design-build and hard bid |
| **Focus** | Submittal preparation and coordination |

**Goals**
- Submit complete, compliant packages to avoid rejection cycles
- Understand exactly what the design team flagged and why
- Reduce resubmittal count to protect schedule
- Learn spec requirements proactively before submission

**Frustrations**
- Vague review comments like "does not comply with spec" without section references
- Multiple review cycles due to incomplete initial packages
- No visibility into what the engineer is comparing against
- Difficulty coordinating submittals across 15+ trades on large projects

**Typical Workflow**
1. Collect vendor product data and shop drawings from subcontractors
2. Compile submittal package per spec Section 01 33 00 requirements
3. Submit via Procore or email to design team
4. Receive review response and distribute comments to affected trades
5. Coordinate resubmittal with updated documentation

---

## 5. Product Goals

| # | Goal | Measure |
|---|---|---|
| G1 | Reduce median time-to-review by 50% vs. manual baseline | Time from upload to approved report |
| G2 | Deliver citation-backed findings on 100% of AI-generated items | Findings with ≥ 1 source citation |
| G3 | Achieve ≥ 60% AI finding acceptance rate by pilot users | Accepted or edited / total generated |
| G4 | Enable semantic search across all uploaded project documents | Search returns relevant results in < 2s P95 |
| G5 | Produce exportable review reports suitable for submittal log updates | Report export rate ≥ 50% of completed reviews |
| G6 | Maintain human-in-the-loop approval on every finding | Zero auto-approved findings in MVP |
| G7 | Onboard pilot teams within 1 business day | Time from account creation to first review |

---

## 6. Non Goals

The following are **intentionally excluded from MVP**:

| Non Goal | Rationale |
|---|---|
| **Autonomous submittal approval** | Engineers retain final authority; AI assists only |
| **Full construction management platform** | Not competing with Procore, Autodesk Build, or Primavera |
| **CAD/BIM model analysis** | MVP is document-based (PDF); 3D model intelligence is future work |
| **Contractor submission portal** | GC users consume review outputs; direct submission workflow is Phase 2 |
| **Multi-language document support** | English-only at launch |
| **On-premise / air-gapped deployment** | Cloud-hosted MVP; enterprise self-host deferred |
| **Legal/regulatory certification** | Product is a productivity tool, not a certified compliance system |
| **Real-time collaborative markup** | Multi-user simultaneous editing deferred to Phase 2 |
| **Automated RFI creation** | Finding-to-RFI workflow is future scope |
| **Mobile-native app** | Desktop-first; responsive web only |

---

## 7. Core User Journey

```
Create Project
      ↓
Upload Documents
      ↓
AI Processing
      ↓
Compliance Review
      ↓
Engineer Feedback
      ↓
Export Report
```

### Journey Detail

#### 1. Create Project
Engineer creates a project workspace with name, number, discipline, and description. The project becomes the isolation boundary for all documents, findings, and search indexes.

#### 2. Upload Documents
User uploads PDF files categorized as **Specification**, **Drawing**, or **Submittal**. System validates file type and size, displays upload progress, and queues documents for processing.

#### 3. AI Processing
Backend extracts text, chunks content, generates vector embeddings, and indexes documents in PostgreSQL + pgvector. User sees processing status per document (pending → processing → ready → failed).

#### 4. Compliance Review
User selects a submittal and initiates AI review. The system retrieves relevant spec sections via semantic search, sends context to the LLM, and generates structured findings with severity, description, recommendation, and citations.

#### 5. Engineer Feedback
Engineer reviews each finding: accept, reject, or edit. They add notes, adjust severity, and click citations to verify source excerpts. Original AI output is preserved alongside modifications for audit purposes.

#### 6. Export Report
User generates a downloadable report (PDF/Markdown) containing project metadata, finding summary, detailed findings with citations, and engineer disposition (accepted/rejected/edited).

---

## 8. MVP Features

### 8.1 Project Management

- Create, list, view, and archive projects
- Project metadata: name, number, discipline, description, created date
- Project dashboard with document count, review status, and open finding count

### 8.2 Document Upload

- Upload PDF files (max 50 MB per file)
- Categorize as: Specification, Drawing, Submittal, Other
- Display upload progress and ingestion status
- Reject unsupported file types with clear error messaging

### 8.3 AI Compliance Review

- Initiate review against a selected submittal within a project
- Asynchronous review job with status tracking
- Generate findings with: title, description, severity (critical/major/minor/info), recommendation
- Log model version and prompt template per review run

### 8.4 Citation Viewer

- Every finding includes ≥ 1 citation: source document, page/section, excerpt
- Click citation to view source excerpt in context
- Highlight referenced text within the source document viewer

### 8.5 Knowledge Search

- Natural language search across all documents in a project
- Semantic ranking via pgvector similarity
- Results show document name, location, relevance score, and excerpt snippet

### 8.6 Engineer Review

- Findings list with filters by severity, status, and document
- Actions: Accept, Reject, Edit (title, description, severity, recommendation)
- Add engineer notes to any finding
- Preserve AI original vs. engineer-modified state

### 8.7 Report Export

- Export review report as PDF or Markdown
- Include: project info, finding summary table, detailed findings with citations, engineer dispositions
- Indicate AI-generated vs. engineer-modified findings

---

## 9. Future Features

| Feature | Description | Phase |
|---|---|---|
| **Revision Comparison** | Diff submittal revisions side-by-side; highlight changes since last review | Phase 2 |
| **Email Generation** | Auto-draft review response emails with finding summaries for contractor distribution | Phase 2 |
| **Knowledge Base** | Cross-project searchable library of past reviews, approved substitutions, and spec interpretations | Phase 2 |
| **Analytics** | Dashboards: review throughput, common non-compliance patterns, team productivity | Phase 3 |
| **Multi-project Search** | Search across all projects in an organization for spec language and prior decisions | Phase 3 |
| **Drawing Intelligence** | Extract and analyze drawing sheet data, title blocks, and detail references | Phase 3 |
| **Submittal Log Integration** | Sync with Procore, Autodesk Build via API or CSV | Phase 2 |
| **Custom Review Templates** | Discipline-specific checklists (mechanical, electrical, structural) | Phase 2 |
| **Batch Review** | Process multiple submittals in a single run | Phase 2 |
| **Enterprise SSO & RBAC** | SAML/OIDC, org admin, role-based access | Phase 3 |
| **API Access** | Programmatic upload, review, and report retrieval | Phase 3 |

---

## 10. Functional Requirements

### FR-1: Authentication & Authorization

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | Users shall authenticate via email/password or OAuth before accessing any data | P1 |
| FR-1.2 | Users shall only access projects they own or are explicitly granted access to | P0 |
| FR-1.3 | Sessions shall expire after configurable inactivity period | P1 |
| FR-1.4 | Password reset flow shall be supported | P2 |

### FR-2: Project Management

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Users shall create a project with name (required), number, discipline, and description | P0 |
| FR-2.2 | Users shall list all projects with sort by created date and name | P0 |
| FR-2.3 | Users shall view project detail including documents, reviews, and findings | P0 |
| FR-2.4 | Users shall archive a project (soft delete; data retained) | P1 |
| FR-2.5 | Each project shall isolate documents, embeddings, findings, and search scope | P0 |

### FR-3: Document Upload & Storage

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | Users shall upload PDF files up to 50 MB | P0 |
| FR-3.2 | Users shall assign document type: Specification, Drawing, Submittal, Other | P0 |
| FR-3.3 | System shall display upload progress percentage | P0 |
| FR-3.4 | System shall reject non-PDF files with error: "Only PDF files are supported" | P0 |
| FR-3.5 | System shall store documents durably with project association | P0 |
| FR-3.6 | Users shall view a list of uploaded documents with type, size, status, and upload date | P0 |
| FR-3.7 | Users shall delete an uploaded document (and associated chunks/embeddings) | P1 |

### FR-4: Document Ingestion Pipeline

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | System shall extract text from uploaded PDFs upon upload | P0 |
| FR-4.2 | System shall chunk extracted text into segments of 500–1000 tokens with overlap | P0 |
| FR-4.3 | System shall generate vector embeddings for each chunk via OpenAI Embeddings API | P0 |
| FR-4.4 | System shall store embeddings in pgvector with document and chunk metadata | P0 |
| FR-4.5 | System shall track ingestion status: pending, processing, ready, failed | P0 |
| FR-4.6 | Failed ingestion shall be retryable without re-upload | P1 |
| FR-4.7 | System shall flag pages with low extraction confidence (scanned/image PDFs) | P2 |

### FR-5: AI Compliance Review

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Users shall initiate a compliance review by selecting a submittal document | P0 |
| FR-5.2 | System shall retrieve top-K relevant spec/drawing chunks via semantic search | P0 |
| FR-5.3 | System shall send retrieved context + submittal content to LLM for analysis | P0 |
| FR-5.4 | System shall generate findings with: id, title, description, severity, recommendation, status | P0 |
| FR-5.5 | Each finding shall include ≥ 1 citation object: document_id, page, section, excerpt | P0 |
| FR-5.6 | Review shall execute asynchronously; UI shall poll or subscribe to status updates | P0 |
| FR-5.7 | System shall log model version, prompt template version, and timestamp per review | P1 |
| FR-5.8 | Users shall view review history for a project | P1 |

### FR-6: Citation Viewer

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | Users shall click a citation link on any finding to open the source viewer | P0 |
| FR-6.2 | Source viewer shall display the cited document page with excerpt highlighted | P0 |
| FR-6.3 | Citation shall show: document name, page number, section reference, excerpt text | P0 |
| FR-6.4 | If source page is unavailable, system shall display excerpt text with warning | P1 |

### FR-7: Engineer Review & Feedback

| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | Users shall view findings list with filters: severity, status (pending/accepted/rejected/edited) | P0 |
| FR-7.2 | Users shall accept a finding (status → accepted) | P0 |
| FR-7.3 | Users shall reject a finding (status → rejected) | P0 |
| FR-7.4 | Users shall edit finding fields: title, description, severity, recommendation | P0 |
| FR-7.5 | Users shall add free-text engineer notes to any finding | P0 |
| FR-7.6 | System shall preserve original AI-generated content alongside user modifications | P0 |
| FR-7.7 | Edited findings shall be marked status → edited with diff visibility | P1 |

### FR-8: Knowledge Search

| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | Users shall enter natural language queries scoped to the current project | P1 |
| FR-8.2 | System shall return ranked results with document name, location, excerpt, relevance score | P1 |
| FR-8.3 | Users shall click a search result to navigate to the source document viewer | P1 |
| FR-8.4 | Empty results shall display helpful message with search tips | P2 |

### FR-9: Report Export

| ID | Requirement | Priority |
|---|---|---|
| FR-9.1 | Users shall export a review report for a completed or in-progress review | P1 |
| FR-9.2 | Report shall include: project metadata, review date, finding count by severity | P1 |
| FR-9.3 | Report shall list each finding with description, severity, recommendation, citations, disposition | P1 |
| FR-9.4 | Report shall indicate AI-generated vs. engineer-modified findings | P1 |
| FR-9.5 | Report shall be downloadable as PDF and Markdown | P1 |

---

## 11. Non Functional Requirements

### Performance

| ID | Requirement |
|---|---|
| NFR-P1 | Document upload completes within 30s for files ≤ 25 MB on standard broadband |
| NFR-P2 | P95 ingestion time ≤ 2 minutes for a 100-page PDF |
| NFR-P3 | P95 review completion time ≤ 5 minutes for a standard submittal package (≤ 50 pages) |
| NFR-P4 | Search queries return results within 2 seconds (P95) |
| NFR-P5 | UI remains responsive during background processing (non-blocking async jobs) |
| NFR-P6 | API endpoints respond within 500ms (P95) excluding upload and review endpoints |

### Security

| ID | Requirement |
|---|---|
| NFR-S1 | All data in transit encrypted via TLS 1.2+ |
| NFR-S2 | Secrets (API keys, DB credentials) stored in environment variables, never in source control |
| NFR-S3 | Project documents access-controlled at application layer per authenticated user |
| NFR-S4 | OpenAI API calls configured to not retain customer data for model training |
| NFR-S5 | Authentication tokens expire and support secure refresh |
| NFR-S6 | File uploads scanned for type validation; executable content rejected |
| NFR-S7 | Rate limiting on API endpoints to prevent abuse |

### Reliability

| ID | Requirement |
|---|---|
| NFR-R1 | Target 99.5% uptime during business hours (Mon–Fri, 7am–7pm local) |
| NFR-R2 | Failed ingestion/review jobs retryable without re-upload (max 3 retries) |
| NFR-R3 | No data loss on single-component failure (durable storage, transactional DB writes) |
| NFR-R4 | Graceful degradation: if AI service unavailable, queue jobs and notify user |

### Scalability

| ID | Requirement |
|---|---|
| NFR-SC1 | Architecture supports horizontal scaling of API and worker services |
| NFR-SC2 | MVP supports 10 concurrent pilot users without performance degradation |
| NFR-SC3 | Vector index scales to 100K chunks per project without query timeout |
| NFR-SC4 | Document storage scales independently of compute via object storage (future) |

### Accessibility

| ID | Requirement |
|---|---|
| NFR-A1 | UI meets WCAG 2.1 Level AA for core review workflow |
| NFR-A2 | All interactive elements keyboard-navigable |
| NFR-A3 | Color is not the sole indicator of severity (icons + labels required) |
| NFR-A4 | Screen reader compatible finding list and citation viewer |
| NFR-A5 | Minimum contrast ratio 4.5:1 for text content |

---

## 12. Success Metrics

### North Star Metric

**Time to Completed Review (TCR):** Median time from submittal upload to engineer-approved exported report.

**Target:** 50% reduction vs. manual baseline within 60 days of pilot launch.

### Primary Metrics

| Metric | Definition | MVP Target |
|---|---|---|
| Finding acceptance rate | % of AI findings accepted or edited (not rejected) | ≥ 60% |
| Citation verification rate | % of findings where engineer clicks to view source | ≥ 80% |
| Review completion rate | % of uploaded submittals reaching "review complete" | ≥ 70% |
| Report export rate | % of completed reviews generating an exported report | ≥ 50% |
| Weekly active reviewers | Unique users completing ≥ 1 review per week | ≥ 3 per pilot org |

### Secondary Metrics

| Metric | Definition |
|---|---|
| Document ingestion success rate | % of uploads successfully indexed |
| Search click-through rate | % of search queries resulting in source document view |
| P95 review latency | Time from "Run Review" click to findings displayed |
| Pilot 30-day retention | % of pilot teams with ≥ 1 active user after 30 days |
| Cost per review | OpenAI API cost per completed review run |

### Qualitative Signals

- Engineers cite Remy Review Studio findings in official submittal responses
- Users voluntarily upload documents beyond minimum required set
- QA/QC leads reference exported reports in audit workflows
- Pilot users request access for additional team members

---

## 13. Risks

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Poor PDF text extraction (scanned docs) | High | Medium | OCR fallback; flag low-confidence pages; user warning |
| Vector search retrieves irrelevant context | High | Medium | Tune chunk size/overlap; re-ranking; hybrid keyword + semantic search |
| Review job failures/timeouts | Medium | Medium | Retry logic; progress indicators; partial result streaming |
| pgvector performance at scale | Medium | Low | Index tuning; partition by project; evaluate dedicated vector DB if needed |

### Product Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Low pilot adoption | High | Medium | White-glove onboarding; measure TCR; iterate on UX from feedback |
| Scope creep toward full PM platform | Medium | High | Enforce non-goals; phase-gate features against success metrics |
| Feature parity expectations vs. Remy | Medium | Medium | Position as MVP learning platform; communicate roadmap clearly |
| Engineers bypass tool for "simple" reviews | Medium | Medium | Optimize for speed; demonstrate value on complex packages first |

### AI Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Hallucinated findings | Critical | Medium | Require citations; human-in-the-loop; never auto-approve |
| Over-reliance on AI recommendations | High | Medium | UI copy emphasizes engineer authority; show AI vs. human disposition |
| Inconsistent output across runs | Medium | Medium | Log prompt/model versions; temperature = 0; structured output schema |
| OpenAI API cost overruns | Medium | Medium | Cache embeddings; monitor cost per review; evaluate smaller models |
| Prompt injection via uploaded documents | Medium | Low | Sanitize extracted text; system prompt isolation; output validation |

### Security Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Unauthorized document access | Critical | Low | Project-level auth; audit access logs |
| Data breach of contract documents | Critical | Low | Encryption at rest; TLS in transit; minimal data retention |
| API key exposure | High | Low | Environment variables; secret scanning in CI |
| Customer reluctance to upload sensitive docs | High | Medium | Clear data policy; no training on customer data; future SOC 2 path |

---

## 14. Assumptions

1. **PDF-first workflow.** Users have digital PDFs for specs, drawings, and submittals. Scanned documents are supported with reduced accuracy via OCR.
2. **English-language documents.** NLP models and prompt templates optimized for English construction specifications (CSI MasterFormat).
3. **Human-in-the-loop is mandatory.** Engineers review and disposition every AI finding before it appears in an exported report.
4. **Desktop-primary usage.** Detailed review happens on desktop/laptop; tablet-readable responsive web is sufficient for MVP.
5. **Single-user projects in MVP.** Multi-user collaboration and role-based access deferred to Phase 2.
6. **Standard submittal packages ≤ 200 pages.** Pipelines sized for typical packages; larger documents may require chunked processing.
7. **OpenAI API availability.** Core analysis depends on third-party LLM; fallback provider evaluation post-MVP.
8. **Internet required.** Cloud-hosted architecture; offline mode not in scope.
9. **US commercial construction context.** CSI conventions, US project delivery methods, and English UX copy.
10. **Pilot users tolerate MVP gaps.** Early adopters accept missing integrations and occasional AI inaccuracy for speed gains.

---

## 15. Glossary

| Term | Definition |
|---|---|
| **Submittal** | A formal submission by a contractor or vendor containing product data, shop drawings, samples, or other documentation required by the contract for review and approval before procurement or installation |
| **Specification (Spec)** | A division of the contract documents that describes material properties, performance requirements, execution standards, and quality criteria. Typically organized by CSI MasterFormat divisions (e.g., Division 23 = HVAC) |
| **Drawing** | A graphical contract document (plan, elevation, section, detail) showing design intent, dimensions, and assembly requirements. Identified by sheet number (e.g., M-101) |
| **Compliance** | The state of a submittal meeting the requirements defined in the contract documents (specifications and drawings). Non-compliance indicates a gap between submitted and required attributes |
| **RFI (Request for Information)** | A formal question submitted by the contractor to the design team seeking clarification on ambiguous or missing contract document information |
| **Trade** | A specialized construction discipline or subcontractor scope (e.g., mechanical, electrical, plumbing, fire protection, structural steel) |
| **Project Engineer** | A design team member responsible for reviewing submittals, responding to RFIs, and ensuring field work conforms to contract documents within their discipline |
| **Submittal Log** | A tracking register listing all required submittals, their status (submitted, in review, approved, rejected), responsible parties, and due dates |
| **CSI MasterFormat** | Industry-standard system for organizing construction specifications into 50 divisions by work result (e.g., Division 09 = Finishes, Division 26 = Electrical) |
| **Shop Drawing** | Detailed drawings prepared by the contractor or fabricator showing how materials and components will be manufactured and installed |
| **Product Data** | Manufacturer-provided documentation (cut sheets, performance data, certifications) submitted as part of a submittal package |
| **Approved as Noted** | A review disposition indicating conditional approval with required corrections or clarifications before procurement |
| **Revise & Resubmit** | A review disposition requiring the contractor to address identified deficiencies and submit a revised package |
| **Citation** | A reference linking an AI finding to a specific location in a source document (page, section, excerpt) enabling verification |
| **Embedding** | A numerical vector representation of text used for semantic similarity search across document chunks |
| **Chunk** | A segment of extracted document text (typically 500–1000 tokens) used as the unit for embedding and retrieval |

---

## Appendix A: Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend API | FastAPI (Python) |
| Database | PostgreSQL + pgvector |
| Cache / Queue | Redis |
| AI / LLM | OpenAI (GPT-4 class + Embeddings API) |
| Infrastructure | Docker, docker-compose |
| CI/CD | GitHub Actions |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture diagram.

---

## Appendix B: Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Email/password vs. Google OAuth for MVP auth? | Product | Open |
| 2 | OCR provider for scanned PDFs? | Engineering | Open |
| 3 | PDF vs. Word for report export preference? | Product | Open |
| 4 | Data retention period for uploaded documents? | Legal | Open |
| 5 | Per-project vs. per-seat pricing model? | Product | Open |

---

*This document is the official product specification for Remy Review Studio. It will be updated as pilot feedback and technical discovery inform scope changes.*
