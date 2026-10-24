# Technology Alternatives and Rationale

**Status:** Initial decision record for a student MVP. Ratings are qualitative engineering judgement against this project's stated constraints; they are not benchmark results.

## Evaluation criteria

Fit to current code/team familiarity; type safety and maintainability; relational integrity for guardian-child-assignment-session-diary links; ability to test authorization; deployment complexity; ecosystem support. The project already has a React/TypeScript frontend and Go backend skeleton, so switching stacks carries migration and schedule cost.

## Decision 1 — Backend/API

| Option | Strengths | Trade-offs | Fit |
|---|---|---|---|
| Go `net/http` (selected) | Existing skeleton and domain types; standard library HTTP server; compiled binary and explicit handlers | Validation, routing conventions, OpenAPI and persistence adapters must be assembled deliberately | High, minimizes rework |
| Node.js + TypeScript (e.g., Fastify) | Shared language/types with frontend; large ecosystem | Adds runtime/dependency surface; team would rewrite existing Go skeleton; ORM and authorization rules still need careful design | Medium |
| Python + FastAPI | Typed request/response schemas and automatic OpenAPI are attractive for rapid API prototyping | New runtime and team conventions; async/persistence/auth boundaries still require design | Medium-low |

**Decision:** Keep Go for MVP. Use explicit middleware/service authorization and structured errors; document API contract before frontend integration. No framework-performance claim is made.

## Decision 2 — Primary persistence

| Option | Strengths | Trade-offs | Fit |
|---|---|---|---|
| PostgreSQL (proposed) | Relational constraints and transactions suit explicit guardian/assignment/session/diary relations; supports JSON when needed [4] | Requires schema/migration/backup operations; hosting and locality remain undecided | High |
| MySQL | Mature relational option and common hosting availability | Same relational benefits; team must choose and test a concrete engine and migration tooling | Medium-high |
| MongoDB | Flexible document model for evolving records | Cross-entity relationships, ownership checks, and revision/audit consistency require additional application discipline | Medium-low for this domain |

**Decision:** Use PostgreSQL as the initial candidate because the core domain is relational and access decisions depend on relationships. Confirm the deployment and data-localisation constraints before selecting a production host. Never treat database choice as a substitute for API authorization.

## Decision 3 — Client/server interaction

| Option | Strengths | Trade-offs | Fit |
|---|---|---|---|
| REST/JSON over HTTPS (selected) | Simple resource-oriented contract, easy to inspect and consume from the existing browser client | Requires versioning and consistent request/response schemas | High |
| GraphQL | Flexible client queries and a typed schema | Adds resolver/auth complexity and is unnecessary for the current small API | Medium-low |
| gRPC | Strong service contracts and efficient service-to-service communication | Browser integration needs additional transport support and is not justified for the current single web client | Low |

**Decision:** Use REST/JSON for the MVP and document the contract before frontend integration.

## Cross-cutting decisions

- **Interaction:** REST/JSON HTTP API for browser client and simple inspectability; alternatives such as GraphQL/gRPC are unnecessary for current scope and would add contract/auth complexity.
- **Authentication:** Password hashing plus short-lived access token and rotated, revocable refresh token are specified in the security requirements; implementation details and secure browser token storage must be agreed before coding.
- **Tests/evaluation:** Go unit/integration tests, frontend checks, OWASP-oriented verification, and load measurements are planned in `verification-plan.md`; none are claimed as completed in this decision record.

Frontend framework alternatives and the current React/TypeScript/Vite selection are documented in [frontend-technology-comparison.md](frontend/tech-comparison.md). Authentication/session and password-hashing trade-offs are documented separately in [authentication-and-session-decisions.md](decisions/authentication-and-session-decisions.md).

## Official technical references

1. React reference: https://react.dev/reference/react
2. React + TypeScript: https://react.dev/learn/typescript; Vite: https://vite.dev/guide/
3. Vue TypeScript guide: https://vuejs.org/guide/typescript/overview; Angular docs: https://angular.dev/docs
4. Go `net/http`: https://pkg.go.dev/net/http; FastAPI: https://fastapi.tiangolo.com/; Node.js: https://nodejs.org/docs/latest/api/
5. PostgreSQL documentation: https://www.postgresql.org/docs/; MySQL documentation: https://dev.mysql.com/doc/; MongoDB transactions: https://www.mongodb.com/docs/manual/core/transactions/
