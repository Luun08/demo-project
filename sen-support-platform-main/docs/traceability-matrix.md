# Traceability Matrix

**Project:** SEN Support Platform
**Owner:** Ondasyn Aknur (SE-2420), Security, Privacy & Quality Assurance
**Status:** Draft for pre-defense 1 (24 October)

Links each requirement in [security-privacy-requirements.md](security-privacy-requirements.md) to the threats it mitigates ([rbac-and-threat-model.md](rbac-and-threat-model.md)), the planned test ([verification-plan.md](verification-plan.md)), the implementing owner and the milestone. Update the **Status** column in every pull request that touches a requirement.

The authorization matrix test is planned in the [verification plan](verification-plan.md). No Go authorization test file exists yet, and no test status is changed to `Verified`.

## 1. Legend

- **Test level:** U = unit, I = integration, M = access-matrix test, S = security (OWASP, ZAP, scripts), L = load, F = frontend, CI = CI check, R = review of configuration or documents.
- **Owner (implementation):** B = Beibarys (backend), F = Yerkebulan (frontend), A = Aknur (security; also writes all tests).
- **Milestone:** M1 Access, M2 Profiles, M3 Support, M4 Diary, M5 Quality and launch (as in section 8 of the verification plan).
- **Status:** `Specified` (requirement written, nothing built), `Test written`, `Implemented`, `Verified` (test passes in CI). At pre-defense 1 every row is `Specified`.

## 2. Requirement → threat → test

### 2.1 Authentication and session management

| Req. | Pri. | Threats | Test ID | Level | Owner | Milestone | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-01 | M | T1, T13 | TC-U-HASH-01 (hashes differ), TC-R-HASH-02 (DB inspection) | U, R | B | M1 | Specified |
| SEC-02 | M | T1, T18 | TC-U-PWD-01 (policy), TC-I-REG-01 (weak password rejected) | U, I | B | M1 | Specified |
| SEC-03 | M | T1, T15 | TC-I-RATE-01 (single IP), TC-I-RATE-02 (distributed accounts), TC-L-RATE-03 | I, L | B | M1 | Specified |
| SEC-04 | M | T1 | TC-I-LOGIN-UNIFORM (status, body, median time within 50 ms) | I | B | M1 | Specified |
| SEC-05 | M | T2 | TC-U-JWT-01..04 (expired, tampered, unsigned, wrong algorithm) | U, I | B | M1 | Specified |
| SEC-06 | M | T2, T18 | TC-I-REFRESH-01 (logout revokes), -02 (rotation), -03 (reuse rejected) | I | B | M1 | Specified |
| SEC-07 | M | T13, T14 | TC-CI-SECRET (secret scan), TC-R-ENVEX (`.env.example` placeholders) | CI, R | A, B | M1 | Specified |
| SEC-08 | M | T2, T5, T18 | TC-I-INACTIVE (old token rejected after deactivation) | I | B | M1 | Specified |

### 2.2 Authorization

| Req. | Pri. | Threats | Test ID | Level | Owner | Milestone | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-10 | M | T3, T4, T5, T6 | TC-M-MATRIX (every role × resource × action cell) | M | B, A | M1, then every milestone | Specified |
| SEC-11 | M | T3, T5 | TC-I-IDOR (every endpoint with a child or entry ID, expects 404), TC-I-REVOKE (ended assignment, old token), TC-I-404-403 (rule check) | I | B | M2 | Specified |
| SEC-12 | M | T4 | TC-I-VIS (list, search, export, error messages) | I | B | M4 | Specified |
| SEC-13 | M | T6 | TC-I-MASS (`"role":"admin"` on register and update) | I | B | M1 | Specified |
| SEC-14 | M | T6 | TC-I-ADMINREG (public endpoint cannot create admin), TC-R-BOOTSTRAP | I, R | B | M1 | Specified |
| SEC-15 | M | T3, T4 (admin as insider) | TC-M-MATRIX-ADMIN, TC-I-ADMIN-DIARY (admin export and deletion show no diary text) | M, I | B | M4 | Specified |

