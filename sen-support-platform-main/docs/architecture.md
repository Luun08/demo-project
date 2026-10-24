# Architecture and Diagram Set (Draft)

**Status:** Draft for pre-defense 1; diagrams are editable Mermaid source.  
**Consistency rule:** The Mermaid blocks in this document and the linked `.mmd` files are the canonical diagrams. Keep them synchronized and follow the requirements and threat model. Exports in `docs/diagrams/` (SVG/PNG) are generated from these diagrams; if they differ, Mermaid is authoritative. Refresh or remove them after the canonical diagrams are reviewed.

## Architecture summary

The browser UI calls a Go HTTP API. The API authenticates the user, checks role and active relationship for each child-linked resource, applies diary visibility rules, and uses repositories to persist records in a relational database. Audit events are written alongside sensitive operations. The current repository has frontend starter code and draft domain types; API handlers, repositories, migrations, and persistence are not yet implemented.

## 1. System context

```mermaid
flowchart LR
  Guardian[Parent / guardian]
  Specialist[Assigned specialist]
  Admin[Platform administrator]
  Supervisor[Supervisor / committee]
  Platform[SEN Support Platform\nWeb UI + HTTP API]
  DB[(Relational database)]
  Mail[Email delivery service\noptional, not in MVP]
  Guardian -->|Profile, sessions, diary| Platform
  Specialist -->|Assigned sessions and diary| Platform
  Admin -->|Accounts and assignments| Platform
  Platform -->|Authorized queries and updates| DB
  Platform -.->|Future account notifications| Mail
  Supervisor -.->|Reviews artefacts and evidence| Platform
```

## 2. Use cases

```mermaid
flowchart LR
  Parent[Parent / guardian]
  Specialist[Assigned specialist]
  Admin[Administrator]
  subgraph SSP[SEN Support Platform]
    UC1((Sign in))
    UC2((View linked child profile))
    UC3((Plan / update support session))
    UC4((Create diary entry))
    UC5((Set diary visibility))
    UC6((Review permitted diary history))
    UC7((Manage specialist assignment))
    UC8((Review audit metadata))
  end
  Parent --- UC1
  Parent --- UC2
  Parent --- UC3
  Parent --- UC4
  Parent --- UC5
  Parent --- UC6
  Parent -. "primary guardian only" .- UC7
  Specialist --- UC1
  Specialist --- UC2
  Specialist --- UC3
  Specialist --- UC4
  Specialist --- UC5
  Specialist --- UC6
  Admin --- UC1
  Admin --- UC7
  Admin --- UC8
```

Authorization constraint: every child-specific use case requires an active relationship; visibility and role rules are enforced by the API, not merely hidden in the interface.

## 3. Component diagram

```mermaid
flowchart TB
  subgraph Browser[Browser]
    UI[React + TypeScript UI]
    APIClient[HTTP client / typed DTOs]
    UI --> APIClient
  end
  APIClient -->|HTTPS JSON| HTTP[Go net/http handlers]
  subgraph Backend[Go API]
    HTTP --> Auth[Authentication middleware]
    Auth --> Access[Authorization service\nrole + relationship + visibility]
    Access --> Profile[Profile service]
    Access --> Sessions[Support session service]
    Access --> Diary[Diary and version service]
    Profile --> Repo[Repository interfaces]
    Sessions --> Repo
    Diary --> Repo
    Access --> Audit[Audit service]
    Profile --> Audit
    Sessions --> Audit
    Diary --> Audit
    Repo --> DB[(PostgreSQL candidate)]
    Audit --> DB
  end
```

## 4. ER diagram

```mermaid
erDiagram
  USER ||--o{ CHILD_GUARDIAN : linked_as_guardian
  CHILD ||--o{ CHILD_GUARDIAN : has_guardian
  USER ||--o{ CHILD_SPECIALIST : assigned_specialist
  CHILD ||--o{ CHILD_SPECIALIST : has_assignment
  CHILD ||--o{ SUPPORT_SESSION : schedules
  USER ||--o{ SUPPORT_SESSION : created_by
  CHILD ||--o{ DIARY_ENTRY : has_entries
  USER ||--o{ DIARY_ENTRY : authored_by
  DIARY_ENTRY ||--o{ DIARY_VERSION : versioned_as
  USER ||--o{ DIARY_VERSION : changed_by
  USER ||--o{ REFRESH_TOKEN : owns
  CHILD ||--o{ CONSENT_RECORD : has_consent
  USER ||--o{ CONSENT_RECORD : gives_consent
  USER ||--o{ AUDIT_EVENT : actor
  CHILD ||--o{ AUDIT_EVENT : subject

  USER {
    uuid id PK
    string email UK
    string password_hash
    string role
    string status
    string specialist_approval_status
    int failed_login_attempts
    datetime login_window_started_at
    datetime locked_until
  }
  CHILD {
    uuid id PK
    string first_name
    string last_name
    date birth_date
  }
  CHILD_GUARDIAN {
    uuid child_id FK
    uuid guardian_id FK
    boolean is_primary
    datetime created_at
  }
  CHILD_SPECIALIST {
    uuid child_id FK
    uuid specialist_id FK
    datetime started_at
    datetime ended_at
  }
  CONSENT_RECORD {
    uuid id PK
    uuid child_id FK
    uuid guardian_id FK
    string policy_version
    datetime consented_at
  }
  SUPPORT_SESSION {
    uuid id PK
    uuid child_id FK
    uuid created_by FK
    datetime starts_at
    string status
  }
  DIARY_ENTRY {
    uuid id PK
    uuid child_id FK
    uuid author_id FK
    string visibility
    datetime created_at
    datetime updated_at
  }
  DIARY_VERSION {
    uuid id PK
    uuid entry_id FK
    uuid changed_by FK
    int version_number
    string type
    string visibility
    text content
    datetime observed_at
    datetime changed_at
  }
  REFRESH_TOKEN {
    uuid id PK
    uuid user_id FK
    string token_hash
    datetime expires_at
    uuid rotated_from_id FK
    datetime revoked_at
    datetime created_at
  }
  AUDIT_EVENT {
    uuid id PK
    uuid actor_id FK
    string attempted_identifier_hash
    uuid child_id FK
    string action
    string resource_type
    string resource_id
    string outcome
    string request_id
    inet source_ip
    json details
    datetime occurred_at
  }
```

All `datetime` values are stored in UTC. The diagram is a conceptual draft; exact constraints, retention, and migrations need review after the API contract and legal questions are resolved. Diary content is intentionally omitted from audit events.

## Diagram files

The four diagrams above are authored here as Mermaid. The distinct data-flow diagram is maintained in [`diagrams/dfd.mmd`](diagrams/dfd.mmd). Existing SVG and PNG renderings are grouped under [`diagrams/exports/`](diagrams/exports/) and are not editable sources of truth. Regenerate or replace those exports from the reviewed Mermaid diagrams when they are updated.
