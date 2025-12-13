package repositories

import (
	"backend/models"
	"fmt"

	"gorm.io/gorm"
)

type TeacherRepository struct {
	db *gorm.DB
}

func NewTeacherRepository(db *gorm.DB) *TeacherRepository {
	return &TeacherRepository{db: db}
}

// Получить всех участников события
func (r *TeacherRepository) GetAll() ([]models.Teacher, error) {
	var teachers []models.Teacher
	err := r.db.Preload("Position").Preload("Specialty").Preload("Groups").Find(&teachers).Error
	return teachers, err
}

// Получить участника события по ID
func (r *TeacherRepository) GetByID(id uint) (*models.Teacher, error) {
	var teacher models.Teacher
	err := r.db.Preload("Position").Preload("Specialty").Preload("Groups").First(&teacher, id).Error
	return &teacher, err
}

// Создать нового участника события
func (r *TeacherRepository) Create(teacher *models.Teacher) error {
	return r.db.Create(teacher).Error
}

// Обновить участника события
func (r *TeacherRepository) Update(teacher *models.Teacher) error {
	updates := map[string]interface{}{}

	if teacher.FirstName != "" {
		updates["first_name"] = teacher.FirstName
	}
	if teacher.LastName != "" {
		updates["last_name"] = teacher.LastName
	}
	if teacher.MiddleName != "" {
		updates["middle_name"] = teacher.MiddleName
	}
	if teacher.PositionID != 0 {
		updates["position_id"] = teacher.PositionID
		fmt.Print(teacher.PositionID)
	}
	if teacher.SpecialtyID != 0 {
		updates["specialty_id"] = teacher.SpecialtyID
	}
	if teacher.Phone != 0 {
		updates["phone"] = teacher.Phone
	}
	if teacher.Email != "" {
		updates["email"] = teacher.Email
	}

	if len(updates) == 0 {
		return nil // нечего обновлять
	}

	return r.db.Model(&models.Teacher{}).
		Where("id = ?", teacher.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *TeacherRepository) Delete(id uint) error {
	return r.db.Delete(&models.Teacher{}, id).Error
}
