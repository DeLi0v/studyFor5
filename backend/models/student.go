package models

type Student struct {
	ID         uint    `gorm:"primaryKey;autoIncrement"`
	FirstName  *string `gorm:"not null"`
	LastName   *string `gorm:"not null"`
	MiddleName *string
	Phone      *uint
	Email      *string
	GroupID    *uint    `gorm:"not null"` // FK на Group
	Group      Group    `gorm:"foreignKey:GroupID"`
	Parents    []Parent `gorm:"many2many:student_relations;"`
}
