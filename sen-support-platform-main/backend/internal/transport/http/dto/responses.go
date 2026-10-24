package dto

import (
	"encoding/json"
	"time"

	"github.com/AknurOE/sen-support-platform/internal/domain"
)

// UserResponse deliberately contains no password or password hash.
type UserResponse struct {
	ID                       string     `json:"id"`
	Email                    string     `json:"email"`
	FirstName                string     `json:"first_name"`
	LastName                 string     `json:"last_name"`
	Role                     string     `json:"role"`
	Status                   string     `json:"status"`
	SpecialistApprovalStatus string     `json:"specialist_approval_status,omitempty"`
	FailedLoginAttempts      int        `json:"failed_login_attempts"`
	LockedUntil              *time.Time `json:"locked_until,omitempty"`
	CreatedAt                time.Time  `json:"created_at"`
	UpdatedAt                time.Time  `json:"updated_at"`
}

func NewUserResponse(user domain.User) UserResponse {
	return UserResponse{
		ID: string(user.ID), Email: user.Email, FirstName: user.FirstName,
		LastName: user.LastName, Role: string(user.Role), Status: string(user.Status),
		SpecialistApprovalStatus: string(user.SpecialistApprovalStatus),
		FailedLoginAttempts:      user.FailedLoginAttempts, LockedUntil: user.LockedUntil,
		CreatedAt: user.CreatedAt, UpdatedAt: user.UpdatedAt,
	}
}

type ConsentRecordResponse struct {
	ID            string    `json:"id"`
	ChildID       string    `json:"child_id"`
	GuardianID    string    `json:"guardian_id"`
	PolicyVersion string    `json:"policy_version"`
	ConsentedAt   time.Time `json:"consented_at"`
}

type RefreshTokenResponse struct {
	ID            string     `json:"id"`
	UserID        string     `json:"user_id"`
	ExpiresAt     time.Time  `json:"expires_at"`
	RotatedFromID *string    `json:"rotated_from_id,omitempty"`
	RevokedAt     *time.Time `json:"revoked_at,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
}

type DiaryEntryVersionResponse struct {
	ID            string    `json:"id"`
	EntryID       string    `json:"entry_id"`
	VersionNumber int       `json:"version_number"`
	ChildID       string    `json:"child_id"`
	AuthorID      string    `json:"author_id"`
	ChangedBy     string    `json:"changed_by"`
	Type          string    `json:"type"`
	Visibility    string    `json:"visibility"`
	Content       string    `json:"content"`
	ObservedAt    time.Time `json:"observed_at"`
	ChangedAt     time.Time `json:"changed_at"`
}

type AuditEventResponse struct {
	ID                      string          `json:"id"`
	ActorID                 string          `json:"actor_id"`
	AttemptedIdentifierHash string          `json:"attempted_identifier_hash,omitempty"`
	Action                  string          `json:"action"`
	Resource                string          `json:"resource"`
	ResourceID              string          `json:"resource_id"`
	Outcome                 string          `json:"outcome"`
	RequestID               string          `json:"request_id"`
	SourceIP                string          `json:"source_ip"`
	Details                 json.RawMessage `json:"details,omitempty"`
	OccurredAt              time.Time       `json:"occurred_at"`
}
