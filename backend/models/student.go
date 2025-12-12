package models

import "time"

type Student struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    FirstName string    `gorm:"not null" json:"first_name"`
    LastName  string    `gorm:"not null" json:"last_name"`
    MiddleName string   `json:"middle_name"`
    Phone     string    `json:"phone"`
    Email     string    `json:"email"`
    GroupID   uint      `gorm:"not null" json:"group_id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
