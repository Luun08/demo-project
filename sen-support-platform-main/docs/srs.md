# Software Requirements Specification

**Project:** SEN Support Platform  
**Status:** Draft for pre-defense 1; requirements and targets are not verification results.

## 1. Purpose and scope

This document consolidates the product requirements for the prototype. The project purpose, objectives, boundaries and expected outcomes are defined in the [project proposal](proposal.md). Security and privacy controls remain specified by Aknur in [security-privacy-requirements.md](security-privacy-requirements.md); this SRS references those identifiers and does not replace that source.

## 2. Roles and scenarios

Roles below use the exact names in the access matrix in [rbac-and-threat-model.md](rbac-and-threat-model.md).

| Role | Meaning in access matrix |
|---|---|
| Guest | Unauthenticated visitor. Can see public pages, register and log in. No access to any child data. |
| Parent | Parent or guardian linked to one or more children through `ChildGuardian`. |
| Specialist | Teacher, therapist or other professional linked to a child through an active `ChildSpecialist` assignment. |
| Admin | Platform administrator: manages accounts, assignments and system settings. |

| Scenario | Description | Roles |
|---|---|---|
| SC-01 | Register, sign in, establish an authenticated session; view own account. | Guest, Parent, Specialist, Admin |
| SC-02 | Create a child profile (Parent); view a linked child profile; edit it (primary guardian only). Admin sees metadata only. | Parent, Specialist, Admin |
| SC-03 | Plan, view, update or cancel a support session within the actor's permissions. | Parent, Specialist |
| SC-04 | Create, read and edit diary entries according to role and visibility; delete own entries (Parent only). | Parent, Specialist |
| SC-05 | Inspect an authorized diary entry's version history. | Parent, Specialist |
| SC-06 | View permitted audit events: access events for a related child; system-wide log (Admin only). | Parent, Admin |
| SC-07 | Manage user accounts (Admin); link guardians and create or end specialist assignments (Admin, primary-guardian Parent). | Admin, Parent (primary guardian) |
| SC-08 | Export permitted records: full export (primary guardian), metadata-only export (Admin, on documented request, audited). | Parent (primary guardian), Admin |
| SC-09 | Delete child data (primary guardian request; Admin may fulfill a documented request, audited, without displaying diary text). | Parent (primary guardian), Admin |


## 3. Functional requirements

MoSCoW priority is stated for this SRS. Sources are repository documents; a scenario does not assert that the feature is implemented.

