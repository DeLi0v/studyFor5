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
	result := r.db.Preload("Room").Preload("Participants").Find(&events)
	return events, result.Error
}

func (r *EventRepository) GetByID(id uint) (*models.Event, error) {
	var event models.Event
	result := r.db.Preload("Room").Preload("Participants").First(&event, id)
	return &event, result.Error
}

func (r *EventRepository) Create(event *models.Event) error {
	eventType := "event"
	event.Type = &eventType
	return r.db.Create(event).Error
}

func (r *EventRepository) Update(event *models.Event) error {

	updates := map[string]interface{}{}

	eventType := "event"
	updates["type"] = eventType

	if event.Name != nil {
		updates["name"] = event.Name
	}
	if event.Description != nil {
		updates["description"] = event.Description
	}
	if event.RoomID != nil {
		updates["room_id"] = event.RoomID
	}
	if event.EventDate != nil {
		updates["event_date"] = event.EventDate
	}
	if event.TimeStart != nil {
		updates["time_start"] = event.TimeStart
	}
	if event.TimeEnd != nil {
		updates["time_end"] = event.TimeEnd
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Event{}).
		Where("id = ?", event.ID).
		Updates(updates).Error
}

func (r *EventRepository) Delete(id uint) error {
	return r.db.Delete(&models.Event{}, id).Error
}
