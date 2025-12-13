package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type ParentRepository struct {
	db *gorm.DB
}

func NewParentRepository(db *gorm.DB) *ParentRepository {
	return &ParentRepository{db: db}
}

// Получить всех участников события
func (r *ParentRepository) GetAll() ([]models.Parent, error) {
	var parents []models.Parent
	result := r.db.Preload("parents").Find(&parents)
	return parents, result.Error
}

// Получить участника события по ID
func (r *ParentRepository) GetByID(id uint) (*models.Parent, error) {
	var parent models.Parent
	result := r.db.Preload("parents").First(&parent, id)
	return &parent, result.Error
}

// Создать нового участника события
func (r *ParentRepository) Create(parent *models.Parent) error {
	return r.db.Create(parent).Error
}

// Обновить участника события
func (r *ParentRepository) Update(parent *models.Parent) error {
	updates := map[string]interface{}{}

	if parent.FirstName != "" {
		updates["first_name"] = parent.FirstName
	}
	if parent.LastName != "" {
		updates["last_name"] = parent.LastName
	}
	if parent.MiddleName != "" {
		updates["middle_name"] = parent.MiddleName
	}
	if parent.Phone != 0 {
		updates["phone"] = parent.Phone
	}
	if parent.Email != "" {
		updates["email"] = parent.Email
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Parent{}).
		Where("id = ?", parent.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *ParentRepository) Delete(id uint) error {
	return r.db.Delete(&models.Parent{}, id).Error
}
