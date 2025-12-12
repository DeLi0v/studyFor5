package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Type         string `gorm:"type:event_type;not null"`
	Name         string `gorm:"not null"`
	Description  string
	RoomID       uint
	Room         Room `gorm:"foreignKey:RoomID"`
	EventDate    time.Time
	TimeStart    time.Time
	TimeEnd      time.Time
	Participants []EventParticipant `gorm:"foreignKey:EventID"`
	EventGrades  []EventGrade       `gorm:"foreignKey:EventID"`
}
