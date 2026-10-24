# Verification and Evaluation Plan

**Project:** SEN Support Platform
**Owner:** Ondasyn Aknur (SE-2420), Security, Privacy & Quality Assurance
**Status:** Draft for pre-defense 1 (24 October), revision 2

## 1. Aim of verification

To demonstrate that the platform meets the security, privacy and quality requirements in [security-privacy-requirements.md](security-privacy-requirements.md), and in particular that a user can access only the child data they are entitled to ([rbac-and-threat-model.md](rbac-and-threat-model.md)).

## 2. Test levels

| Level | Tools | What is verified | Requirements |
| --- | --- | --- | --- |
| Unit | Go `testing` | Password hashing, token creation and validation, RBAC decision function, visibility filter, input validation | SEC-01, 02, 05, 10, 12, 20 |
| Integration | Go `testing` with `net/http/httptest` and a test PostgreSQL instance (`/backend/tests/integration`) | Full request path: authentication, authorization, database, audit events | SEC-03, 04, 08, 11, 13, AUD-01, 02, 03, 05 |
| Access-control matrix | Table-driven Go test generated from the access matrix | Every role × resource × action cell, including object-level cases | SEC-10, 11, 12, 15 |
| Security (OWASP) | Manual test cases, scripted requests, OWASP ZAP baseline scan, `govulncheck`, `npm audit` | OWASP Top 10 categories (section 4) | SEC-20 to 25 |
| Load | `k6` or `vegeta` | Behaviour under load and rate limiting | SEC-03, 23 |
| Frontend | Component tests (Vitest) and manual checks | Escaping of user content, role-dependent UI, no tokens in logs | SEC-21, PRV-04 |
| Acceptance | Manual walkthrough of key scenarios with the supervisor | Parent, specialist and admin scenarios end to end | all "M" requirements |

## 3. Metrics, targets and measurement conditions

Targets are proposals for the prototype and will be reviewed with the supervisor.

| Metric | Target | How it is measured | Conditions |
| --- | --- | --- | --- |
| Access-matrix test pass rate | 100% of cells | Table-driven test result in CI | Fresh database with seed data for two families, two specialists, one admin |
| Cross-family access attempts blocked | 100% (0 successful reads or writes), all answered with 404 | Integration tests against every endpoint that takes a child or entry ID | Authenticated as a parent of another family |
| `specialists_only` leakage to guardians | 0 occurrences | Visibility tests over list, search and export | Seed data with mixed visibility |
| Admin access to diary text | 0 occurrences | Tests on every admin endpoint, including export and deletion | Seed data with diary entries of both visibility types |
| Audit completeness (data access) | 100% of create/read/update/delete/export actions on child-related resources produce exactly one event (AUD-01) | Count of events versus actions in an integration scenario | Includes denied attempts |
| Audit completeness (authentication) | 100% of login success, login failure, logout, refresh and lockout actions produce exactly one event (AUD-05) | Count of events versus scripted actions | Includes unknown-email attempts |
| Login response uniformity | Identical status and body; difference of median response times below 50 ms (SEC-04) | 200 attempts with an unknown email and 200 with a wrong password | Same account state, single node |
| Open high-severity findings at release | 0 | OWASP checklist, ZAP baseline, dependency scans | Run on the release candidate |
| Unit and integration line coverage of `internal/service` and `internal/transport/http` | 70% or more (security-critical packages 85% or more) | `go test -cover` | CI on main |
| Authentication endpoint rate limit | 429 after the configured limit (default 5 failures per 15 minutes) | Scripted login attempts | Single IP, distributed accounts, and unknown emails (lockout must behave identically for existing and unknown emails, SEC-04) |
| API latency under normal load | p95 below 300 ms for read endpoints | `k6` run | 50 concurrent virtual users for 5 minutes on a single-node test deployment, audit of reads enabled |
| Error rate under normal load | below 1% | `k6` run | Same as above |
| Behaviour under overload | No crash; excess requests answered with 429 or 503 | `k6` ramp to 5× normal load | Same hardware, reported with the hardware description |
| Cost of auditing under load | Reported, not a pass/fail target: p95 and error rate with audit of reads enabled versus disabled | Two `k6` runs with identical scenario | Every read writes an audit row, so this is the most likely bottleneck |

**Basis for the load figures (assumption, to be confirmed with the supervisor).** The pilot is assumed to serve about 200 registered families and 20 specialists, with at most 20 users active at the same moment. 50 virtual users is therefore 2.5× the assumed peak, and the 5× overload ramp (250 virtual users) is 12.5× the assumed peak. Targets are for a single-node test deployment and are compared relative to the naive baseline (section 5), not presented as production capacity.

