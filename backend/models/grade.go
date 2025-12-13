package models

import (
	"time"
)

type Grade struct {
	ID        uint   `gorm:"primaryKey;autoIncrement"`
	Type      string `gorm:"type:grade_type;not null"`
	StudentID uint
	Student   Student `gorm:"foreignKey:StudentID"`
	SubjectID uint
	Subject   Subject `gorm:"foreignKey:SubjectID"`
	DateGiven time.Time
	Score     uint
	GradedBy  uint
	Teacher   Teacher `gorm:"foreignKey:GradedBy"`
}
