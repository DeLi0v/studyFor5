package models

type Event struct {
	ID           uint    `gorm:"primaryKey;autoIncrement"`
	Type         *string `gorm:"type:event_type;not null"`
	Name         *string `gorm:"not null"`
	Description  *string
	RoomID       *uint
	Room         Room               `gorm:"foreignKey:RoomID"`
	EventDate    *string            `gorm:"type:date"`
	TimeStart    *string            `gorm:"type:time"`
	TimeEnd      *string            `gorm:"type:time"`
	Participants []EventParticipant `gorm:"foreignKey:EventID"`
}
