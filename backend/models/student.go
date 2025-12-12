package models

import (
	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	FirstName   string `gorm:"not null"`
	LastName    string `gorm:"not null"`
	MiddleName  string
	Phone       string
	Email       string
	GroupID     uint         `gorm:"not null"` // FK на Group
	Group       Group        `gorm:"foreignKey:GroupID"`
	Grades      []Grade      `gorm:"foreignKey:StudentID"`
	EventGrades []EventGrade `gorm:"foreignKey:StudentID"`
	Parents     []Parent     `gorm:"many2many:student_relations"`
}
