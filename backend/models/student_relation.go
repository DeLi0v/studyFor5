package models

type StudentRelation struct {
	StudentID uint `gorm:"primaryKey"`
	ParentID  uint `gorm:"primaryKey"`
}
