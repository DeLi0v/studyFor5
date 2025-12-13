package models

type Position struct {
	ID   uint `gorm:"primaryKey;autoIncrement"`
	Name string
}
