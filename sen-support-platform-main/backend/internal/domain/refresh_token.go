package domain

import "time"

type RefreshTokenID string

type RefreshToken struct {
	ID            RefreshTokenID
	UserID        UserID
	TokenHash     string `json:"-"`
	ExpiresAt     time.Time
	RotatedFromID *RefreshTokenID
	RevokedAt     *time.Time
	CreatedAt     time.Time
}