**Audit overhead.** The audit log writes one row for every read (AUD-01), which adds database load. The load test is therefore run with auditing enabled, and the extra run with auditing disabled shows its cost. The result decides whether read events may be written asynchronously. Denied attempts and all writes stay synchronous so that no event is lost.

## 4. OWASP Top 10 (2021) test plan

| OWASP category | Planned checks | Linked threats |
| --- | --- | --- |
| A01 Broken Access Control | Access matrix test, IDOR tests on every ID parameter, revoked-assignment test, force-browsing of admin endpoints, 404 versus 403 rule check | T3, T4, T5, T6 |
| A02 Cryptographic Failures | Password hash inspection, TLS configuration scan, encryption-at-rest configuration review, check that secrets are not in the repository | T13, T14, T17 |
| A03 Injection | SQL injection payloads on all inputs, XSS payloads in diary text and titles | T7, T8 |
| A04 Insecure Design | Review of the threat model and misuse cases against the implemented flows | all |
| A05 Security Misconfiguration | Security headers, CORS, error messages without internals, default accounts absent | T9, T12 |
| A06 Vulnerable and Outdated Components | `govulncheck`, `npm audit` in CI | T16 |
| A07 Identification and Authentication Failures | Brute force, token tampering and expiry, `alg=none`, logout and refresh revocation, refresh token reuse, login response uniformity | T1, T2, T18 |
| A08 Software and Data Integrity Failures | Dependency lock files committed, CI checks, audit log immutability test | T11 |
| A09 Security Logging and Monitoring Failures | Audit completeness tests (data access and authentication), log content inspection | T10, T12 |
| A10 Server-Side Request Forgery | Confirm the API makes no server-side requests to user-supplied URLs (not applicable by design; documented) | n/a |

## 5. Baseline for comparison

The project aim is to show that the platform gives measurably better protection than a straightforward implementation without the security design. Two baselines are used:

1. **Naive baseline:** a minimal version of the API with authentication only (a valid token grants access to any child ID, no visibility filter, no rate limit). The same test suite is run against it to show which tests fail. This gives a concrete before/after comparison in the final report.
2. **Reference standard:** the OWASP Application Security Verification Standard (ASVS) Level 1 checklist. The share of applicable Level 1 controls satisfied is reported for the release candidate.

## 6. Test data and environment

- Synthetic data only (PRV-08): two families, three children, two specialists with active and ended assignments, one admin, diary entries of both visibility types.
- Isolated test database created and destroyed per test run, with migrations from `/backend/migrations`.
- CI pipeline runs unit, integration and dependency scans on each pull request; security and load tests run on the release candidate before each pre-defense tag.

## 7. Defect handling and reporting

- Each finding is recorded as a task with severity (high, medium, low), affected requirement, reproduction steps and a link to the fixing pull request.
- High severity findings block the release; medium findings need an accepted mitigation or a documented residual risk.
- A verification report (`/docs/security-report-<tag>.md`) is produced for each pre-defense tag and lists test results, metrics versus targets, open findings and known limitations.

## 8. Schedule

| Milestone | Verification activity |
| --- | --- |
| Pre-defense 1 (24 October) | This plan, requirements, access matrix and threat model; test skeleton and the first RBAC unit tests where code exists |
| After Access and Profiles backend milestones | Authentication, RBAC and IDOR integration tests |
| After Support and Diary milestones | Visibility, audit and history tests |
| Quality and launch milestone | Full OWASP pass, ZAP baseline, load tests, verification report, final-pre-defense tag |

## 9. Risks to verification

| Risk | Mitigation |
| --- | --- |
| Backend features arrive late, leaving little time to test | Write tests from the access matrix first (test-first for RBAC); agree on API contracts early with the backend developer |
| Load test hardware differs from production | Report the hardware used and compare relative to the baseline rather than claiming absolute capacity |
| Legal interpretation (health data, consent) is uncertain | Record assumptions and confirm with the supervisor |
| Audit of every read slows the API | Measure the cost (section 3); if needed write read events asynchronously, keeping denied and write events synchronous |

## 10. Revision notes (revision 2)

- Rate-limit test now includes unknown emails (SEC-03 and SEC-04 consistency); frontend row also references PRV-04.

- Audit completeness split into data access (AUD-01) and authentication (AUD-05) metrics.
- SEC-04 tolerance turned into a measurable metric (50 ms, 200 attempts per case).
- Added metrics for admin access to diary text (SEC-15) and for 404 on cross-family access (SEC-11).
- Load figures justified by an explicit usage assumption; audit overhead added as a separate measurement and as a risk.
