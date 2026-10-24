# Client Discussion Protocol: Support Coordination Processes

**Task:** [SSP-20](https://honchikon1.youtrack.cloud/issue/SSP-20) (parent: [SSP-3](https://honchikon1.youtrack.cloud/issue/SSP-3))
**Responsible:** Zhumagali Beibarys (SE-2423)

## 1. Meeting details

| Field | Value |
|---|---|
| Date | 2026-10-23 |
| Format |  written reply in messenger  |
| Participant |  administrator , support centre for children with special educational needs, Astana, anonymized |
| How the contact was found | Through the relatives of the girl with whom we are writing a dissertation. |
| Interviewer | Zhumagali Beibarys |
| Permission to name the organization | no |

### How the response was obtained
The Questions Sent: The participant received a structured list of questions covering the center's current processes for scheduling, data storage, parent communication, inter-specialist collaboration, legal consent procedures, operational pain points, and the potential utility of a unified coordination tool.

Authorship of the Answers: The interview was conducted asynchronously via written messenger. The participant was provided with a structured questionnaire covering current operational processes, data management, and communication pain points. The responses represent the direct operational experience of the participant in their role as a center administrator.

## 2. Current processes (as described by the participant)

**Scheduling.** The administrator plans sessions in Google Sheets, with a tab or colour code per specialist. When a session is cancelled, the parent messages the administrator in WhatsApp. The administrator manually deletes the entry, informs the specialist by private message, and calls parents from a waiting list to fill the slot. This is time-consuming and causes mistakes (for example, a specialist is not told and waits for a child who is not coming).

**Records.**
- Legal and formal documents (contracts, PMPK conclusions) are kept in paper files.
- Attendance is kept by the administrator in Excel.
- Working notes on a child's progress are kept by each specialist (speech therapist, defectologist, ABA therapist) in a personal notebook or phone notes. There is no shared electronic history.

**Feedback to parents.** Mostly verbal: a short talk after the session and homework instructions. If the parent is absent, the specialist sends a WhatsApp voice message. Parents receive summary reports once every three months and have no access to raw notes.

**Information exchange between specialists.** Weekly team meetings and informal conversations. Sometimes a WhatsApp group is created for a specific child (parent, speech therapist, psychologist), but information gets lost in the message flow.

**Team-only notes.** Specialists record hypotheses and observations that should not be shown to parents without proper framing (e.g. preliminary suspicions, difficult behavioural episodes, safeguarding concerns). Details are intentionally not recorded in this protocol.

**Consent.** A paper form signed at the first appointment, covering personal data processing and permission for photo/video recording of sessions (used for supervision).

## 3. Problems named by the participant

1. Continuity is lost when a specialist leaves or is absent: the new specialist starts almost from scratch because earlier notes stay in the former employee's notebook.
2. No overview of a child's progress across specialists, because they rarely have time to meet.
3. Homework materials (links, videos, cards) are scattered across messenger chats, and parents lose them.

## 4. Priorities for an MVP (according to the participant)

1. A single schedule with automatic notifications to parents about changes.
2. A child card with role-based access: administrator sees finance and schedule, parent sees schedule and homework, specialists see each other's team-only notes.
3. A homework module, so parents find tasks in one place.

## 5. Agreements

No formal agreement, pilot or deployment was agreed. The participant stated that such a tool is needed.

## 6. Confirmed findings vs. assumptions

**Confirmed by the participant:** the processes in section 2, the problems in section 3, and the need for notes visible only to the specialist team.

**Remains an assumption:**
- The organic demand for "team-only notes". Since this feature was explicitly mentioned in the questionnaire, the positive response validates our hypothesis, but further unprompted validation is recommended.
- Priority order of features reflects one organization only.
- Willingness to adopt the system, to pay for it, or to run a pilot was not discussed.

## 7. Limitations

- There is no confirmed agreement with a client or organization. This is the opinion of one representative of one organization, and conclusions are preliminary.
- No personal data of children or parents was collected.
- Further discussions with user representatives are planned to reach the required 3–5 for SSP-3: including parents of children with SEN, ABA therapists, speech therapists.

## 8. Impact on requirements

Requirement IDs below follow the API contract references; verify them against `docs/srs.md`.

| Finding | Status | Related requirements |
|---|---|---|
| Scheduling by cancellation and rescheduling is error-prone | Confirmed | FR-04, FR-05 (sessions) |
| No single record of a child's history | Confirmed | FR-02, FR-06, FR-07 (child profile, diary) |
| Notes visible only to specialists | Confirmed (see section 6) | FR-06, FR-07, SEC-12 (`specialists_only`) |
| Parents see only summaries | Confirmed | FR-07 (`shared` entries) |
| Paper consent form | Confirmed | PRV-07 (ConsentRecord) |
| Continuity when a specialist leaves | Confirmed | FR-03, SEC-11 (assignment end, history stays with the child) |
| Notifications about schedule changes | New, not covered | Candidate requirement |
| Homework module | New, partly covered by diary type `recommendation` | Candidate requirement |
| Waiting list and rescheduling | New, not covered | Candidate / out of scope |
| Administrator manages the schedule (Admin has no session access in the contract) | Differs from the current design | Document as an assumption or add a coordinator role |
| Consent for photo/video recording | Not covered | Candidate requirement |
| Finance | Out of scope | Not part of the project |