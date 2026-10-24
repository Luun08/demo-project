# Security and Privacy Requirements

**Project:** SEN Support Platform
**Owner:** Ondasyn Aknur (SE-2420), Security, Privacy & Quality Assurance
**Status:** Draft for pre-defense 1 (24 October), revision 2

## 1. Purpose and scope

This document defines the security and privacy requirements of the SEN Support Platform, a system that stores personal data about children with special educational needs (SEN), their guardians and the specialists who support them. It covers authentication, session management, authorization, data protection, auditing and legal compliance. Functional requirements of the product are specified separately; the identifiers below (SEC-, PRV-, AUD-, LEG-) are used so that each requirement can be traced to a test in the [verification plan](verification-plan.md).

## 2. Data classification

| Class | Examples (from the domain model) | Sensitivity |
| --- | --- | --- |
| Child identity | `Child.FirstName`, `LastName`, `BirthDate` | High: personal data of a minor |
| Child development data | `DiaryEntry.Content` (observations, progress, recommendations) | Very high: can reveal health or disability, i.e. a special category of data |
| Coordination data | `SupportSession` (time, specialist, mode, status), `ChildGuardian`, `ChildSpecialist` | Medium-high |
| Account data | `User.Email`, names, `PasswordHash`, `SpecialistProfile` | High (credentials) / medium |
| Audit data | `AuditEvent` | High integrity requirement, may reference personal data |

Assumption (to be confirmed with the supervisor): diary content about a child with SEN is treated as health-related data and therefore as a special category under GDPR Art. 9 and as sensitive personal data under the law of the Republic of Kazakhstan.

## 3. Requirements

Priority: **M** = must (mandatory for the diploma prototype), **S** = should, **C** = could.

### 3.1 Authentication and session management

| ID | Requirement | Pri. | Acceptance criterion |
| --- | --- | --- | --- |
| SEC-01 | Passwords are stored only as salted hashes using a modern adaptive algorithm (argon2id or bcrypt). | M | Database inspection shows no plaintext or reversible passwords; unit test verifies that two hashes of the same password differ. |
| SEC-02 | Password policy: minimum 10 characters, check against a list of common passwords. | M | Registration with a weak password is rejected with a clear error (automated test). |
| SEC-03 | Login is protected against brute force: rate limiting per submitted account identifier and per IP, with temporary lockout or increasing delay. The limit is counted for the submitted identifier whether or not the account exists, so that lockout does not reveal which accounts exist (SEC-04). | M | After N failed attempts (configurable, default 5 per 15 min) further attempts return HTTP 429 until the window expires, with the same status, body and timing behaviour for existing and unknown emails (automated test with both). |
| SEC-04 | Login errors do not reveal whether an email exists. | M | For an unknown email and for a wrong password the HTTP status and response body are identical, and the difference between median response times over 200 attempts each is below 50 ms (password hashing is also run for unknown emails). |
| SEC-05 | Access tokens (JWT) are short-lived (15 minutes or less), signed with a strong key, and validated for signature, expiry, issuer and algorithm. The `none` algorithm and algorithm switching are rejected. | M | Tests with expired, tampered, unsigned and wrong-algorithm tokens all return HTTP 401. |
| SEC-06 | Refresh tokens are rotated on use, stored hashed server-side and revocable; logout and password change invalidate them. (Raised from S to M: threat T2 relies on rotation and revocation.) | M | After logout the refresh token cannot obtain a new access token; reuse of a rotated token is rejected. |
| SEC-07 | The signing key and all secrets are loaded from environment configuration and are never committed to the repository. | M | Secret scanning of the repository finds no secrets; `.env.example` contains placeholders only. |
| SEC-08 | Inactive accounts (`UserStatusInactive`) cannot authenticate and existing tokens are rejected. | M | Deactivating a user causes the next request with an old token to fail. |

### 3.2 Authorization

