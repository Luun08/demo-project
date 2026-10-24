package domain

import "time"

type UserID string

type Role string

const (
	RoleParent     Role = "parent"
	RoleSpecialist Role = "specialist"
	RoleAdmin      Role = "admin"
)

type UserStatus string

const (
	UserStatusActive   UserStatus = "active"
	UserStatusInactive UserStatus = "inactive"
)

type SpecialistApprovalStatus string

const (
	SpecialistApprovalPending  SpecialistApprovalStatus = "pending"
	SpecialistApprovalApproved SpecialistApprovalStatus = "approved"
	SpecialistApprovalRejected SpecialistApprovalStatus = "rejected"
)

type User struct {
	ID                       UserID
	Email                    string
	PasswordHash             string `json:"-"`
	FirstName                string
	LastName                 string
	Role                     Role
	Status                   UserStatus
	SpecialistApprovalStatus SpecialistApprovalStatus
	FailedLoginAttempts      int
	LoginWindowStartedAt     *time.Time
	LockedUntil              *time.Time
	CreatedAt                time.Time
	UpdatedAt                time.Time
}

type SpecialistProfile struct {
	UserID       UserID
	Specialty    string
	Organization string
	Bio          string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