| ID | Description | Role | Scenario | Priority | Acceptance criterion | Verification | Source |
|---|---|---|---|---|---|---|---|
| FR-01 | A user can register and sign in with an individual account. | Guest, Parent, Specialist, Admin | SC-01 | Must | A valid account can sign in; invalid credentials return a generic failure; account and session behavior meets SEC-01–08. | test | [requirements.md](requirements.md); [security-privacy-requirements.md](security-privacy-requirements.md) |
| FR-02 | A Parent can view linked child profiles and only the primary guardian can make primary-only profile changes. | Parent | SC-02 | Must | A linked Parent reads the profile; a Parent without a relationship receives 404; a non-primary guardian attempting a primary-only change receives 403. | test | [requirements.md](requirements.md); [rbac-and-threat-model.md](rbac-and-threat-model.md), SEC-11 |
| FR-03 | A primary Parent or Admin can create and end a Specialist assignment to a child. | Parent (primary guardian), Admin | SC-07 | Must | An authorized primary Parent or Admin can create/end the assignment; ending it removes the Specialist's child access on the next request, including with a previously issued token. | test | [requirements.md](requirements.md); [rbac-and-threat-model.md](rbac-and-threat-model.md), SEC-11 |
| FR-04 | A Parent or assigned Specialist can view support sessions for a related child, subject to the access matrix. | Parent, Specialist | SC-03 | Must | An authorized actor receives permitted session fields; an actor without a child relationship receives 404. | test | [requirements.md](requirements.md); [rbac-and-threat-model.md](rbac-and-threat-model.md) |
| FR-05 | A Parent or Specialist can create and update support-session details permitted to their role. | Parent, Specialist | SC-03 | Must | Invalid fields are rejected; a forbidden update is denied; an accepted change has an audit event. | test | [requirements.md](requirements.md); [rbac-and-threat-model.md](rbac-and-threat-model.md); AUD-01 |
| FR-06 | A Parent or Specialist can create a diary entry with a visibility value defined by the access matrix: `shared` or `specialists_only`. | Parent, Specialist | SC-04 | Must | Entry creation requires author, child, timestamp, content and one of the matrix values `shared` or `specialists_only`; missing or other values are rejected. Parent-created entries are `shared` only, as specified in the matrix. | test | [requirements.md](requirements.md); [rbac-and-threat-model.md](rbac-and-threat-model.md) |
| FR-07 | Diary visibility is enforced on server-side list, detail, search and export paths for `shared` and `specialists_only` entries. | Parent, Specialist | SC-04 | Must | A Parent receives `shared` entries only and never receives `specialists_only` content through list, detail, search, export or error responses. A Specialist with an active relationship can read `shared` and `specialists_only` entries, as specified in the matrix. | test | [requirements.md](requirements.md); [rbac-and-threat-model.md](rbac-and-threat-model.md), SEC-12 |
| FR-08 | Authorized users can inspect diary edit history; edits retain prior versions. | Parent, Specialist | SC-05 | Must | An edit produces a prior version with actor and timestamp; a user lacking access cannot inspect versions. | test | [requirements.md](requirements.md); AUD-03 |
| FR-09 | The system records audit events for child-data access and changes. | Parent, Specialist, Admin | SC-04, SC-06, SC-07, SC-08, SC-09 | Must | Each create/read/update/delete/export action on child-related resources produces exactly one matching event, including denied outcomes; child-data deletion in SC-09 is included, and events contain no diary text. | test | [requirements.md](requirements.md); AUD-01 |
| FR-10 | The interface provides Parent and Specialist profile, session and diary flows. | Parent, Specialist | SC-02, SC-03, SC-04 | Must | Conduct the five-participant protocol in [usability-plan.md](frontend/usability-plan.md): two parents, two specialists, and one administrator/coordinator; assign each task only to a role allowed to perform it. Use synthetic data and record task completion, errors, assistance, time, and SUS. No participant results are claimed yet. | demo | [requirements.md](requirements.md) |
| FR-11 | Child and role context is visible in the interface. | Parent, Specialist | SC-02, SC-03, SC-04 | Should | Child and role context are visible on every child-specific screen; switching child updates all data views. | review | [requirements.md](requirements.md) |
| FR-12 | Only the primary Parent can request a full export of permitted records for a linked child. | Parent | SC-08 | Should | Export contains the linked child profile, sessions, and `shared` diary entries only; the action is audited. A non-primary Parent cannot request the full export. | test | [requirements.md](requirements.md); PRV-05; [rbac-and-threat-model.md](rbac-and-threat-model.md) |
| FR-13 | An Admin can manage accounts and assignments within the access matrix. | Admin | SC-07 | Must | Admin can create/deactivate accounts and create/end assignments; admin operations do not expose diary content. | test | [rbac-and-threat-model.md](rbac-and-threat-model.md); SEC-15 |
| FR-14 | An Admin can inspect permitted account, assignment and system audit information. | Admin | SC-06, SC-07 | Should | Admin can view system audit events and child metadata only where the matrix permits; diary content is absent. | test | [rbac-and-threat-model.md](rbac-and-threat-model.md); AUD-04; SEC-15 |
| FR-15 | A Specialist with an active `ChildSpecialist` relationship can view the linked child profile; an Admin can view child profile metadata only. | Specialist, Admin | SC-02 | Must | A Specialist with an active relationship can view the related child's profile; without an active relationship the request receives 404. An Admin receives metadata only, as specified in the access matrix. | test | [rbac-and-threat-model.md](rbac-and-threat-model.md) |
| FR-16 | A primary Parent can request deletion of a linked child's data; an Admin may fulfill a documented request. | Parent (primary guardian), Admin | SC-09 | Should | Verify the request, fulfill it within the documented deletion period, record an audit event, and never expose diary text to an Admin. | test/review | [security-privacy-requirements.md](security-privacy-requirements.md), PRV-05; [rbac-and-threat-model.md](rbac-and-threat-model.md) |
| FR-17 | An Admin can export child metadata only on a documented request. | Admin | SC-08 | Should | Export contains metadata only, excludes diary content, is limited to documented requests, and is audited. | test/review | [security-privacy-requirements.md](security-privacy-requirements.md), PRV-05; [rbac-and-threat-model.md](rbac-and-threat-model.md) |

