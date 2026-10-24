# Access Control Model (RBAC) and Threat Model

**Project:** SEN Support Platform
**Owner:** Ondasyn Aknur (SE-2420), Security, Privacy & Quality Assurance
**Status:** Draft for pre-defense 1 (24 October), revision 2

## 1. Roles

| Role | Description | Source in code |
| --- | --- | --- |
| Guest | Unauthenticated visitor. Can see public pages, register and log in. No access to any child data. | not an account role; absence of a valid token |
| Parent | Parent or guardian linked to one or more children through `ChildGuardian`. | `RoleParent` |
| Specialist | Teacher, therapist or other professional linked to a child through an active `ChildSpecialist` assignment. | `RoleSpecialist` |
| Admin | Platform administrator: manages accounts, assignments and system settings. | `RoleAdmin` |

Note: `RoleGuest` is intentionally not a domain role because a guest has no account. Authorization code treats "no valid token" as Guest.

## 2. Authorization principles

1. **Deny by default.** Anything not explicitly allowed in the matrix is forbidden.
2. **Two checks per request:** (a) the role may perform the action (RBAC), (b) the actor has a valid relationship to the specific child (object-level check, see section 4).
3. **Server-side only.** The frontend hides controls for usability; the backend is the only enforcement point.
4. **Least privilege.** Admins manage the system but do not read diary content (SEC-15).
5. **Every decision is audited**, including denied ones (`AuditOutcomeDenied`). Data access events follow AUD-01, authentication events follow AUD-05.

## 3. Access matrix

Legend: ✔ allowed, ✖ denied, (own) only own account or own data, (rel) only for children with a valid relationship to the actor, (shared) only entries with `shared` visibility, (assigned) only the specialist's own sessions or entries.

| Resource / action | Guest | Parent | Specialist | Admin |
| --- | --- | --- | --- | --- |
| Register / log in | ✔ | ✔ | ✔ | ✔ |
| View own account | ✖ | ✔ (own) | ✔ (own) | ✔ (own) |
| Manage any user account (create, deactivate) | ✖ | ✖ | ✖ | ✔ |
| Create admin account | ✖ | ✖ | ✖ | ✔ |
| Create child profile | ✖ | ✔ | ✖ | ✖ |
| View child profile | ✖ | ✔ (rel) | ✔ (rel) | metadata only |
| Edit child profile | ✖ | ✔ (rel, primary guardian) | ✖ | ✖ |
| Link another guardian | ✖ | ✔ (rel, primary guardian) | ✖ | ✔ |
| Assign / end specialist assignment | ✖ | ✔ (rel, primary guardian) | ✖ | ✔ |
| Create support session | ✖ | ✔ (rel) | ✔ (rel) | ✖ |
| View support sessions | ✖ | ✔ (rel) | ✔ (rel) | ✖ (aggregate only) |
| Update / cancel support session | ✖ | ✔ (rel) | ✔ (rel, assigned) | ✖ |
| Create diary entry | ✖ | ✔ (rel, shared only) | ✔ (rel) | ✖ |
| Read diary entries | ✖ | ✔ (rel, shared) | ✔ (rel, shared and specialists-only) | ✖ |
| Edit diary entry | ✖ | ✔ (own entries) | ✔ (own entries) | ✖ |
| Delete diary entry | ✖ | ✔ (own entries) | ✖ (by design: specialist observations are kept for the record; edits are versioned, AUD-03) | ✖ |
| View audit events for a child | ✖ | ✔ (rel, access events) | ✖ | ✔ |
| View system-wide audit log | ✖ | ✖ | ✖ | ✔ |
| Export child data (profile, sessions, `shared` diary entries) | ✖ | ✔ (rel, primary guardian) | ✖ | ✖ |
| Export child metadata (no diary content) | ✖ | ✔ (rel, primary guardian) | ✖ | ✔ (on documented request, audited) |
| Delete child data | ✖ | ✔ (rel, primary guardian) | ✖ | ✔ (on documented request, audited; diary text is never displayed to the admin) |

The matrix is implemented as data (a table in code) and verified by a table-driven Go test: one test case per cell and role.

## 4. Object-level rules

- **Parent to child:** a row in `ChildGuardian` exists for (child, parent). Only `IsPrimary = true` may change guardians, assignments and the profile.
- **Specialist to child:** a row in `ChildSpecialist` exists with `EndedAt` null or in the future. When the assignment ends, access is lost on the next request, including for tokens issued earlier.
- **Diary visibility:** `specialists_only` entries are filtered in the query layer, not after loading, so they cannot leak through counts, search or error messages.
- **Not found vs forbidden (same rule as SEC-11):** for a child the actor has no relationship to (including a former specialist), the API responds with **404** to avoid confirming that the child exists. **403** is used only when a relationship exists but the role or the primary-guardian right is not enough for the action, for example a non-primary guardian editing the profile.
- **Admin and diary:** the admin role has no read permission on diary content. Admin export returns metadata only; admin deletion removes diary rows without displaying them.
- **Guardian export** never contains `specialists_only` entries (SEC-12).

