# Literature and standards sources for privacy, security and RBAC

**Owner:** Aknur — Security, Privacy & QA  
**Use:** supports design rationale; these sources do not establish legal compliance.

| Source | Type | Use in the project | Limits |
|---|---|---|---|
| Ferraiolo, D. F., Kuhn, D. R. (1992). Role-Based Access Controls. 15th NIST-NCSC National Computer Security Conference. https://csrc.nist.gov/csrc/media/projects/role-based-access-control/documents/ferraiolo-kuhn-92.pdf | Foundational paper | Role-permission separation and RBAC model. | Does not handle child-specific relationships by itself; add object-level authorization. |
| Sandhu, R. S., Coyne, E. J., Feinstein, H. L., Youman, C. E. (1996). Role-Based Access Control Models. IEEE Computer 29(2), 38–47. https://doi.org/10.1109/2.485845 | Peer-reviewed paper | RBAC model vocabulary and role hierarchy/separation considerations. | The paper is not an application-specific access policy. |
| NIST SP 800-162, Guide to Attribute Based Access Control (ABAC) Definition and Considerations. https://csrc.nist.gov/pubs/sp/800/162/upd2/final | Government technical guidance | Explains contextual attributes; motivates relationship/assignment checks alongside role. | Project uses a hybrid design; do not relabel it as pure ABAC. |
| OWASP Authorization Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html | Security guidance | Deny-by-default, authorization on every request, object-level checks. | Guidance, not proof the implementation follows it. |
| OWASP Session Management Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html | Security guidance | Session lifecycle, cookie protections and session renewal/revocation design. | Recheck before implementation; deployment details matter. |
| OWASP Password Storage Cheat Sheet. https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html | Security guidance | Argon2id recommendation and migration/parameter considerations. | Choose parameters by benchmarking the actual deployment. |
| Regulation (EU) 2016/679, especially Arts. 3, 8, 9, 25, 32–34. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679 | Primary legal text | Conditional privacy/security obligations if GDPR applies. | Territorial and material applicability must be assessed; not every project is subject. |
| Kazakhstan Law No. 94-V, “On Personal Data and Their Protection.” https://old.adilet.zan.kz/rus/docs/Z1300000094 | Primary legal text | Local personal-data processing, consent and protection questions. | Verify consolidated text, effective amendments and applicability with qualified counsel. |

The scientific RBAC sources can count toward the literature review only if they fit the university's definition of a scientific source and are cited in the final required style. Standards and OWASP pages are technical authorities, not peer-reviewed studies.
