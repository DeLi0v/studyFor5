package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type StudentRelationRepository struct {
	db *gorm.DB
}

func NewStudentRelationRepository(db *gorm.DB) *StudentRelationRepository {
	return &StudentRelationRepository{db: db}
}

// Получить всех участников события
func (r *StudentRelationRepository) GetAll() ([]models.StudentRelation, error) {
	var studentRelations []models.StudentRelation
	result := r.db.Find(&studentRelations)
	return studentRelations, result.Error
}

// Получить участника события по ID
func (r *StudentRelationRepository) GetByID(id uint) (*models.StudentRelation, error) {
	var studentRelation models.StudentRelation
	result := r.db.First(&studentRelation, id)
	return &studentRelation, result.Error
}

// Создать нового участника события
func (r *StudentRelationRepository) Create(studentRelation *models.StudentRelation) error {
	return r.db.Create(studentRelation).Error
}

// Обновить участника события
func (r *StudentRelationRepository) Update(studentRelation *models.StudentRelation) error {
	return r.db.Save(studentRelation).Error
}

// Удалить участника события
func (r *StudentRelationRepository) Delete(id uint) error {
	return r.db.Delete(&models.StudentRelation{}, id).Error
}
