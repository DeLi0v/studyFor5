package models

type Specialty struct {
	ID   uint `gorm:"primaryKey;autoIncrement"`
	Name string
}
