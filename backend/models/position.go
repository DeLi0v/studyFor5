package models

import "gorm.io/gorm"

type Position struct {
	gorm.Model
	Name     string
	Teachers []Teacher `gorm:"foreignKey:PositionID"`
}
