package models

import "gorm.io/gorm"

type Subject struct {
	gorm.Model
	Name    string
	Grades  []Grade  `gorm:"foreignKey:SubjectID"`
	Lessons []Lesson `gorm:"foreignKey:SubjectID"`
}