### 2.3 Data protection and privacy

| Req. | Pri. | Threats | Test ID | Level | Owner | Milestone | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PRV-01 | M | T17 | TC-S-TLS (TLS scan, HSTS, no plain HTTP) | S | B | M5 | Specified |
| PRV-02 | M | none (compliance) | TC-R-INVENTORY (review of [data-inventory.md](data-inventory.md)) | R | A | M1 | Specified |
| PRV-03 | M | T13 | TC-R-ENC (encryption at rest of database volume and backups) | R | B | M5 | Specified |
| PRV-03a | S | T13 | TC-I-FLE (database dump shows no readable diary text) | I | B | M5 | Specified |
| PRV-04 | M | T12 | TC-I-LOGS (log inspection), TC-CI-PII (secret and PII pattern scan) | I, CI | A | M1, M5 | Specified |
| PRV-05 | S | none (compliance, GDPR Art. 15–17, 20) | TC-I-EXPORT (no `specialists_only` in guardian export), TC-I-DELETE | I | B | M4 | Specified |
| PRV-06 | C | none (compliance) | TC-I-RETENTION (scheduled job) | I | B | M5 | Specified |
| PRV-07 | S | none (compliance) | TC-I-CONSENT (record created at child registration, visible in audit) | I | B | M2 | Specified |
| PRV-08 | M | none (compliance) | TC-R-SEED (seed data is synthetic, documented) | R | A | M1 | Specified |

### 2.4 Audit and monitoring

