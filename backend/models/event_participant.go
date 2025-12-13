package models

type EventParticipant struct {
	ID              uint `gorm:"primaryKey;autoIncrement"`
	EventID         *uint
	Event           Event   `gorm:"foreignKey:EventID"`
	ParticipantType *string `gorm:"type:participant_enum;not null"`
	ParticipantID   *uint
}
