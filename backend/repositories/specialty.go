package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type SpecialtyRepository struct {
	db *gorm.DB
}

func NewSpecialtyRepository(db *gorm.DB) *SpecialtyRepository {
	return &SpecialtyRepository{db: db}
}

// Получить всех участников события
func (r *SpecialtyRepository) GetAll() ([]models.Specialty, error) {
	var specials []models.Specialty
	result := r.db.Find(&specials)
	return specials, result.Error
}

// Получить участника события по ID
func (r *SpecialtyRepository) GetByID(id uint) (*models.Specialty, error) {
	var specialty models.Specialty
	result := r.db.First(&specialty, id)
	return &specialty, result.Error
}

// Создать нового участника события
func (r *SpecialtyRepository) Create(specialty *models.Specialty) error {
	return r.db.Create(specialty).Error
}

// Обновить участника события
func (r *SpecialtyRepository) Update(specialty *models.Specialty) error {
	return r.db.Save(specialty).Error
}

// Удалить участника события
func (r *SpecialtyRepository) Delete(id uint) error {
	return r.db.Delete(&models.Specialty{}, id).Error
}
