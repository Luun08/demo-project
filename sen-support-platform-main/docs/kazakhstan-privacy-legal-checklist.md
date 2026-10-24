# Kazakhstan personal-data and GDPR applicability checklist

**Owner:** Aknur — Security, Privacy & QA  
**Status:** Engineering draft for supervisor/legal review, 22 October 2026  
**Purpose:** turn legal questions into product decisions; this is not a legal opinion.

## Decisions to confirm before collecting real data

| Topic | Engineering action / question | Current project treatment |
|---|---|---|
| Controller/operator and purpose | Identify the legal entity/person deciding why and how data is processed; document each purpose and recipient. Who is the data owner/operator for the diploma prototype? | Unconfirmed; use synthetic data only. |
| Lawful basis and consent | Confirm which consent or other lawful basis applies to each data category and purpose; support consent withdrawal and record its version, date, actor and scope. Who may consent for a child and how is authority established? | Do not infer age, guardianship or legal capacity from an account role. Obtain supervisor/legal confirmation. |
| Data minimization | Keep only data needed for the stated support workflow. Avoid diagnosis and free-text sensitive details unless specifically justified. | Proposed fields and purpose are in [data inventory](data-inventory.md); review them with users and supervisor. |
| Child and sensitive data | Determine whether observations, disability or health-related information are restricted/special-category data under the applicable rules; define stricter access, retention and disclosure. | Treat diary content as highly sensitive by design; exact legal classification is open. |
| Storage location and transfers | Confirm the Kazakhstan localization requirement, database/backup location, hosting vendor, subprocessors and any cross-border transfer before selecting deployment. | Hosting region and vendor are not selected. No real personal data in the prototype. |
| Security safeguards | Define access controls, encryption, audit, backup, incident handling and vendor responsibilities proportional to the data and applicable requirements. | Security requirements exist; implementation is pending. |
| Rights and retention | Define how access/correction/deletion/withdrawal requests are received, verified, fulfilled, and recorded; set retention periods and deletion from backups. | Retention schedule and request workflow need owner and supervisor approval. |
| Notice and transparency | Prepare a plain-language notice for guardians and, where appropriate, children; state purpose, categories, recipients, retention and contact path. | Not ready for production use. |
| Breach handling | Identify responsible contact, containment process, assessment, evidence preservation and applicable notification rules/deadlines. | Draft process in [incident response](incident-response.md); legal deadlines must be confirmed for the actual controller and incident. |
| GDPR scope | Confirm whether the controller is established in the EU or offers services/monitors people in the EU, and whether GDPR applies. If applicable, determine lawful basis, Article 9 condition for health data, child-consent rules where relevant, rights and breach obligations. | GDPR is a conditional comparison framework, not assumed to apply solely because it is mentioned in the thesis. |

## Source checks

1. Kazakhstan Law No. 94-V, “On Personal Data and Their Protection,” official Adilet text: https://old.adilet.zan.kz/rus/docs/Z1300000094. The official page lists amendments through 2026. Re-check the consolidated text and effective dates at the time of submission; some listed amendments may have delayed commencement.
2. Regulation (EU) 2016/679 (GDPR), official EUR-Lex: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679. Relevant provisions to assess if GDPR applies include territorial scope (Art. 3), child consent (Art. 8), special categories (Art. 9), security (Art. 32), breach notification (Arts. 33–34) and data-subject rights.

## Review questions for the supervisor

- Is this a synthetic-data academic prototype, or will any real participants' information be processed?
- What is the intended operator/controller and where will production data be hosted?
- Are children or people with limited legal capacity included, and what consent/assent process is ethically and legally appropriate?
- Is GDPR relevant to the intended users, establishment, or service market?
- Which retention period, incident contact, and rights-request process can be justified in the thesis?

**Do not use this checklist as a compliance certification.** Obtain qualified legal/ethics review before any live deployment or collection of identifiable child data.
