package models

import "gorm.io/gorm"

type Parent struct {
	gorm.Model
	FirstName  string
	LastName   string
	MiddleName string
	Phone      string
	Email      string
	Students   []Student `gorm:"many2many:student_relations"`
}
