package domain

import (
	"encoding/json"
	"time"
)

type AuditEventID string

type AuditAction string

const (
	AuditActionCreate         AuditAction = "create"
	AuditActionRead           AuditAction = "read"
	AuditActionUpdate         AuditAction = "update"
	AuditActionDelete         AuditAction = "delete"
	AuditActionExport         AuditAction = "export"
	AuditActionLogin          AuditAction = "login"
	AuditActionLogout         AuditAction = "logout"
	AuditActionRefresh        AuditAction = "refresh"
	AuditActionLockout        AuditAction = "lockout"
	AuditActionPasswordChange AuditAction = "password_change"
)

type AuditOutcome string

const (
	AuditOutcomeSuccess AuditOutcome = "success"
	AuditOutcomeDenied  AuditOutcome = "denied"
	AuditOutcomeFailure AuditOutcome = "failure"
)

type AuditEvent struct {
	ID                      AuditEventID
	ActorID                 UserID
	AttemptedIdentifierHash string
	Action                  AuditAction
	Resource                string
	ResourceID              string
	Outcome                 AuditOutcome
	RequestID               string
	SourceIP                string
	Details                 json.RawMessage
	OccurredAt              time.Time
}
