# Existing System Comparison

**Review date:** 22 October 2026  
**Method:** Desk comparison of public feature descriptions. “Not found” means not established by the cited source; it does not prove a feature is absent.

## Systems and selection rationale

The four products and user-facing comparison criteria are described in [existing-system-selection.md](existing-systems-criteria.md). This file consolidates the evidence table and conclusion.

## Criteria

Security and privacy evidence thresholds for C5, C6, C9 and C10 are explicit in [system-security-criteria.md](system-security-criteria.md).

The combined table uses criteria C1–C10. Security/privacy criteria C5, C6, C9 and C10 are specified in [system-security-criteria.md](system-security-criteria.md).

Legend: **Yes** = directly stated in a cited public feature page; **Partial** = narrower or implementation-dependent; **Not established** = reviewed source does not document it.

| Criterion | Birdhouse for Autism | Autism Tracker Pro | CareClinic | MyChart Proxy |
|---|---|---|---|---|
| C1 SEN-specific | Yes: autism-focused app description [1] | Yes: ASD tracking app [2] | No: general health tracker [3] | No: health-system portal [4] |
| C2 journal/observations | Yes: daily behavioural journal, care timeline [1] | Yes: customizable event and behaviour tracking [2] | Partial: symptoms/health tracking [3] | Partial: clinical record, not a family developmental diary [4] |
| C3 appointments/sessions | Partial: schedules/reminders described in directory [1] | Not established in reviewed listing [2] | Yes: appointment records and schedules are described by the vendor [5] | Yes: appointments in participating organizations [4] |
| C4 caregiver-professional sharing | Yes: sharing with caregivers, teachers, therapists described [1] | Partial: share/export data/screens [2] | Yes: care-team/caregiver sharing described [3] | Yes: proxy access enables an authorized representative to view/manage records [4] |
| C5 role/relationship access | Not established in reviewed public description | Not established | Partial: caregiver sharing; permission details vary by feature [3] | Yes: proxy authorization; governed by health organization [4] |
| C6 entry-level visibility | Not established | Not established | Not established in reviewed source | Organization and age dependent; not a configurable SEN diary [4] |
| C7 report/export | Summaries described [1] | Yes: charts and export described [2] | Yes: reports and share/export [3] | Yes: visit summaries and record downloads are described by Epic [6] |
| C8 web/cross-device | Listed in a 2024 directory; availability in 2026 is not confirmed [7] | App Store listing, iOS/iPadOS [2] | App/service across devices described by vendor [3] | Web and mobile portal; depends on health-system participation [4] |
| C9 revoke access | Not established | Not established | Vendor says caregivers can be deleted/revoked [3] | Proxy access managed under provider policy [4] |
| C10 audit/edit history | Not established | Not established | Not established in reviewed source | Medical record history exists at provider level; user-visible audit details not established |

## Interpretation

The reviewed products show that tracking, reminders, summaries, and proxy/caregiver sharing exist as separate capabilities. Public descriptions do not consistently explain the security semantics behind sharing, record-level visibility, assignment expiration, or audit history. This is a **documentation gap in the reviewed public materials**, not evidence that those products lack the controls. The proposed project's differentiating engineering question is whether a small SEN coordination workflow can combine sessions, cross-setting diary entries, revocable guardian/specialist relationships, and server-enforced visibility in one traceable model. User research must validate whether that combination is actually needed.

## Sources

1. Boston Medical Center, “Apps for Parents” PDF, Birdhouse description and listed diary/sharing features: https://www.bmc.org/sites/default/files/Patient_Care/Specialty_Care/Pediatrics%20-%20Autism/Recommended-Apps.pdf (2017; archival feature evidence, current availability not confirmed; Birdhouse availability in 2026 is not confirmed).
2. Apple App Store, “Autism Tracker Pro”: https://apps.apple.com/us/app/autism-tracker-pro/id478225574 (accessed 22 October 2026).
3. CareClinic, feature and sharing pages: https://careclinic.io/features/ and https://careclinic.io/getting-started/export-share/ (accessed 22 October 2026).
4. MyChart/Epic, proxy access help: https://www.mychart.org/l/en-us/help/proxy/ (accessed 22 October 2026); local proxy rules vary by health organization.
5. CareClinic, appointment records: https://careclinic.io/phr/appointments/ (official product page; accessed 23 October 2026).
6. Epic MyChart, Features (visit summaries and record downloads): https://www.mychart.org/Features (accessed 23 October 2026).
7. STAND North Wales, “Useful Apps for Tablets and Phones,” April 2024, Birdhouse listing: https://www.standnw.org/wp-content/uploads/2024/04/FINAL-_-Useful-Apps-for-tablets-and-phones-ENG.pdf. This is a dated directory, not confirmation of current availability.

## Limitations

This is a public-source feature scan, not hands-on testing, a privacy/security audit, or a market-size analysis. Feature availability and policies can change and may vary by region, account type, provider, and platform. A final diploma version should capture dated product screenshots or official help pages and record which version/region was reviewed.
