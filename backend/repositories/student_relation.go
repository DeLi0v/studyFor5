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
	result := r.db.Preload("Student").Preload("Parent").Find(&relations)
	return relations, result.Error
}

// GetByID — получить связь по составному ключу (StudentID, ParentID)
func (r *StudentRelationRepository) GetByID(studentID, parentID uint) (*models.StudentRelation, error) {
	var rel models.StudentRelation
	result := r.db.Preload("Student").Preload("Parent").First(&rel, "student_id = ? AND parent_id = ?", studentID, parentID)
	return &rel, result.Error
}

// GetParentsByStudentID — получить всех родителей по ID студента
func (r *StudentRelationRepository) GetParentsByStudentID(studentID uint) ([]models.StudentRelation, error) {
	var relations []models.StudentRelation
	result := r.db.Where("student_id = ?", studentID).Preload("Student").Preload("Parent").Find(&relations)
	return relations, result.Error
}

// GetStudentsByParentID — получить всех студентов по ID родителя
func (r *StudentRelationRepository) GetStudentsByParentID(parentID uint) ([]models.StudentRelation, error) {
	var relations []models.StudentRelation
	result := r.db.Where("parent_id = ?", parentID).Preload("Student").Preload("Parent").Find(&relations)
	return relations, result.Error
}

// Create — добавить новую связь
func (r *StudentRelationRepository) Create(rel *models.StudentRelation) error {
	return r.db.Create(rel).Error
}

// Update — обновить существующую связь
func (r *StudentRelationRepository) Update(oldRel *models.StudentRelation, newRel *models.StudentRelation) error {
	// Начинаем транзакцию, чтобы операции были атомарными
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Удаляем старую запись
		if err := tx.Delete(&models.StudentRelation{}, "student_id = ? AND parent_id = ?", oldRel.StudentID, oldRel.ParentID).Error; err != nil {
			return err
		}

		// Создаем новую запись
		if err := tx.Create(newRel).Error; err != nil {
			return err
		}

		return nil
	})
}

// Delete — удалить связь по составному ключу
func (r *StudentRelationRepository) Delete(studentID, parentID uint) error {
	return r.db.Delete(&models.StudentRelation{}, "student_id = ? AND parent_id = ?", studentID, parentID).Error
}
