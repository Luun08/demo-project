# UX Scenarios and Prototype

This document records the UX scenarios and review criteria. The consent control and withdrawal behavior are illustrative prototype interactions only; the lawful basis, guardian authority, consent wording, retention, and withdrawal workflow remain subject to supervisor/legal review. Do not treat the demo as evidence of valid consent. The clickable prototype is in [`/frontend`](../frontend). From the repository root, run `cd frontend`, `npm ci`, then `npm run dev`. Screenshot capture is deferred; no hosted demo is available yet.

## Personas (working hypotheses; validate with participants)

| Persona | Goal | Constraint | Prototype implication |
|---|---|---|---|
| Parent/guardian coordinating support | Recall what happened and see upcoming sessions | Limited time; may use a phone; may need plain language | Show next session and recent updates immediately; keep entry form short |
| Assigned specialist | Coordinate sessions and share concise observations | Must see only children currently assigned; needs clear authorship | Show selected child and active relationship; label visibility before saving |
| Administrator | Maintain accounts and assignments without reading sensitive diary details | Operational access should be least-privilege | Separate assignment management from diary content |

These personas describe design hypotheses derived from the project scope, not completed user research.

## Core task flows

### Parent: find the next session and record an observation

1. Open Overview and identify the next session, its time, and status.
2. Open Diary and select “Add entry.”
3. Enter a short factual observation and choose “Guardian and specialists.”
4. Save; see the entry in the diary and recent updates.

### Specialist: record an internal team note

1. Select the specialist role in the prototype.
2. Open Diary and add an observation.
3. Choose “Only specialists.” Parent-created entries are `shared` only; the private-visibility control is for specialists in this prototype.
4. Switch to parent role and confirm that this sample entry is not shown.

### Administrator: change a specialist assignment (not implemented in this UI prototype)

1. Open the separate assignment-management flow in the eventual admin UI.
2. Select child and specialist; create or end the relationship with effective time.
3. Confirm the change and its audit event.
4. Verify a specialist with an ended assignment cannot access the child.

## Evaluation prompts

- Ask a participant to locate the next meeting, create a diary note, and explain who can read it.
- Record task completion, errors, time, and participant comments; do not collect identifiable child details.
- Check keyboard-only completion, focus visibility, label clarity, and a narrow mobile viewport.
- Treat the role switch as illustrative only. Actual access-control validation belongs in backend integration tests described by the verification plan.
