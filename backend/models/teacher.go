package models

import "gorm.io/gorm"

type Teacher struct {
	gorm.Model
	FirstName   string `gorm:"not null"`
	LastName    string `gorm:"not null"`
	MiddleName  string
	PositionID  uint      `gorm:"not null"` // FK на Positions
	Position    Position  `gorm:"foreignKey:PositionID"`
	SpecialtyID uint      `gorm:"not null"` // FK на Specialties
	Specialty   Specialty `gorm:"foreignKey:SpecialtyID"`
	Phone       string    `gorm:"not null"`
	Email       string
	Groups      []Group      `gorm:"foreignKey:ClassTeacherID"` // Классный руководитель
	Lessons     []Lesson     `gorm:"foreignKey:TeacherID"`
	Grades      []Grade      `gorm:"foreignKey:GradedBy"`
	EventGrades []EventGrade `gorm:"foreignKey:GradedBy"`
}
