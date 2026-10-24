package domain

import "time"

type ConsentRecordID string

type ConsentRecord struct {
	ID            ConsentRecordID
	ChildID       ChildID
	GuardianID    UserID
	PolicyVersion string
	ConsentedAt   time.Time
}
