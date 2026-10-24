# SSP-41 — ER and component model

This report accompanies [the ER model](diagrams/er.mmd) and [the component diagram](diagrams/components.mmd). Source fields and permissions are taken from `backend/internal/domain`, `docs/data-inventory.md`, the access matrix, security/privacy requirements, SRS, and `beibarys/docs/architecture.md`.

## Differences and modeling decisions

- The Go domain uses string ID types, while the architecture's earlier ER draft labels identifiers `uuid`. The diagram uses `string` and does not assert an ID encoding.
- The current `SpecialistProfile` domain type has specialty, organization, bio and timestamps, but no approval field. The data inventory calls for a specialist approval status (SEC-14); `approval_status` is therefore an added field pending definition of allowed states.
- `ChildGuardian` has `Relationship` and `CreatedAt` in the domain; the older architecture ER draft omitted both. Both are included here.
- `ChildSpecialist` has `AssignedBy`, `AssignedAt`, and nullable `EndedAt` in the domain. The earlier draft called the start timestamp `started_at` and omitted `assigned_by`; this model follows domain names.
- `SupportSession` includes specialist, creator, title, times, mode, status and timestamps in the domain. The older ER draft included only a subset.
- `DiaryEntry` includes type, content and observed time in the domain, and they are included here. `DiaryEntryVersion` is absent from domain code but required by AUD-03/FR-08 and the data inventory; its content fields are a snapshot needed to restore prior versions.
- `ConsentRecord`, `RefreshToken`, and `LoginLockout` are planned by the data inventory/security requirements and are not current domain types. Refresh token hashes are storage-only. Lockout keys represent submitted identifier and IP without storing raw credentials; exact key derivation and limits are implementation decisions.
- The data inventory plans `AuditEvent.SourceIP` and an attempted identifier (hashed or truncated); neither exists in the current `AuditEvent` domain struct. The model adds these as security-event fields. `actor_id` is nullable for failed authentication attempts with no known account. `child_id` is nullable for authentication events, as AUD-05 does not attach them to a child.
- The domain `AuditEvent` has actor, action, resource, resource ID, outcome, request ID and occurrence time, and the diagram retains these. It does not store diary text. Child-linked events use the child reference for scoped audit access.
- `version_number` is intended to be unique within an entry, using a composite database constraint `(entry_id, version_number)`. `ChildGuardian` and `ChildSpecialist` use composite primary keys.
- Access rules remain those in the matrix: Parent-created diary entries use `shared`; guardians never receive `specialists_only`; Admin has no diary content access; relationship absence maps to 404 and an insufficient right on an existing relationship maps to 403.

## Questions

- Should ID storage use UUIDs or another string encoding?
- Which specialist approval states and approval actor/time fields are required? The source defines approval but not its lifecycle fields.
- Should lockout combine identifier and IP keys in one row, or maintain independent counters per SEC-03?
- What are the retention period for consent evidence and the legal minimum for audit records?
