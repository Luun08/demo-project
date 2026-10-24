# SEN Support Platform

A privacy-conscious web platform for coordinating support sessions and sharing development observations between a child's parents/guardians and assigned specialists.

> **Status: analysis, design and interactive-prototype stage (Pre-Defense 1, 24 October 2026).** The backend API, database integration and business logic are **not implemented yet**. The frontend is a clickable prototype running on sample data. Submission tag: `pre-defense-1`.

- **Repository:** https://github.com/AknurOE/sen-support-platform
- **YouTrack project:** https://honchikon1.youtrack.cloud/projects/SSP
- **Supervisor:** A. K. Makatov

---

## Problem statement

Families of children with special educational needs (SEN) often coordinate appointments, observations and agreed support across home, school and specialist settings. This information is scattered across messengers, calendars, paper notes and separate apps, and there is no shared place where a guardian decides **who sees which observation**.

This project designs and prototypes a shared workspace for these coordination tasks with server-enforced access control and auditable changes. It **does not** diagnose a child, prescribe interventions, or act as an official medical record.

## Target users

| User | What they need |
|---|---|
| Parent / legal guardian | Plan sessions, record observations, control visibility of each entry, revoke access |
| Assigned specialist (e.g. speech therapist, teacher, tutor) | See assigned children only, add session notes and diary entries within granted permissions |
| Platform administrator | Manage accounts and assignments, without access to diary text by default |
| Guest | View public pages, register, log in; no access to child data |

## Aim and expected outcomes

**Aim:** design and evaluate a web platform prototype in which an authorized guardian and an assigned specialist coordinate support sessions and keep a visibility-controlled developmental diary, with server-side access checks and an audit trail.

**Expected outcomes:**

- an evidence-traceable requirements and architecture package;
- an interactive prototype and, in later milestones, a working web application (MVP);
- a threat model, access matrix, data inventory and verification report;
- a comparison of the prototype with a baseline, with documented limitations.

Full objectives and success criteria: [docs/proposal.md](docs/proposal.md).

## Scope

**Planned MVP:** account access; guardian/specialist relationships; minimized child profile; session planning and status; diary entries with visibility levels; edit history and audit events; responsive web UI; role- and relationship-based authorization; synthetic test data; security and usability evaluation.

**Out of scope:** clinical diagnosis or recommendations, video calls, billing, school/clinic integrations, automated decisions, production hosting of real children's data, and any claim of legal compliance (GDPR / Kazakhstan law) without specialist review.

## Current status

