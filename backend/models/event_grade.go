package models

type EventGrade struct {
	ID        uint `gorm:"primaryKey;autoIncrement"`
	GradedBy  *uint
	Teacher   Teacher `gorm:"foreignKey:GradedBy"`
	EventID   *uint
	Event     Event `gorm:"foreignKey:EventID"`
	StudentID *uint
	Student   Student    `gorm:"foreignKey:StudentID"`
	DateGiven *string `gorm:"type:time"`
	Score     *uint
}
