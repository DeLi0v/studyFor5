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
	result := r.db.Preload("Teachers").Find(&positions)
	return positions, result.Error
}

// Получить участника события по ID
func (r *PositionRepository) GetByID(id uint) (*models.Position, error) {
	var position models.Position
	result := r.db.Preload("Teachers").First(&position, id)
	return &position, result.Error
}

// Создать нового участника события
func (r *PositionRepository) Create(position *models.Position) error {
	return r.db.Create(position).Error
}

// Обновить участника события
func (r *PositionRepository) Update(position *models.Position) error {
	return r.db.Save(position).Error
}

// Удалить участника события
func (r *PositionRepository) Delete(id uint) error {
	return r.db.Delete(&models.Position{}, id).Error
}