| Area | State |
|---|---|
| Research, requirements, comparisons, architecture, security/privacy docs, verification plan | Drafted (see [documentation](#documentation-by-pre-defense-component)) |
| Clickable frontend prototype (React + TypeScript, sample data, in-memory state) | Available in [`frontend/`](frontend) |
| Go domain models and project skeleton | Drafts in [`backend/`](backend) |
| REST API contract | Draft in [`docs/openapi.yaml`](docs/openapi.yaml) |
| Backend API, persistence, authentication, backend tests | **Not implemented** |
| Usability study | **Not conducted** (plan: [docs/frontend/usability-plan.md](docs/frontend/usability-plan.md)) |
| Supervisor feedback | Received 23 Oct 2026: 12 comments with decisions and owners in [docs/supervisor-feedback.md](docs/supervisor-feedback.md); recommended for Pre-Defense 1 |
| Legal classification, consent model, retention, hosting | Open decisions ([legal checklist](docs/kazakhstan-privacy-legal-checklist.md)) |

## User research and its limits

An anonymous exploratory survey (Google Forms) was run on 22–23 October 2026 with **seven respondents**: three parents/guardians and four specialists (two speech therapists, one teacher, one tutor). The link was shared in WhatsApp, Telegram and other messaging groups.

The sample is small and self-selected, so the results are **preliminary and not representative**. Findings are mapped to requirements, and assumptions are marked separately from observed findings, in [evidence-to-requirements](docs/research/evidence-to-requirements.md); method and limits: [survey-method](docs/research/survey-method.md); personas: [personas](docs/research/personas.md). The raw export is not committed because one response contains personal contact information. No usability results are claimed.

## Technology stack

| Layer | Choice | Alternatives considered |
|---|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 | Vue, Angular ([comparison](docs/frontend/tech-comparison.md)) |
| Backend | Go 1.23.10+, `net/http` | Node.js + Fastify, Python + FastAPI |
| Database | PostgreSQL 16 (initial candidate; hosting not decided) | MySQL, MongoDB |
| Client–server interaction | REST/JSON over HTTPS, contract in OpenAPI | GraphQL, gRPC |
| Authentication | Password hashing, short-lived access token, rotated revocable refresh token (design stage) | see [decisions](docs/decisions/authentication-and-session-decisions.md) |
| Tooling | Docker Compose (database), GitHub Actions CI (Go tests, `govulncheck`, `npm audit`, gitleaks) | |

Justification of each decision: [docs/technology-comparison.md](docs/technology-comparison.md).

## Getting started

### Prerequisites

- Node.js 22 and npm (the CI uses Node 22)
- Go 1.23.10+ (only for the backend skeleton and `make test` / `make lint`)
- Docker (optional, only to start the local PostgreSQL container)

### Run the prototype

```bash
cd frontend
npm ci
npm run dev        # development server (Vite)
npm run build      # production build check
```

The prototype uses sample data and in-memory state. It is not connected to authentication or a backend API. Consent controls in the demo are illustrative and are not a validated legal consent process. No hosted demo is available; see [prototype/README.md](prototype/README.md).

### Configuration and local database (optional)

```bash
cp .env.example .env     # replace the REPLACE_WITH_* placeholders with local values
docker compose up -d db  # starts PostgreSQL 16; the backend does not use it yet
```

Never commit `.env`, credentials or real data.

### Tests and checks

```bash
make test   # go test ./... (frontend tests run only if a test script exists)
make lint   # go vet ./... (frontend lint runs only if a lint script exists)
```

Honest status: the backend currently has domain-model drafts and **no automated tests**, and the frontend has **no test or lint scripts yet**. The planned test suite (authentication, RBAC, IDOR/cross-family access, diary visibility, audit/history, OWASP checks, load tests) is described in [docs/verification-plan.md](docs/verification-plan.md); none of it is reported as passed. CI currently runs Go tests, `govulncheck`, `npm audit` and a secret scan.

## Documentation by pre-defense component

| # | Component | Where |
|---|---|---|
| 1 | Project proposal | [docs/proposal.md](docs/proposal.md) |
| 2 | Evidence of relevance | [docs/research/](docs/research) — [survey method](docs/research/survey-method.md), [evidence → requirements](docs/research/evidence-to-requirements.md), [personas](docs/research/personas.md) |
| 3 | Literature review | [docs/literature-review.md](docs/literature-review.md), [UX sources](docs/frontend/literature-ux.md), [security sources](docs/security-and-rbac-sources.md) |
| 4 | Existing systems comparison | [docs/existing-systems-comparison.md](docs/existing-systems-comparison.md), [criteria](docs/existing-systems-criteria.md), [security criteria](docs/system-security-criteria.md) |
| 5 | Technology comparison | [docs/technology-comparison.md](docs/technology-comparison.md), [frontend](docs/frontend/tech-comparison.md), [auth/session](docs/decisions/authentication-and-session-decisions.md) |
| 6 | Requirements | [docs/requirements.md](docs/requirements.md), [SRS](docs/srs.md), [security & privacy](docs/security-privacy-requirements.md), [UI requirements](docs/frontend/ui-requirements.md), [traceability matrix](docs/traceability-matrix.md) |
| 7 | Architecture and diagrams | [docs/architecture.md](docs/architecture.md) — context, use case, component and ER diagrams as Mermaid sources; DFD source in [docs/diagrams/dfd.mmd](docs/diagrams/dfd.mmd); PNG/SVG exports in [docs/diagrams/exports/](docs/diagrams/exports) |
| 8 | UX / prototype | [frontend/](frontend), [UX scenarios](docs/ux-scenarios.md), [prototype/README.md](prototype/README.md) |
| 9 | Verification and evaluation plan | [docs/verification-plan.md](docs/verification-plan.md), [usability plan](docs/frontend/usability-plan.md) |
| 10 | Project management and risks | [docs/project-management.md](docs/project-management.md), [YouTrack](https://honchikon1.youtrack.cloud/projects/SSP) |
| 11 | Supervisor feedback | [docs/supervisor-feedback.md](docs/supervisor-feedback.md) |

Security, privacy and legal documents: [RBAC and threat model](docs/rbac-and-threat-model.md), [data inventory](docs/data-inventory.md), [incident response](docs/incident-response.md), [prototype security review](docs/prototype-security-review.md), [legal checklist](docs/kazakhstan-privacy-legal-checklist.md). Submission summary: [submissions/pre-defense-1.md](submissions/pre-defense-1.md).

## Team

| Team member | Role | Responsibilities |
|---|---|---|
| Ondasyn Aknur (SE-2420) | Security, privacy and QA | Security/privacy requirements, access control, threat model, verification plan, legal analysis, risk register, submission tags |
| Zhumagali Beibarys (SE-2423) | Backend and architecture | Scope, SRS, architecture, API contract, technology comparison, domain model, repository infrastructure |
| Zhuparbai Yerkebulan (SE-2423) | Frontend and UX | User research and flows, personas, mockups, clickable prototype, UX comparison |

Shared: literature review, system comparison, README and consistency review. Milestones, dependencies and the risk register: [docs/project-management.md](docs/project-management.md).

## Repository structure

```text
.
├── docs/                 # Proposal, research, requirements, comparisons, architecture, security
│   ├── decisions/        # Architecture and security decisions
│   ├── diagrams/         # Mermaid sources and PNG/SVG exports
│   ├── frontend/         # UX, frontend research, usability plan
│   └── research/         # Survey method, personas, evidence → requirements
├── frontend/             # React/TypeScript clickable prototype
├── backend/              # Go domain models, planned layers, test directories
│   ├── cmd/api/          # Entry point (planned)
│   ├── internal/         # domain, service, repository, transport, config
│   ├── migrations/       # Database migrations (planned)
│   └── tests/            # Integration tests (planned)
├── prototype/            # Prototype access information
├── submissions/          # Per-pre-defense submission summaries
├── .github/workflows/    # CI
├── .env.example          # Configuration template (placeholders only)
├── docker-compose.yml    # Local PostgreSQL
└── Makefile              # test / lint / run shortcuts
```

## Known limitations and next steps

**Limitations at Pre-Defense 1**

- No backend API, database integration or backend tests.
- Survey evidence is exploratory (7 responses, self-selected); no interviews or usability study yet.
- Consent, legal classification, retention and hosting are unresolved.

**Next steps** (tracked in [YouTrack](https://honchikon1.youtrack.cloud/projects/SSP))

1. Apply the supervisor feedback (SF-01…SF-12): interviews, literature update, reviewed PRs, legal checklist.
2. Agree the API contract and the session/token design.
3. Implement the *Access and Profiles* backend (registration/login, tokens, RBAC) with auth, RBAC and IDOR tests.
4. Implement *Support and Diary* (sessions, visibility-controlled diary, audit/edit history).
5. Run the usability evaluation, OWASP review and load tests; report results against a baseline.

## Git workflow

- `main` is the reviewed baseline; work happens in task branches named after the YouTrack ID.
- Every change goes through a pull request that explains the change, references the task and says how it was checked. Another team member reviews it before merging.
- Each member commits from their own GitHub account.

```text
Task:    SSP-23 – Define the database schema
Branch:  SSP-23-database-schema
Commit:  SSP-23: Add initial database schema and ER diagram
```

- Submission tags `pre-defense-1`, `pre-defense-2`, `final-pre-defense` are created on the submitted commit and are never moved.
- Git history, pull requests and review comments are available in the GitHub repository.

## Data and privacy

Use synthetic data only. Do not commit credentials, real child data or identifiable survey responses. The diary may contain health-related information about children, so legal classification, consent, retention and hosting decisions are open and are listed in the project documents as assumptions, not as compliance claims.

## License

No license has been specified yet; all rights reserved by the authors.
