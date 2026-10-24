# Initial Functional and Quality Requirements

**Status:** Draft for pre-defense 1; assumptions pending user validation. Synchronized with [srs.md](srs.md) on 23 October 2026; if the two ever differ, the SRS is authoritative.  
**Traceability:** Security/privacy IDs remain in [security-privacy-requirements.md](security-privacy-requirements.md) and [traceability-matrix.md](traceability-matrix.md).

Priority: **M** = must for MVP; **S** = should; **C** = could. Acceptance criteria describe planned verification, not completed results.

## Functional requirements

| ID | Requirement | Priority | Acceptance criterion |
|---|---|---:|---|
| FR-01 | A user can register and sign in with an individual account. | M | A valid account can sign in; invalid credentials return a generic failure; account and session behavior meets SEC-01–08. |
| FR-02 | A Parent can view linked child profiles and only the primary guardian can make primary-only profile changes. | M | A linked Parent reads the profile; a Parent without a relationship receives 404; a non-primary guardian attempting a primary-only change receives 403. |
| FR-03 | A primary Parent or Admin can create and end a Specialist assignment to a child. | M | An authorized primary Parent or Admin can create/end the assignment; ending it removes the Specialist's child access on the next request, including with a previously issued token. |
| FR-04 | A Parent or assigned Specialist can view support sessions for a related child, subject to the access matrix. | M | An authorized actor receives permitted session fields; an actor without a child relationship receives 404. |
| FR-05 | A Parent or Specialist can create and update support-session details permitted to their role. | M | Invalid fields are rejected; a forbidden update is denied; an accepted change has an audit event. |
| FR-06 | A Parent or Specialist can create a diary entry with a visibility value defined by the access matrix: `shared` or `specialists_only`. | M | Entry creation requires author, child, timestamp, content and one of the matrix values `shared` or `specialists_only`; missing or other values are rejected. Parent-created entries are `shared` only, as specified in the matrix. |
| FR-07 | Diary visibility is enforced on server-side list, detail, search and export paths for `shared` and `specialists_only` entries. | M | A Parent receives `shared` entries only and never receives `specialists_only` content through list, detail, search, export or error responses. A Specialist with an active relationship can read `shared` and `specialists_only` entries, as specified in the matrix. |
| FR-08 | Authorized users can inspect diary edit history; edits retain prior versions. | M | An edit produces a prior version with actor and timestamp; a user lacking access cannot inspect versions. |
| FR-09 | The system records audit events for child-data access and changes. | M | Each create/read/update/delete/export action on child-related resources produces exactly one matching event, including denied outcomes; child-data deletion in FR-16 is included, and events contain no diary text. |
| FR-10 | The interface provides Parent and Specialist profile, session and diary flows. | M | Follow the five-participant protocol in [the usability plan](frontend/usability-plan.md); assign each task only to a role permitted to perform it, and report outcomes without claiming results before the study. |
| FR-11 | Child and role context is visible in the interface. | S | Child and role context are visible on every child-specific screen; switching child updates all data views. |
| FR-12 | Only the primary Parent can request a full export of permitted records for a linked child. | S | Export contains the linked child profile, sessions, and `shared` diary entries only; the action is audited. A non-primary Parent cannot request the full export. |
| FR-13 | An Admin can manage accounts and assignments within the access matrix. | M | Admin can create/deactivate accounts and create/end assignments; admin operations do not expose diary content. |
| FR-14 | An Admin can inspect permitted account, assignment and system audit information. | S | Admin can view system audit events and child metadata only where the matrix permits; diary content is absent. |
| FR-15 | A Specialist with an active `ChildSpecialist` relationship can view the linked child profile; an Admin can view child profile metadata only. | M | A Specialist with an active relationship can view the related child's profile; without an active relationship the request receives 404. An Admin receives metadata only, as specified in the access matrix. |
| FR-16 | A primary Parent can request deletion of a linked child's data; an Admin may carry it out only on a documented request. | S | The request is verified, fulfilled within the documented retention/deletion period, audited, and does not expose diary text to an Admin. |
| FR-17 | An Admin can export child metadata only on a documented request. | S | The export contains metadata only, excludes all diary content, is restricted to documented requests, and is audited. |

## Non-functional requirements

| ID | Requirement | Priority | Verification |
|---|---|---:|---|
| NFR-01 | Security: Apply the security/privacy IDs above. In particular, enforce backend RBAC, object relationships, diary visibility, audit and session controls as specified by Aknur. | M | test/review per source requirements and verification plan |
| NFR-02 | Performance: **Proposed target, not yet validated:** read API p95 latency below 300 ms at 50 concurrent virtual users over 5 minutes on a single-node test deployment, with read auditing enabled. | S | test with k6 or vegeta; report hardware and results |
| NFR-03 | Performance: **Proposed target, not yet validated:** error rate below 1% in the same normal-load run. Under a ramp to 5× normal load, no crash and excess requests receive 429 or 503. | S | load test; report hardware and results |
| NFR-04 | Usability: Follow the protocol and success criteria in [usability-plan.md](frontend/usability-plan.md): five participants, at least 80% of assigned tasks completed without prompts, SUS ≥68, and no critical visibility/consent errors. | S | Record task outcomes, errors, assistance, time, and SUS; report limitations. |
| NFR-05 | Usability: Support current desktop and mobile browser viewports and keyboard navigation, with visible focus, labels and semantic headings. | S | review/manual accessibility check |
| NFR-06 | Privacy: Development and evaluation use synthetic data only; child data is minimized and sensitive values are excluded from logs as specified by PRV-02, PRV-04 and PRV-08. | M | review data inventory, fixtures and logs per source requirements |

## Actors and permissions summary

| Actor | Profile | Sessions | Diary | Assignment | Audit |
|---|---|---|---|---|---|
| Guest | No child access | No access | No access | No access | No access |
| Parent/guardian | Read linked child; primary guardian may update | Read linked child; permitted changes per API contract | Read guardian-visible; create allowed; visibility enforced | Create/end specialist assignment (primary guardian only) | View access events for linked child |
| Specialist | Read assigned child subset | Read/create/update assigned sessions within contract | Read guardian-visible and specialist-only; create allowed | No direct assignment management | No general audit access |
| Admin | Manage accounts/assignments; no diary text by default | No content access by default | No diary content | Create/end assignments | View permitted system/child audit metadata, never diary text; metadata export only on documented request |

This is an initial product matrix and must be reconciled with the detailed security matrix before implementation. Legal duties and child/teen consent rules are open questions, not inferred from this matrix.

## Open questions

1. Which fields and actors are essential in local practice? Initial evidence: anonymous survey, see [evidence-to-requirements](research/evidence-to-requirements.md).
2. What consent/assent and guardian verification model is approved for the deployment context?
3. Specialists may create diary entries for children with an active assignment; parent-created entries remain `shared` only. Confirm with users whether specialist-only notes should be separate session notes or diary entries, and document the agreed meaning of `specialists_only`.
4. What language(s), low-connectivity behaviour, and accessibility targets are required?
5. Which retention period and hosting region are permissible? Confirm with supervisor/legal reviewer.
6. Should child/teen participation or access change at a particular age? Requires legal and institutional decision.
