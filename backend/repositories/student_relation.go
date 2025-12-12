package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

// StudentRelationRepository — репозиторий для работы с таблицей student_relations
type StudentRelationRepository struct {
	db *gorm.DB
}

func NewStudentRelationRepository(db *gorm.DB) *StudentRelationRepository {
	return &StudentRelationRepository{db: db}
}

// GetAll — получить все связи студентов и родителей
func (r *StudentRelationRepository) GetAll() ([]models.StudentRelation, error) {
	var relations []models.StudentRelation
	result := r.db.Find(&relations)
	return relations, result.Error
}

// GetByID — получить связь по составному ключу (StudentID, ParentID)
func (r *StudentRelationRepository) GetByID(studentID, parentID uint) (*models.StudentRelation, error) {
	var rel models.StudentRelation
	result := r.db.First(&rel, "student_id = ? AND parent_id = ?", studentID, parentID)
	return &rel, result.Error
}

// Create — добавить новую связь
func (r *StudentRelationRepository) Create(rel *models.StudentRelation) error {
	return r.db.Create(rel).Error
}

// Update — обновить существующую связь
func (r *StudentRelationRepository) Update(rel *models.StudentRelation) error {
	return r.db.Save(rel).Error
}

// Delete — удалить связь по составному ключу
func (r *StudentRelationRepository) Delete(studentID, parentID uint) error {
	return r.db.Delete(&models.StudentRelation{}, "student_id = ? AND parent_id = ?", studentID, parentID).Error
}
