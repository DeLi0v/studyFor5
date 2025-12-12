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
	result := r.db.Find(&eventGrades)
	return eventGrades, result.Error
}

// Получить участника события по ID
func (r *EventGradeRepository) GetByID(id uint) (*models.EventGrade, error) {
	var eventGrade models.EventGrade
	result := r.db.First(&eventGrade, id)
	return &eventGrade, result.Error
}

// Создать нового участника события
func (r *EventGradeRepository) Create(eventGrade *models.EventGrade) error {
	return r.db.Create(eventGrade).Error
}

// Обновить участника события
func (r *EventGradeRepository) Update(eventGrade *models.EventGrade) error {
	return r.db.Save(eventGrade).Error
}

// Удалить участника события
func (r *EventGradeRepository) Delete(id uint) error {
	return r.db.Delete(&models.EventGrade{}, id).Error
}
