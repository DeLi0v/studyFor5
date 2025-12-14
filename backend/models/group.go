package models

type Group struct {
	ID             uint    `gorm:"primaryKey;autoIncrement"`
	Number         *string `gorm:"not null"`                  // номер группы
	Parallel       *uint   `gorm:"not null"`                  // параллель
	AdmissionDate  *string `gorm:"not null" "type:date"`      // дата поступления
	ClassTeacherID *uint   `gorm:"not null"`                  // FK на Teacher
	ClassTeacher   Teacher `gorm:"foreignKey:ClassTeacherID"` // связь с учителем
}
