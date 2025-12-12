package models

import "gorm.io/gorm"

type Specialty struct {
	gorm.Model
	Name     string
	Teachers []Teacher `gorm:"foreignKey:SpecialtyID"`
}
