package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type SubjectRepository struct {
	db *gorm.DB
}

func NewSubjectRepository(db *gorm.DB) *SubjectRepository {
	return &SubjectRepository{db: db}
}

// Получить всех участников события
func (r *SubjectRepository) GetAll() ([]models.Subject, error) {
	var subjects []models.Subject
	result := r.db.Find(&subjects)
	return subjects, result.Error
}

// Получить участника события по ID
func (r *SubjectRepository) GetByID(id uint) (*models.Subject, error) {
	var subject models.Subject
	result := r.db.First(&subject, id)
	return &subject, result.Error
}

// Создать нового участника события
func (r *SubjectRepository) Create(subject *models.Subject) error {
	return r.db.Create(subject).Error
}

// Обновить участника события
func (r *SubjectRepository) Update(subject *models.Subject) error {
	return r.db.Save(subject).Error
}

// Удалить участника события
func (r *SubjectRepository) Delete(id uint) error {
	return r.db.Delete(&models.Subject{}, id).Error
}
