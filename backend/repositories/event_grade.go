package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type EventGradeRepository struct {
	db *gorm.DB
}

func NewEventGradeRepository(db *gorm.DB) *EventGradeRepository {
	return &EventGradeRepository{db: db}
}

// Получить всех участников события
func (r *EventGradeRepository) GetAll() ([]models.EventGrade, error) {
	var eventGrades []models.EventGrade
	result := r.db.Preload("Teacher").Preload("Event").Preload("Student").Find(&eventGrades)
	return eventGrades, result.Error
}

// Получить участника события по ID
func (r *EventGradeRepository) GetByID(id uint) (*models.EventGrade, error) {
	var eventGrade models.EventGrade
	result := r.db.Preload("Teacher").Preload("Event").Preload("Student").First(&eventGrade, id)
	return &eventGrade, result.Error
}

// Создать нового участника события
func (r *EventGradeRepository) Create(eventGrade *models.EventGrade) error {
	return r.db.Create(eventGrade).Error
}

// Обновить участника события
func (r *EventGradeRepository) Update(eg *models.EventGrade) error {
	updates := map[string]interface{}{}

	if eg.StudentID != 0 {
		updates["student_id"] = eg.StudentID
	}
	if eg.EventID != 0 {
		updates["event_id"] = eg.EventID
	}
	if eg.EventID != 0 {
		updates["date_given"] = eg.DateGiven
	}
	if eg.EventID != 0 {
		updates["score"] = eg.Score
	}
	if eg.EventID != 0 {
		updates["graded_by"] = eg.GradedBy
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.EventGrade{}).
		Where("id = ?", eg.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *EventGradeRepository) Delete(id uint) error {
	return r.db.Delete(&models.EventGrade{}, id).Error
}
