package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type GradeRepository struct {
	db *gorm.DB
}

func NewGradeRepository(db *gorm.DB) *GradeRepository {
	return &GradeRepository{db: db}
}

// Получить всех участников события
func (r *GradeRepository) GetAll() ([]models.Grade, error) {
	var grades []models.Grade
	result := r.db.Find(&grades)
	return grades, result.Error
}

// Получить участника события по ID
func (r *GradeRepository) GetByID(id uint) (*models.Grade, error) {
	var grade models.Grade
	result := r.db.First(&grade, id)
	return &grade, result.Error
}

// Создать нового участника события
func (r *GradeRepository) Create(grade *models.Grade) error {
	return r.db.Create(grade).Error
}

// Обновить участника события
func (r *GradeRepository) Update(grade *models.Grade) error {
	return r.db.Save(grade).Error
}

// Удалить участника события
func (r *GradeRepository) Delete(id uint) error {
	return r.db.Delete(&models.Grade{}, id).Error
}
