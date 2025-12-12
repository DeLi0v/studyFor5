package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type GroupRepository struct {
	db *gorm.DB
}

func NewGroupRepository(db *gorm.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

// Получить всех участников события
func (r *GroupRepository) GetAll() ([]models.Group, error) {
	var groups []models.Group
	result := r.db.Find(&groups)
	return groups, result.Error
}

// Получить участника события по ID
func (r *GroupRepository) GetByID(id uint) (*models.Group, error) {
	var group models.Group
	result := r.db.First(&group, id)
	return &group, result.Error
}

// Создать нового участника события
func (r *GroupRepository) Create(group *models.Group) error {
	return r.db.Create(group).Error
}

// Обновить участника события
func (r *GroupRepository) Update(group *models.Group) error {
	return r.db.Save(group).Error
}

// Удалить участника события
func (r *GroupRepository) Delete(id uint) error {
	return r.db.Delete(&models.Group{}, id).Error
}
