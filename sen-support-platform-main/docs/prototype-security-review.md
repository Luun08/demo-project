# Security review of the current prototype and frontend direction

**Owner:** Aknur — Security, Privacy & QA  
**Review date:** 22 October 2026  
**Scope:** the standalone teaching prototype in `docs/prototype/` and the frontend scaffold. This is a design review, not a penetration test or production security approval.

## Current state

- The standalone HTML prototype is a clickable mockup with fictitious content; it does not call a backend or persist records.
- The React frontend is a starter foundation. There is no production API/session flow to assess yet.
- Do not enter real names, diagnoses, contact details, diary content, tokens or credentials in screenshots, demos or repository fixtures.

## Required implementation decisions before live data

| Area | Requirement for implementation | Review evidence to request |
|---|---|---|
| Authorization | Enforce role and child relationship on every API request; hide-only UI checks do not count. Deny by default. | Table-driven backend matrix, including cross-family IDs and ended specialist assignments. |
| Diary visibility | Filter `specialists_only` data in database/query paths, including counts, search, export and error responses. | Integration tests for each read path and guardian export. |
| Credentials | Follow the draft in [authentication/session decisions](decisions/authentication-and-session-decisions.md); no tokens in local/session storage. | Browser storage inspection, refresh rotation/reuse tests, logout revocation and CSRF checks. |
| XSS and rendering | Render user text as text, not trusted HTML; avoid unsafe HTML APIs; define a restrictive Content Security Policy when deployed. | Code review of diary/title rendering and a stored-XSS test with harmless payloads. |
| Network and browser policy | HTTPS, strict CORS allowlist, appropriate security headers, and safe cookie attributes if cookies are used. | Deployment/config review and header scan. |
| Sensitive data | Minimize child data and use synthetic fixtures. Keep secrets and personal data out of logs and Git. | Data inventory review, sample log inspection and repository secret scan. |
| Audit trail | Record access and changes with actor, target, action, time, request ID and outcome; do not record diary text or credentials. | Audit coverage tests and database/API permission review. |
| Prototype disclosures | Label sample records as fictional and explain that forms do not save or send data. | Demo walkthrough and screenshot review. |

## Findings and follow-up

No exploitable vulnerability is asserted because the prototype was not subjected to dynamic security testing. The main risk is implementation drift: the visual mockup can imply functioning privacy controls that the starter application/API do not yet enforce. Keep demo labels explicit and treat every security promise as a requirement until code and tests demonstrate it.

Before release, review the frontend after real authentication and API integration; this note does not replace that review.
