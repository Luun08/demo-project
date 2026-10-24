# Data Inventory

**Project:** SEN Support Platform
**Owner:** Ondasyn Aknur (SE-2420), Security, Privacy & Quality Assurance
**Status:** Draft for pre-defense 1 (24 October)

Implements PRV-02 (data minimisation: every field has a documented purpose) and supports the GDPR Art. 30 record and the checklist in the legal compliance checklist (planned, not yet written). Fields are taken from `backend/internal/domain`. Retention periods are proposals to be confirmed with the supervisor (PRV-06, priority C).

**Classes** (from section 2 of the requirements): ID = child identity (high), DEV = child development data (very high, assumed health-related), COORD = coordination data (medium-high), ACC = account data, AUD = audit data.

**Readers** use the access matrix: P = parent or guardian with a relationship, S = specialist with an active assignment, A = admin, sys = system only.

## 1. Fields in the current domain model

### 1.1 `User`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `ID` | Internal identifier, used in logs and audit | ACC | sys | Life of account, then kept in audit |
| `Email` | Login identifier and contact | ACC | own user, A | Until account deletion |
| `PasswordHash` | Authentication (argon2id or bcrypt) | ACC, credential | sys only, never serialised | Until account deletion |
| `FirstName`, `LastName` | Show who is involved in a child's support | ACC | own user, P and S for people related to the same child, A | Until account deletion |
| `Role` | Authorization | ACC | own user, A | Until account deletion |
| `Status` | Block inactive accounts (SEC-08) | ACC | A | Until account deletion |
| `CreatedAt`, `UpdatedAt` | Support and audit | ACC | A | Until account deletion |

### 1.2 `SpecialistProfile`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `Specialty` | Parents choose a suitable specialist | ACC | P and S related to the specialist, A | Until account deletion |
| `Organization` | Same | ACC | same | Until account deletion |
| `Bio` | Same, optional free text | ACC | same | Until account deletion |

### 1.3 `Child`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `ID` | Internal identifier | ID | sys | Until deletion of child data |
| `FirstName` | Identify the child to the people who support them | ID | P, S (rel); A sees metadata only | Until deletion request or end of support plus the defined period |
| `LastName` | Same | ID | same | same |
| `BirthDate` | Age-appropriate planning of support | ID | same | same |
| `CreatedAt`, `UpdatedAt` | Audit and support | ID | P, S (rel), A (metadata) | same |

Note: the combination of name, birth date and the fact that the child is in a SEN support service is itself sensitive, because it reveals a special need.

### 1.4 `ChildGuardian` and `ChildSpecialist`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `ChildID`, `GuardianID`, `Relationship` | Object-level authorization (SEC-11) | COORD | P (rel), A | While the link exists, then kept only in audit |
| `IsPrimary` | Only the primary guardian manages profile, guardians, assignments | COORD | P (rel), A | same |
| `ChildSpecialist.AssignedBy`, `AssignedAt` | Accountability for who granted access | COORD | P (rel), A | same |
| `ChildSpecialist.EndedAt` | End of access (SEC-11, T5) | COORD | P (rel), A | same |

### 1.5 `SupportSession`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `ChildID`, `SpecialistID`, `CreatedBy` | Coordination of who supports which child | COORD | P, S (rel), A aggregate only | Until deletion of child data |
| `Title` | Short description of the session. Free text, may reveal a health topic, so it is treated as sensitive and escaped on output (T8) | COORD, possibly DEV | P, S (rel) | same |
| `StartsAt`, `EndsAt` | Scheduling | COORD | P, S (rel), A aggregate only | same |
| `Mode` (online, in person) | Scheduling | COORD | P, S (rel) | same |
| `Status` | Scheduling | COORD | P, S (rel), A aggregate only | same |
| `CreatedAt`, `UpdatedAt` | Audit | COORD | P, S (rel) | same |

### 1.6 `DiaryEntry`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `ID`, `ChildID` | Link to child | DEV | sys | Until deletion of child data |
| `AuthorID` | Accountability and edit rights (own entries) | DEV | P, S (rel) | same |
| `Type` (observation, progress, recommendation) | Structure of the diary | DEV | P (shared), S | same |
| `Visibility` (shared, specialists_only) | Server-side filtering (SEC-12) | DEV | P (shared), S | same |
| `Content` | The development record itself | DEV, very high | P (shared only), S (shared and specialists_only), never A | same; field-level encryption is a target (PRV-03a) |
| `ObservedAt`, `CreatedAt`, `UpdatedAt` | Timeline and history | DEV | same as `Content` | same |

### 1.7 `AuditEvent`

| Field | Purpose | Class | Readers | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `ID` | Identifier | AUD | A | Legal minimum, to be confirmed |
| `ActorID` | Who acted | AUD | A, P (access events for own child) | same |
| `Action`, `Resource`, `ResourceID`, `Outcome` | What happened and whether it was allowed | AUD | same | same |
| `RequestID` | Correlate with logs | AUD | A | same |
| `OccurredAt` | When | AUD | same | same |

Audit events hold identifiers only, never diary text, passwords or tokens (PRV-04, AUD-05).

## 2. Requirement-driven domain fields

| Entity and field | Needed for | Purpose | Class | Retention (proposal) |
| --- | --- | --- | --- | --- |
| `AuditEvent.SourceIP` | AUD-05 | Detect brute force and misuse | AUD (IP address is personal data) | Short period, for example 90 days, then removed or truncated |
| `AuditEvent` attempted identifier (hashed or truncated) | AUD-05 | Failed logins for unknown users | AUD | Same |
| `RefreshToken` (hash, expiry, revoked-at) | SEC-06 | Session continuation and revocation | ACC | Until expiry or revocation plus a short period |
| `ConsentRecord` (child, guardian, policy version, time) | PRV-07 | Evidence of consent | COORD | Kept as long as the data is processed, then as proof for the defined period |
| `DiaryEntryVersion` | AUD-03 | History of edits | DEV | Same as the diary |
| Specialist approval status | SEC-14 | Only approved specialists get accounts | ACC | Until account deletion |
| Failed-login counters | SEC-03 | Rate limiting and lockout | ACC | Rolling window, for example 15 minutes |

## 3. Data deliberately not collected

To satisfy minimisation, the prototype does not collect: national identification number (IIN), home address, phone number of the child, photo of the child, diagnosis codes or medical documents, school or class, files and attachments, location data, device identifiers, analytics or advertising trackers. If any of these becomes necessary, a purpose and a requirement must be added here first.

## 4. Open points

1. Retention periods in sections 1 and 2 are proposals; the legal minimum for audit data is not yet confirmed.
2. Whether `SupportSession.Title` should stay free text or become a choice from a fixed list (reduces the risk of health details in the title).
3. Reminders and notifications (promised on the frontend) are not in the domain model. An email or push message that names a child would be a new data flow and needs its own entry and requirement before it is built.
4. Time values are stored in UTC (to be agreed with the backend developer).
