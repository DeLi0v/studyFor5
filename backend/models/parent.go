package models

type Parent struct {
	ID         uint `gorm:"primaryKey;autoIncrement"`
	FirstName  string
	LastName   string
	MiddleName string
	Phone      uint
	Email      string
	Students   []Student `gorm:"many2many:student_relations"`
}
