package domain

import "time"

type SupportSessionID string

type SupportSessionStatus string

const (
	SupportSessionScheduled SupportSessionStatus = "scheduled"
	SupportSessionCompleted SupportSessionStatus = "completed"
	SupportSessionCancelled SupportSessionStatus = "cancelled"
)

type SupportSessionMode string

const (
	SupportSessionOnline   SupportSessionMode = "online"
	SupportSessionInPerson SupportSessionMode = "in_person"
)

type SupportSession struct {
	ID           SupportSessionID
	ChildID      ChildID
	SpecialistID UserID
	CreatedBy    UserID
	Title        string
	StartsAt     time.Time
	EndsAt       time.Time
	Mode         SupportSessionMode
	Status       SupportSessionStatus
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