| ID | Requirement | Pri. | Acceptance criterion |
| --- | --- | --- | --- |
| SEC-10 | Every API endpoint enforces role-based access control (RBAC) on the server; the UI is never the only barrier. Default is deny. | M | The access matrix in [rbac-and-threat-model.md](rbac-and-threat-model.md) is implemented as a table-driven test with 100% of cells passing. |
| SEC-11 | Object-level authorization: access to a child's data requires an active relationship (`ChildGuardian`, or `ChildSpecialist` with `EndedAt` empty or in the future). Response rule: **404** when the actor has no relationship to the child (existence is not confirmed); **403** only when the relationship exists but the role or the primary-guardian right is insufficient for the action. | M | A parent requesting another family's child receives 404; a non-primary guardian editing the profile receives 403; a specialist whose assignment has ended loses access immediately (404), including with a token issued earlier. |
| SEC-12 | Diary visibility is enforced on the server: entries with `specialists_only` are never returned to guardians. | M | Test: guardian listing a child's diary never receives `specialists_only` entries, including via search, export and error messages. |
| SEC-13 | Role and ownership are taken from the verified token and database, never from client-supplied fields (prevents mass assignment and privilege escalation). | M | Attempt to register or update with `"role":"admin"` is ignored or rejected. |
| SEC-14 | Administrator accounts are created only by an existing administrator or by a controlled bootstrap procedure. Public registration is available for parents (and specialists after approval) only. | M | Public registration endpoint cannot create an admin. |
| SEC-15 | Administrators manage accounts and assignments but cannot read diary content. Admin export returns metadata only; admin deletion removes diary rows without displaying them. (Raised from S to M: the access matrix and the least-privilege principle depend on it.) | M | Admin role has no read permission on `DiaryEntry.Content` in the access matrix; the admin export contains no diary text. |

### 3.3 Data protection and privacy by design

| ID | Requirement | Pri. | Acceptance criterion |
| --- | --- | --- | --- |
| PRV-01 | All client-server traffic uses TLS 1.2 or higher; HSTS is enabled. | M | Scan of the deployed configuration shows no plain-HTTP access to the API. |
| PRV-02 | Data minimisation: only data needed for coordination and the diary is collected; no unnecessary identifiers of the child. | M | Data inventory table is reviewed; each field has a documented purpose. |
| PRV-03 | The database and its backups are encrypted at rest (database- or disk-level encryption). (Raised from S to M: threat T13 depends on it.) | M | Configuration review shows encryption at rest enabled for the database volume and for backups. |
| PRV-03a | Field-level encryption of diary content with a key stored outside the database. | S | A direct database dump does not expose diary text in readable form. |
| PRV-04 | Logs and error messages contain no passwords, tokens or child personal data; only identifiers are logged. | M | Log review in tests finds no sensitive values; secret/PII regex check in CI. |
| PRV-05 | A primary guardian can export and request deletion of the child's data; deletion is performed within a documented period. The guardian export contains the profile, sessions and `shared` diary entries, and never `specialists_only` entries (SEC-12). | S | Export and deletion flows are demonstrated and covered by integration tests; the export of a guardian contains no `specialists_only` entry. |
| PRV-06 | Retention policy: data is deleted or anonymised after the defined retention period or after account deletion, except audit data kept for the legal minimum. | C | Retention rules documented; a scheduled-job test removes expired data. |
| PRV-07 | Consent: a guardian's consent to processing of the child's data is recorded (who, when, which version of the policy). | S | Consent record is created at child registration and is visible in the audit trail. |
| PRV-08 | Test and demo environments use synthetic data only; real children's data is never used in development. | M | Seed data is generated; documented in the repository. |

### 3.4 Audit and monitoring

