package domain

import "time"

type ChildID string

type Relationship string

const (
	RelationshipParent   Relationship = "parent"
	RelationshipGuardian Relationship = "guardian"
)

type Child struct {
	ID        ChildID
	FirstName string
	LastName  string
	BirthDate time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}

type ChildGuardian struct {
	ChildID      ChildID
	GuardianID   UserID
	Relationship Relationship
	IsPrimary    bool
	CreatedAt    time.Time
}

type ChildSpecialist struct {
	ChildID      ChildID
	SpecialistID UserID
	AssignedBy   UserID
	AssignedAt   time.Time
	EndedAt      *time.Time
}
