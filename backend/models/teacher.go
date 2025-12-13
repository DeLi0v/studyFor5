package models

type Teacher struct {
	ID          uint   `gorm:"primaryKey;autoIncrement"`
	FirstName   string `gorm:"not null"`
	LastName    string `gorm:"not null"`
	MiddleName  string
	PositionID  uint      `gorm:"not null"` // FK на Positions
	Position    Position  `gorm:"foreignKey:PositionID"`
	SpecialtyID uint      `gorm:"not null"` // FK на Specialties
	Specialty   Specialty `gorm:"foreignKey:SpecialtyID"`
	Phone       uint      `gorm:"not null"`
	Email       string
	Groups      []Group `gorm:"foreignKey:ClassTeacherID"` // Классный руководитель
}
