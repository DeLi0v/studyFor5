package models

type Lesson struct {
	ID        uint    `gorm:"primaryKey;autoIncrement"`
	GroupID   *uint   `gorm:"not null"`
	Group     Group   `gorm:"foreignKey:GroupID"`
	SubjectID *uint   `gorm:"not null"`
	Subject   Subject `gorm:"foreignKey:SubjectID"`
	TeacherID *uint   `gorm:"not null"`
	Teacher   Teacher `gorm:"foreignKey:TeacherID"`
	RoomID    *uint   `gorm:"not null"`
	Room      Room    `gorm:"foreignKey:RoomID"`
	Weekday   *uint   `gorm:"not null"` // 1-7
	TimeStart *string `gorm:"not null" type:"time"`
	TimeEnd   *string `gorm:"not null" type:"time"`
	EndDate   *string `gorm:"not null" type:"date"`
}