## 4. Non-functional requirements

Security requirement details and acceptance criteria are maintained in Aknur's [security and privacy requirements](security-privacy-requirements.md) and its [access matrix](rbac-and-threat-model.md). This SRS does not restate or alter them. Referenced security/privacy IDs are **SEC-01–08, SEC-10–15, SEC-20–25; PRV-01–08 including PRV-03a; AUD-01–05; LEG-01–04**. The security and privacy requirements document defines no SEC-09 or SEC-16–19; those identifiers are absent, not omitted requirements. Priorities and acceptance criteria for defined IDs remain authoritative in the source document. Listing LEG IDs is traceability, not a claim of legal compliance.

| ID | Category | Requirement / measurable target | Role | Scenario | Priority | Verification | Source |
|---|---|---|---|---|---|---|---|
| NFR-01 | Security | Apply the security/privacy IDs above. In particular, enforce backend RBAC, object relationships, diary visibility, audit and session controls as specified by Aknur. | Guest, Parent, Specialist, Admin | SC-01–SC-08 | Must | test/review per source requirements and verification plan | [security-privacy-requirements.md](security-privacy-requirements.md); [verification-plan.md](verification-plan.md) |
| NFR-02 | Performance | **Proposed target, not yet validated:** read API p95 latency below 300 ms at 50 concurrent virtual users over 5 minutes on a single-node test deployment, with read auditing enabled. | Parent, Specialist, Admin | SC-02–SC-06 | Should | test with k6 or vegeta; report hardware and results | [verification-plan.md](verification-plan.md), §3 |
| NFR-03 | Performance | **Proposed target, not yet validated:** error rate below 1% in the same normal-load run. Under a ramp to 5× normal load, no crash and excess requests receive 429 or 503. | Parent, Specialist, Admin | SC-01–SC-08 | Should | load test; report hardware and results | [verification-plan.md](verification-plan.md), §3 |
| NFR-04 | Usability | Follow the protocol and success criteria in [usability-plan.md](frontend/usability-plan.md): five participants, at least 80% of assigned tasks completed without prompts, SUS ≥68, and no critical visibility/consent errors. | Parent, Specialist, Admin | SC-01–SC-08 | Should | Record assigned-task outcomes, assistance, time, and SUS; report limitations | [usability-plan.md](frontend/usability-plan.md) |
| NFR-05 | Usability | Support current desktop and mobile browser viewports and keyboard navigation, with visible focus, labels and semantic headings. | Parent, Specialist, Admin | SC-01–SC-08 | Should | review/manual accessibility check | [requirements.md](requirements.md), NFR-05 |
| NFR-06 | Privacy | Development and evaluation use synthetic data only; child data is minimized and sensitive values are excluded from logs as specified by PRV-02, PRV-04 and PRV-08. | Parent, Specialist, Admin | SC-01–SC-08 | Must | review data inventory, fixtures and logs per source requirements | [data-inventory.md](data-inventory.md); security/privacy requirements |

## 5. Traceability matrix

Every FR/NFR in this SRS is mapped to at least one role and scenario.

