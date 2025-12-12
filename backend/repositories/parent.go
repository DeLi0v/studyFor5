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
	result := r.db.Find(&parents)
	return parents, result.Error
}

// Получить участника события по ID
func (r *ParentRepository) GetByID(id uint) (*models.Parent, error) {
	var parent models.Parent
	result := r.db.First(&parent, id)
	return &parent, result.Error
}

// Создать нового участника события
func (r *ParentRepository) Create(parent *models.Parent) error {
	return r.db.Create(parent).Error
}

// Обновить участника события
func (r *ParentRepository) Update(parent *models.Parent) error {
	return r.db.Save(parent).Error
}

// Удалить участника события
func (r *ParentRepository) Delete(id uint) error {
	return r.db.Delete(&models.Parent{}, id).Error
}
