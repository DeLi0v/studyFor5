package models

import (
	"time"
)

type Event struct {
	ID           uint   `gorm:"primaryKey;autoIncrement"`
	Type         string `gorm:"type:event_type;not null"`
	Name         string `gorm:"not null"`
	Description  string
	RoomID       uint
	Room         Room `gorm:"foreignKey:RoomID"`
	EventDate    time.Time
	TimeStart    time.Time
	TimeEnd      time.Time
	Participants []EventParticipant `gorm:"foreignKey:EventID"`
}
