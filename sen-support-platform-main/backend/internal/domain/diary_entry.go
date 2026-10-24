package domain

import "time"

type DiaryEntryID string

type DiaryEntryType string

const (
	DiaryEntryObservation    DiaryEntryType = "observation"
	DiaryEntryProgress       DiaryEntryType = "progress"
	DiaryEntryRecommendation DiaryEntryType = "recommendation"
)

type DiaryVisibility string

const (
	DiaryVisibilityShared          DiaryVisibility = "shared"
	DiaryVisibilitySpecialistsOnly DiaryVisibility = "specialists_only"
)

type DiaryEntry struct {
	ID         DiaryEntryID
	ChildID    ChildID
	AuthorID   UserID
	Type       DiaryEntryType
	Visibility DiaryVisibility
	Content    string
	ObservedAt time.Time
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

type DiaryEntryVersionID string

type DiaryEntryVersion struct {
	ID            DiaryEntryVersionID
	EntryID       DiaryEntryID
	VersionNumber int
	ChildID       ChildID
	AuthorID      UserID
	ChangedBy     UserID
	Type          DiaryEntryType
	Visibility    DiaryVisibility
	Content       string
	ObservedAt    time.Time
	ChangedAt     time.Time
}
