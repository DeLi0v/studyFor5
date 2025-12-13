package models

type StudentRelation struct {
	StudentID uint    `gorm:"primaryKey"`
	Student   Student `gorm:"foreignKey:StudentID"`
	ParentID  uint    `gorm:"primaryKey"`
	Parent    Parent  `gorm:"foreignKey:ParentID"`
}
