# Supervisor Review and Feedback Log

**Supervisor:** Senior Lecturer A. K. Makatov
**Review date:** 23 October 2026
**Reviewed:** repository (README, `docs/`, `frontend/`, `backend/`), YouTrack project SSP, Pre-Defense 1 presentation
**Overall assessment:** analysis and design are at a good level; the project is recommended for Pre-Defense 1. Priorities for stage 2: backend implementation (Access and Profiles), additional user evidence, and a progressive, reviewed commit history.

The supervisor's written review in Russian is reproduced at the end of this file. Each row below records one comment, the team's decision, and the resulting change.

| ID | Deliverable / decision reviewed | Supervisor's comment (summary) | Decision / response | Change made / planned | Owner | Due | Status |
|---|---|---|---|---|---|---|---|
| SF-01 | Proposal and scope | Scope is realistic. Keep the MVP to access/roles, profiles and links, sessions, a visibility-controlled diary, and audit. Exclude video calls, billing and school/clinic integrations. | Accepted | Out-of-scope list confirmed in [proposal](proposal.md) and [README](../README.md#scope) | Beibarys | 24 Oct | Done |
| SF-02 | Evidence of relevance | Seven survey answers are exploratory, not proof. Conduct 3–5 semi-structured interviews with parents and specialists. Keep single-source requirements marked as hypotheses. | Accepted | Interview round (2 parents, 2–3 specialists) added to the plan. Hypothesis labels kept in [evidence-to-requirements](research/evidence-to-requirements.md) | Yerkebulan, Aknur | Pre-defense 2 | Planned |
| SF-03 | Literature review | 14 sources are a sufficient base. Ensure at least 8 peer-reviewed publications, add 2–3 sources on access control (RBAC/ABAC) for health or personal data, and use one citation style. | Accepted | [literature-review](literature-review.md) to be extended and reformatted | Aknur | 7 Nov | Planned |
| SF-04 | Existing system comparison | Each "?" cell must cite a source or be stated as "not found in public sources". | Accepted | Legend and sources clarified in [existing-systems-comparison](existing-systems-comparison.md) | Yerkebulan | 7 Nov | In progress |
| SF-05 | Technology comparison | React + TypeScript, Go (`net/http`) and PostgreSQL are justified by the requirements. Decide hosting with Kazakhstan data-localisation requirements in mind before deployment. | Accepted | Hosting decision added as an open item in the [legal checklist](kazakhstan-privacy-legal-checklist.md) | Beibarys, Aknur | Before deployment | Planned |
| SF-06 | Requirements | Every Must requirement needs a measurable acceptance criterion and a linked test in the traceability matrix. | Accepted | Must requirements reviewed against [traceability matrix](traceability-matrix.md) | Aknur | 7 Nov | In progress |
| SF-07 | Architecture and diagrams | Diagrams are consistent, but only the client is implemented and backend domain models are not yet connected to the UI. Mark built vs planned components. Start `transport/http` from `docs/openapi.yaml`. | Accepted | Component diagram to distinguish implemented/planned. Backend starts from the [OpenAPI contract](openapi.yaml) | Beibarys | Stage 2 | Planned |
| SF-08 | UX / prototype | The prototype shows the key scenarios for all three roles. Run a usability test with 5 users: task success, time on task, SUS. | Accepted | [usability-plan](frontend/usability-plan.md) scheduled after interviews | Yerkebulan | Pre-defense 2 | Planned |
| SF-09 | Verification plan | The naive baseline is a strong idea and should be kept. The pilot-size assumption (~200 families, 20 specialists) is accepted but must be labelled as an assumption. RBAC/IDOR tests should be the first tests in CI. | Accepted | Assumption retained and labelled in [verification-plan](verification-plan.md). RBAC/IDOR tests first in Stage 2 | Aknur | Stage 2 | Done (plan) |
| SF-10 | Project management and Git | Most commits were made on 22–23 October, and PRs #11 and #12 were merged without review. This does not show progressive work. | Accepted | Rules: commits from every member at least weekly; every PR reviewed by another member; YouTrack ID in the branch and PR; PR link in the YouTrack task; tag `pre-defense-1`. Recorded in [project-management](project-management.md) | All (Aknur: tags) | From 24 Oct | In progress |
| SF-11 | Child data, legal assumptions | The diary may contain health information. Check the RK Law "On Personal Data and Their Protection" (legal-representative consent, retention, database localisation), consult the university lawyer, and use synthetic data only. | Accepted | Items added to the [legal checklist](kazakhstan-privacy-legal-checklist.md). Synthetic-data rule kept | Aknur | Before real data | Planned |
| SF-12 | Next-stage priority | Start development with Access and Profiles (sign-up/login, tokens, RBAC, parent–child–specialist links) together with automated access tests. | Accepted | Milestone order confirmed in [project-management](project-management.md#milestones) | Beibarys, Aknur | Stage 2 | Planned |

## Review protocol for later checkpoints

1. Send the supervisor the changed documents and the PR links before each checkpoint.
2. Record each comment as a new row with date, decision, owner, due date and affected artifact.
3. Record both accepted changes and the reasons for not adopting a suggestion.
4. Close a row only when the linked change is merged.

## Original review (Russian)

> **Отзыв научного руководителя на материалы предзащиты 1** — сеньор-лектор Макатов А. К., 23.10.2026
>
> Команда выбрала социально значимую и при этом инженерно содержательную тему. Проблема сформулирована чётко, объём MVP реалистичен, а акцент на разграничении доступа, приватности и аудите даёт достаточную инженерную сложность. Этап анализа и проектирования выполнен на хорошем уровне: proposal, SRS с критериями приёмки, матрица трассируемости, сравнение аналогов и технологий, диаграммы, модель угроз, план верификации с базовым решением и кликабельный прототип на трёх языках.
>
> Замечания: (1) удерживать объём MVP; (2) опрос из 7 ответов — разведочные данные, нужны 3–5 интервью; (3) не менее 8 рецензируемых источников, добавить работы по RBAC/ABAC, единый стиль ссылок; (4) подтвердить ячейки «?» в сравнении аналогов; (5) решить вопрос хостинга с учётом локализации данных в РК; (6) у каждого Must-требования должен быть измеримый критерий и тест; (7) разделить реализованные и запланированные компоненты, начать backend с контракта OpenAPI; (8) юзабилити-тест на 5 пользователях; (9) сохранить «наивный» baseline, явно обозначить допущение о пилоте, начать CI с тестов RBAC/IDOR; (10) коммиты сделаны в основном 22–23 октября, PR #11 и #12 слиты без ревью — нужны регулярные коммиты, ревью каждого PR, ID задачи в ветке и PR, тег pre-defense-1; (11) проверить Закон РК «О персональных данных и их защите», проконсультироваться с юристом, использовать только синтетические данные; (12) начать разработку с Access and Profiles с автотестами доступа.
>
> Заключение: проект рекомендуется к предзащите 1.
