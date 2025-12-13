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
	result := r.db.Preload("Student").Preload("Subject").Find(&grades)
	return grades, result.Error
}

// Получить участника события по ID
func (r *GradeRepository) GetByID(id uint) (*models.Grade, error) {
	var grade models.Grade
	result := r.db.Preload("Student").Preload("Subject").First(&grade, id)
	return &grade, result.Error
}

// Создать нового участника события
func (r *GradeRepository) Create(grade *models.Grade) error {
	return r.db.Create(grade).Error
}

// Обновить участника события
func (r *GradeRepository) Update(grade *models.Grade) error {
	updates := map[string]interface{}{}

	if grade.Type != "" {
		updates["type"] = grade.Type
	}
	if grade.SubjectID != 0 {
		updates["subject_id"] = grade.SubjectID
	}
	if grade.StudentID != 0 {
		updates["student_id"] = grade.StudentID
	}
	if grade.DateGiven.IsZero() {
		updates["date_given"] = grade.DateGiven
	}
	if grade.Score != 0 {
		updates["score"] = grade.Score
	}
	if grade.GradedBy != 0 {
		updates["graded_by"] = grade.GradedBy
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Grade{}).
		Where("id = ?", grade.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *GradeRepository) Delete(id uint) error {
	return r.db.Delete(&models.Grade{}, id).Error
}