| Requirement | Role(s) | Scenario(s) |
|---|---|---|
| FR-01 | Guest, Parent, Specialist, Admin | SC-01 |
| FR-02 | Parent | SC-02 |
| FR-03 | Parent (primary guardian), Admin | SC-07 |
| FR-15 | Specialist, Admin | SC-02 |
| FR-16 | Parent (primary guardian), Admin | SC-09 |
| FR-17 | Admin | SC-08 |
| FR-04 | Parent, Specialist | SC-03 |
| FR-05 | Parent, Specialist | SC-03 |
| FR-06 | Parent, Specialist | SC-04 |
| FR-07 | Parent, Specialist | SC-04 |
| FR-08 | Parent, Specialist | SC-05 |
| FR-09 | Parent, Specialist, Admin | SC-04, SC-06, SC-07, SC-08, SC-09 |
| FR-10 | Parent, Specialist | SC-02, SC-03, SC-04 |
| FR-11 | Parent, Specialist | SC-02, SC-03, SC-04 |
| FR-12 | Parent (primary guardian) | SC-08 |
| FR-13 | Admin | SC-07 |
| FR-14 | Admin | SC-06, SC-07 |
| NFR-01 | Guest, Parent, Specialist, Admin | SC-01–SC-08 |
| NFR-02 | Parent, Specialist, Admin | SC-02–SC-06 |
| NFR-03 | Parent, Specialist, Admin | SC-01–SC-08 |
| NFR-04 | Parent, Specialist, Admin | SC-01–SC-08 |
| NFR-05 | Parent, Specialist, Admin | SC-01–SC-08 |
| NFR-06 | Parent, Specialist, Admin | SC-01–SC-08 |

## 6. Assumptions and open decisions

- Guest is present in the access matrix and the proposal, so SC-01 includes Guest only for public access, registration and login; Guest has no child-data access. Include Guest in diagrams only for those minimal interactions.
- Role labels above preserve the access matrix exactly. The proposal uses “Parent or legal guardian” and `requirements.md` uses “Parent/guardian”; these are descriptive variations, not replacement role names.
- The access matrix allows a Specialist to view child profiles only within a relationship and allows Admin profile metadata only. Profile scenarios do not grant broader permissions.
- Performance and usability thresholds are proposed study targets, not measured results. The usability-plan protocol defines its participant mix and success measures. No uptime SLA is specified for this academic prototype.
- Exploratory survey findings from seven respondents are documented in [evidence-to-requirements](research/evidence-to-requirements.md). They are preliminary and not representative; no usability-study results, supervisor approval, legal review, GDPR compliance or Kazakhstan-law compliance are claimed. Legal classification and deployment constraints remain open.
- Priorities in this SRS are product priorities. The security/privacy source has its own M/S/C priorities; those remain authoritative for the referenced IDs.

## 7. Consistency check

Compared with [verification-plan.md](verification-plan.md), draft revision 2:

- The verification plan's cross-family access target is **404** (0 successful reads/writes). An earlier draft example used 403; SRS follows SEC-11. 403 applies only when a relationship exists but the actor lacks the required right.
- The verification plan's load target, p95 below 300 ms for read endpoints at 50 virtual users for 5 minutes, is reflected as NFR-02 and explicitly marked proposed/not validated. Its 50-user workload is based on an assumption of 20 concurrent pilot users, not confirmed usage evidence.
- FR-10 follows the usability plan: five participants, role-appropriate tasks, task completion/assistance/time, SUS, and no critical visibility/consent errors. Results have not been collected.
- The plan separates authentication and child-resource audit events (AUD-05 and AUD-01); FR-09 covers child-data events and FR-01 covers account/session checks. AUD-05 includes password-change events, which the verification-plan §3 audit metric omits although §2 lists AUD-05 for integration. The rate-limit metric cites SEC-04 for uniform behavior; SEC-03 defines rate limiting and SEC-04 defines response uniformity. No audit test result is claimed.
- The verification plan measures overload behavior (no crash; excess requests receive 429 or 503); this is not an uptime SLA. The SRS does not claim a separate uptime target.
- The verification plan lists access-matrix coverage and security checks, but does not define usability task-time/participant thresholds or an uptime evaluation window. The usability-plan criteria are the only usability thresholds; task results remain pending.
- `requirements.md` and this SRS use the access matrix for assignment, export, diary visibility and deletion permissions.
- The verification plan's section 2 test-level table does not explicitly list coverage for PRV-02, PRV-03, PRV-03a, PRV-05, PRV-06, PRV-07 or LEG-01–04. Some related checks appear in Aknur's separate traceability matrix, but the verification plan's high-level table does not show them. Confirm their planned verification coverage; none is claimed as completed.
- FR-10 refers to the interactive demo in `/frontend`; it demonstrates only frontend behavior, not a working backend, persistence or study results.

