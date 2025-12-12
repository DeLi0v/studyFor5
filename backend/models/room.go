package models

import "gorm.io/gorm"

type Room struct {
	gorm.Model
	Number  string
	Floor   uint
	Lessons []Lesson `gorm:"foreignKey:RoomID"`
	Events  []Event  `gorm:"foreignKey:RoomID"`
}
