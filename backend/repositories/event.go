package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type EventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) GetAll() ([]models.Event, error) {
	var events []models.Event
	result := r.db.Find(&events)
	return events, result.Error
}

func (r *EventRepository) GetByID(id uint) (*models.Event, error) {
	var event models.Event
	result := r.db.First(&event, id)
	return &event, result.Error
}

func (r *EventRepository) Create(event *models.Event) error {
	return r.db.Create(event).Error
}

func (r *EventRepository) Update(event *models.Event) error {
	return r.db.Save(event).Error
}

func (r *EventRepository) Delete(id uint) error {
	return r.db.Delete(&models.Event{}, id).Error
}
