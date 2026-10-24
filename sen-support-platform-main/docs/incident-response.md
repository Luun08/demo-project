# Personal-data incident response (one-page operating draft)

**Owner:** Aknur — Security, Privacy & QA  
**Status:** Draft; contacts, legal deadlines and operational tooling must be assigned before production.

## First response

1. **Report and record.** Anyone who suspects exposure, loss, unauthorized access or alteration contacts the designated incident lead immediately. Record when discovered, reporter, affected system, initial facts and a case ID. Do not include passwords, tokens or diary text in chat/email tickets.
2. **Contain safely.** Incident lead disables compromised accounts/credentials, revokes refresh sessions, restricts affected endpoints or storage, and isolates affected hosts when necessary. Preserve service logs and evidence; do not destroy systems or logs during containment.
3. **Assess scope.** Security lead and system owner identify data categories, people affected, time window, access path, likely recipient, whether child/sensitive data is involved, and whether confidentiality, integrity or availability is affected. Treat unknown scope as ongoing until bounded.
4. **Preserve evidence.** Keep access-controlled copies of relevant logs, timestamps, configuration and forensic notes with integrity hashes where available. Restrict evidence access and maintain a chain-of-custody note.
5. **Notify decision-maker.** Incident lead promptly escalates to the controller/operator and supervisor/project owner. The controller/operator decides external notifications with legal advice, based on the applicable law and confirmed facts.
6. **Recover and learn.** Remove the cause, rotate affected secrets, restore from verified backups if needed, monitor for recurrence, document decisions, and create tracked corrective actions with owners and dates.

## Roles to assign

| Role | Responsibility | Named contact |
|---|---|---|
| Incident lead | Coordinate triage, containment and incident log | **Unassigned** |
| System owner | Technical isolation, credential rotation, recovery | **Unassigned** |
| Controller/operator contact | Decide legal/individual/regulator notifications | **Unassigned** |
| Legal/ethics reviewer | Confirm applicable duties, deadlines and wording | **Unassigned** |

## Notification and closure

No fixed external notification deadline is asserted here. Confirm the current Kazakhstan law and any applicable GDPR duties (including whether GDPR applies and when the controller became aware) with the responsible legal reviewer. If an external notice is required, document the legal basis, recipient, time, facts disclosed and approval. Tell affected people when required and provide practical protective steps.

Close only after containment is confirmed, access has been restored safely, required decisions/notices are recorded, evidence is secured, and corrective actions have owners. Use synthetic records in exercises; never place identifiable child data in an incident drill.
