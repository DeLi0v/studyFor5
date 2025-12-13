package models

type Subject struct {
	ID   uint `gorm:"primaryKey;autoIncrement"`
	Name *string
}
