package models

import (
	"time"

	"gorm.io/gorm"
)

type EventGrade struct {
	gorm.Model
	GradedBy  uint
	Teacher   Teacher `gorm:"foreignKey:GradedBy"`
	EventID   uint
	Event     Event `gorm:"foreignKey:EventID"`
	StudentID uint
	Student   Student `gorm:"foreignKey:StudentID"`
	DateGiven time.Time
	Score     uint
}