| ID | Requirement | Pri. | Acceptance criterion |
| --- | --- | --- | --- |
| AUD-01 | Every create, read, update, delete and export action on child-related resources produces an `AuditEvent` (actor, action, resource, resource id, outcome, request id, time). | M | Integration test performs each action and asserts exactly one matching event, including `denied` outcomes. |
| AUD-02 | The audit log is append-only for application users; no API allows modifying or deleting events. | M | There is no update/delete endpoint; database role of the application lacks UPDATE/DELETE on the audit table. |
| AUD-03 | Audit records for diary changes keep the history of edits (who changed what and when). | S | Editing an entry creates a new version that can be listed by an authorized user. |
| AUD-04 | Authorized users (guardian for own child, administrator for system) can view relevant audit events. | S | Guardian sees access events for own child only. |
| AUD-05 | Authentication events (login success, login failure, logout, token refresh, lockout, password change) produce an `AuditEvent` with the actor or attempted identifier, outcome, request id, time and source IP. These events are not tied to a child resource. | M | Integration test performs each authentication action and asserts exactly one matching event; no event contains a password or a token. |

### 3.5 Application security and quality

| ID | Requirement | Pri. | Acceptance criterion |
| --- | --- | --- | --- |
| SEC-20 | All input is validated server-side (type, length, format); database access uses parameterised queries only. | M | SQL injection test payloads against all endpoints produce no data leakage or errors; static check finds no string-concatenated SQL. |
| SEC-21 | The frontend escapes output and the API sets security headers (CSP, X-Content-Type-Options, X-Frame-Options or frame-ancestors, Referrer-Policy). | M | Header check passes on all responses; stored XSS payload in diary content is rendered as text. |
| SEC-22 | CORS allows only configured origins; state-changing requests are protected against CSRF (token in `Authorization` header, or CSRF token if cookies are used). | M | Cross-origin request from a non-allowed origin is rejected. |
| SEC-23 | Request size limits and timeouts are configured; the API returns generic error messages without stack traces. | M | Oversized body returns HTTP 413; error responses contain no internal details. |
| SEC-24 | Dependencies are scanned for known vulnerabilities in CI (`govulncheck`, `npm audit`). | S | CI fails on high-severity findings. |
| SEC-25 | The system meets the OWASP Top 10 (2021) checks defined in the verification plan with no open high-severity findings at the release. | M | Verification report shows all high findings closed. |

### 3.6 Legal and regulatory compliance

| ID | Requirement | Pri. | Acceptance criterion |
| --- | --- | --- | --- |
| LEG-01 | Processing follows the principles of the Law of the Republic of Kazakhstan "On Personal Data and Their Protection" (consent, purpose limitation, security measures). | M | Compliance checklist in `docs/` maps each principle to a requirement or design decision. |
| LEG-02 | Processing follows the GDPR principles relevant to the project: lawfulness, data minimisation, storage limitation, integrity and confidentiality (Art. 5), data protection by design (Art. 25), security of processing (Art. 32). | M | Same checklist covers each article with evidence. |
| LEG-03 | A data protection impact assessment (DPIA) style analysis is prepared because the system processes data of children and potentially health-related data (GDPR Art. 35, Art. 8, Art. 9). | S | DPIA summary document is included in the repository. |
| LEG-04 | A privacy notice and terms are available to users before registration. | C | Notice is shown and acceptance recorded. |

## 4. Out of scope for the prototype

Hardware security modules, formal certification, a full DPIA signed by a data protection officer, and penetration testing by an external party. These are noted as future work.

## 5. Open questions for the supervisor

1. Is diary content to be treated formally as health data (special category)?
2. Is the guest role limited to public information pages (no access to any child data)?
3. Which deployment target is assumed (affects TLS termination and encryption at rest)?

## 6. Revision notes (revision 2)

- SEC-03: rate limit counted per submitted identifier, existing or not, so lockout does not conflict with SEC-04 (added after review before the first pull request).

- SEC-04: tolerance defined (identical status and body, median time difference below 50 ms).
- SEC-06, SEC-15, PRV-03: priority raised from S to M, because threats T2 and T13 and the access matrix depend on them. Field-level encryption is now a separate requirement, PRV-03a (S).
- SEC-11: one response rule (404 without relationship, 403 for insufficient rights), same as in the RBAC document.
- AUD-01 now covers child-related resources only; authentication events moved to the new AUD-05.
- SEC-15 and PRV-05: export content aligned with SEC-12 (guardian export has no `specialists_only` entries) and with the admin restriction (metadata only).
