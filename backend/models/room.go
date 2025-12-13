package models

type Room struct {
	ID     uint `gorm:"primaryKey;autoIncrement"`
	Number string
	Floor  uint
}
