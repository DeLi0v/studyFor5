package models

import "gorm.io/gorm"

type EventParticipant struct {
	gorm.Model
	EventID         uint
	Event           Event  `gorm:"foreignKey:EventID"`
	ParticipantType string `gorm:"type:participant_type;not null"`
	ParticipantID   uint
}