## 5. System model and trust boundaries

```
 [Browser: React SPA]  --TLS-->  [Go API (net/http)]  -->  [PostgreSQL]
        (untrusted)                 (trusted zone)           (trusted zone)
                                          |
                                     [Audit log table]
```

Trust boundaries: (1) between the browser and the API, where all input is untrusted; (2) between the API and the database, where credentials and network access are restricted.

Assets: child identity and diary content (highest), credentials and tokens, audit log integrity, availability of the scheduling function.

Actors and attackers considered: curious or malicious authenticated user (another parent or a specialist outside the assignment), external attacker without an account, compromised account, insider with database access, former specialist whose assignment ended.

## 6. Threat model (STRIDE)

Likelihood (L) and impact (I): H high, M medium, Lo low. Ratings are the team's initial estimates and will be revised during testing.

| ID | Threat | STRIDE | L | I | Mitigation | Requirement | Test |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Attacker guesses or brute-forces passwords | Spoofing | H | H | Rate limiting, lockout, strong password policy, uniform login errors, audit of failed logins | SEC-02, 03, 04, AUD-05 | Brute-force script, response comparison |
| T2 | Stolen or forged JWT used to act as another user | Spoofing | M | H | Short expiry, strong signature key, algorithm pinning, refresh rotation, revocation | SEC-05, 06 | Tampered, expired and `alg=none` token tests |
| T3 | Parent reads another family's child by changing an ID (IDOR) | Information disclosure | H | H | Object-level checks, 404 on no relationship | SEC-11 | Cross-tenant access tests for every endpoint |
| T4 | Guardian sees `specialists_only` diary notes | Information disclosure | M | H | Visibility filtering in the query layer | SEC-12 | Visibility test across list, search, export |
| T5 | Former specialist keeps access after assignment ends | Elevation of privilege | M | H | Relationship checked on every request | SEC-11 | Revocation test with an old token |
| T6 | User sets own role to admin via request body | Elevation of privilege | M | H | Role from server data only, strict request schemas | SEC-13, 14 | Mass-assignment tests |
| T7 | SQL injection through query parameters or text fields | Tampering | M | H | Parameterised queries, validation | SEC-20 | Injection payload suite, static check |
| T8 | Stored XSS in diary text or session title | Tampering / Information disclosure | M | M | Output escaping, CSP | SEC-21 | XSS payload tests |
| T9 | Cross-site request forgery changes data | Tampering | Lo | M | Header-based tokens, strict CORS, SameSite if cookies | SEC-22 | Cross-origin test |
| T10 | User denies having read or changed a record | Repudiation | M | M | Append-only audit of reads and changes, request IDs | AUD-01, 02, 03, 05 | Audit completeness tests |
| T11 | Audit log altered or deleted by an insider | Tampering / Repudiation | Lo | H | No update/delete API, restricted database role | AUD-02 | Permission test on the database role |
| T12 | Secrets or child data leak through logs and error messages | Information disclosure | M | H | Structured logging of identifiers only, generic errors | PRV-04, SEC-23 | Log inspection test, CI pattern scan |
| T13 | Database dump or backup exposed | Information disclosure | Lo | H | Encryption at rest (mandatory), field-level encryption of diary content (target), restricted access, secrets outside the repo | PRV-03, PRV-03a, SEC-07 | Configuration review, secret scan |
| T14 | Credentials committed to Git | Information disclosure | M | H | `.gitignore`, `.env.example`, secret scanning | SEC-07 | Repository scan in CI |
| T15 | API flooded to cause denial of service | Denial of service | M | M | Rate limits, body size limits, timeouts | SEC-03, 23 | Load test with defined thresholds |
| T16 | Vulnerable dependency exploited | Tampering / Elevation | M | M | Dependency scanning in CI | SEC-24 | `govulncheck`, `npm audit` |
| T17 | Traffic intercepted on the network | Information disclosure | Lo | H | TLS 1.2+, HSTS | PRV-01 | TLS configuration scan |
| T18 | Phishing or social engineering of a parent or specialist account | Spoofing | M | H | Password policy, session limits, optional second factor (future work) | SEC-02, 06 | Documented residual risk |

## 7. Residual risks and future work

- Multi-factor authentication is not planned for the prototype (future work), so account takeover through phishing remains a residual risk (T18).
- Field-level encryption of diary content is a target (PRV-03a); the prototype relies on database- and disk-level encryption (PRV-03, mandatory).
- Penetration testing by an independent party is out of scope.

## 8. Revision notes (revision 2)

- Matrix: admin profile cell reads "metadata only"; the specialist's lack of delete right on diary entries is stated as a design decision.

- Export and delete split into separate matrix rows so that the admin never receives diary content (consistent with SEC-15).
- The 404/403 rule is stated explicitly and matches SEC-11.
- Authentication auditing (AUD-05) linked to T1 and T10.
- T13 and section 7 now reference PRV-03 (mandatory) and PRV-03a (field-level, target).
