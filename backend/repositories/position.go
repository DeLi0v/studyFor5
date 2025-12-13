package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type PositionRepository struct {
	db *gorm.DB
}

func NewPositionRepository(db *gorm.DB) *PositionRepository {
	return &PositionRepository{db: db}
}

// Получить всех участников события
func (r *PositionRepository) GetAll() ([]models.Position, error) {
	var positions []models.Position
	result := r.db.Find(&positions)
	return positions, result.Error
}

// Получить участника события по ID
func (r *PositionRepository) GetByID(id uint) (*models.Position, error) {
	var position models.Position
	result := r.db.First(&position, id)
	return &position, result.Error
}

// Создать нового участника события
func (r *PositionRepository) Create(position *models.Position) error {
	return r.db.Create(position).Error
}

// Обновить участника события
func (r *PositionRepository) Update(position *models.Position) error {
	updates := map[string]interface{}{}

	if position.Name != "" {
		updates["name"] = position.Name
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Position{}).
		Where("id = ?", position.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *PositionRepository) Delete(id uint) error {
	return r.db.Delete(&models.Position{}, id).Error
}
