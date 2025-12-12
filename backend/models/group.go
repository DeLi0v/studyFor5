package models

import (
	"time"

	"gorm.io/gorm"
)

type Group struct {
	gorm.Model
	Number         string    `gorm:"not null"`                  // номер группы
	Parallel       uint      `gorm:"not null"`                  // параллель
	AdmissionDate  time.Time `gorm:"not null"`                  // дата поступления
	ClassTeacherID uint      `gorm:"not null"`                  // FK на Teacher
	ClassTeacher   Teacher   `gorm:"foreignKey:ClassTeacherID"` // связь с учителем
	Students       []Student // связь с учениками
	Lessons        []Lesson  // связь с уроками
}
