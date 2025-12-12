package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type EventParticipantRepository struct {
	db *gorm.DB
}

func NewEventParticipantRepository(db *gorm.DB) *EventParticipantRepository {
	return &EventParticipantRepository{db: db}
}

// Получить всех участников события
func (r *EventParticipantRepository) GetAll() ([]models.EventParticipant, error) {
	var participants []models.EventParticipant
	result := r.db.Find(&participants)
	return participants, result.Error
}

// Получить участника события по ID
func (r *EventParticipantRepository) GetByID(id uint) (*models.EventParticipant, error) {
	var participant models.EventParticipant
	result := r.db.First(&participant, id)
	return &participant, result.Error
}

// Создать нового участника события
func (r *EventParticipantRepository) Create(participant *models.EventParticipant) error {
	return r.db.Create(participant).Error
}

// Обновить участника события
func (r *EventParticipantRepository) Update(participant *models.EventParticipant) error {
	return r.db.Save(participant).Error
}

// Удалить участника события
func (r *EventParticipantRepository) Delete(id uint) error {
	return r.db.Delete(&models.EventParticipant{}, id).Error
}