| Req. | Pri. | Threats | Test ID | Level | Owner | Milestone | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-01 | M | T10 | TC-I-AUDIT-DATA (one event per create, read, update, delete, export, including denied) | I | B | M2 to M4 | Specified |
| AUD-02 | M | T10, T11 | TC-I-AUDIT-IMMUT (no endpoint; database role lacks UPDATE and DELETE) | I | B | M2 | Specified |
| AUD-03 | S | T10 | TC-I-DIARY-VER (edit creates a listable version) | I | B | M4 | Specified |
| AUD-04 | S | none (transparency) | TC-I-AUDIT-VIEW (guardian sees only own child's access events) | I | B, F | M4 | Specified |
| AUD-05 | M | T1, T10 | TC-I-AUDIT-AUTH (one event per login, failure, logout, refresh, lockout, password change; no secrets in events) | I | B | M1 | Specified |

### 2.5 Application security and quality

| Req. | Pri. | Threats | Test ID | Level | Owner | Milestone | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-20 | M | T7 | TC-S-SQLI (payload suite on all inputs), TC-CI-SQLSTATIC (no string-built SQL) | S, CI | B | M5 | Specified |
| SEC-21 | M | T8 | TC-F-XSS (payload rendered as text), TC-S-HEADERS (CSP and other headers) | F, S | F, B | M5 | Specified |
| SEC-22 | M | T9 | TC-S-CORS (non-allowed origin rejected) | S | B | M5 | Specified |
| SEC-23 | M | T12, T15 | TC-I-BODYLIMIT (413), TC-S-ERRORS (no internals), TC-L-OVERLOAD (429 or 503, no crash) | I, S, L | B | M5 | Specified |
| SEC-24 | S | T16 | TC-CI-DEPS (`govulncheck`, `npm audit` fail on high) | CI | A | M1 | Specified |
| SEC-25 | M | all | TC-REPORT (verification report, no open high findings) | S, R | A | M5 | Specified |

### 2.6 Legal and regulatory compliance

| Req. | Pri. | Evidence | Document | Owner | Milestone | Status |
| --- | --- | --- | --- | --- | --- | --- |
| LEG-01 | M | Checklist for the Law of the Republic of Kazakhstan | legal-compliance-checklist.md part A (planned, not yet written) | A | pre-defense 1 | Planned, legal points need supervisor review |
| LEG-02 | M | Checklist for the GDPR | legal-compliance-checklist.md part B (planned, not yet written) | A | pre-defense 1 | Planned, legal points need supervisor review |
| LEG-03 | S | DPIA-style analysis | `docs/dpia-summary.md` (not yet written) | A | M5 | Specified |
| LEG-04 | C | Privacy notice shown, acceptance recorded | TC-F-NOTICE | F, B | M2 | Specified |

## 3. Threat → requirements (reverse view)

| Threat | Requirements that mitigate it | Test IDs |
| --- | --- | --- |
| T1 Brute force | SEC-02, 03, 04, AUD-05 | TC-U-PWD-01, TC-I-RATE-01/02, TC-I-LOGIN-UNIFORM, TC-I-AUDIT-AUTH |
| T2 Forged or stolen JWT | SEC-05, 06, 08 | TC-U-JWT-01..04, TC-I-REFRESH-01..03, TC-I-INACTIVE |
| T3 IDOR | SEC-10, 11 | TC-M-MATRIX, TC-I-IDOR |
| T4 `specialists_only` leakage | SEC-10, 12 | TC-I-VIS |
| T5 Former specialist keeps access | SEC-08, 10, 11 | TC-I-REVOKE |
| T6 Role set through request body | SEC-13, 14 | TC-I-MASS, TC-I-ADMINREG |
| T7 SQL injection | SEC-20 | TC-S-SQLI, TC-CI-SQLSTATIC |
| T8 Stored XSS | SEC-21 | TC-F-XSS, TC-S-HEADERS |
| T9 CSRF | SEC-22 | TC-S-CORS |
| T10 Repudiation | AUD-01, 02, 03, 05 | TC-I-AUDIT-DATA, TC-I-AUDIT-IMMUT, TC-I-DIARY-VER, TC-I-AUDIT-AUTH |
| T11 Audit log tampering | AUD-02 | TC-I-AUDIT-IMMUT |
| T12 Leak through logs and errors | PRV-04, SEC-23 | TC-I-LOGS, TC-CI-PII, TC-S-ERRORS |
| T13 Database dump or backup exposed | SEC-01, 07, PRV-03, 03a | TC-R-ENC, TC-I-FLE, TC-CI-SECRET |
| T14 Credentials in Git | SEC-07 | TC-CI-SECRET |
| T15 Denial of service | SEC-03, 23 | TC-L-RATE-03, TC-L-OVERLOAD, TC-I-BODYLIMIT |
| T16 Vulnerable dependency | SEC-24 | TC-CI-DEPS |
| T17 Traffic interception | PRV-01 | TC-S-TLS |
| T18 Phishing | SEC-02, 06, 08 | documented residual risk |

Every threat T1 to T18 has at least one requirement and one test. Requirements without a threat (PRV-02, 05, 06, 07, 08, AUD-04, LEG-01 to 04) are driven by privacy law and transparency, not by an attack scenario.

## 4. Domain-model alignment

The Go domain model and HTTP response DTOs now represent the following requirement-driven fields. Persistence constraints and service behavior remain implementation work for the backend milestone.

| Requirement | Domain-model alignment |
| --- | --- | --- |
| AUD-01, AUD-05 | `AuditAction` and `AuditEvent` support authentication actions, source IP, details and a privacy-safe attempted-identifier hash. |
| SEC-06 | `RefreshToken` contains a server-side hash, expiry, rotation lineage and revocation state. |
| SEC-03 | `User` contains failed-login and lockout-window state. |
| SEC-14 | `User` contains an explicit specialist approval status. |
| PRV-07 | `ConsentRecord` contains child, guardian, policy version and consent time. |
| AUD-03 | `DiaryEntryVersion` retains entry content and metadata per version, including actor and UTC change time. |
| SEC-13, PRV-04 | `UserResponse` excludes `PasswordHash`; secret-bearing domain fields are marked non-serializable and are not present in response DTOs. |
| SEC-11 | `ChildGuardian.Relationship` retains parent/guardian values; `IsPrimary` remains the source for the primary-guardian rule. |
| PRV-02 | `SupportSession.Title` remains free text and must be treated as sensitive and escaped on output. |
