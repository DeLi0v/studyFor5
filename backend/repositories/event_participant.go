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
	result := r.db.Preload("Event").Find(&participants)
	return participants, result.Error
}

// Получить участника события по ID
func (r *EventParticipantRepository) GetByID(id uint) (*models.EventParticipant, error) {
	var participant models.EventParticipant
	result := r.db.Preload("Event").First(&participant, id)
	return &participant, result.Error
}

// Создать нового участника события
func (r *EventParticipantRepository) Create(participant *models.EventParticipant) error {
	return r.db.Create(participant).Error
}

// Обновить участника события
func (r *EventParticipantRepository) Update(participant *models.EventParticipant) error {
	updates := map[string]interface{}{}

	if participant.EventID != nil {
		updates["participant_id"] = participant.EventID
	}
	if participant.ParticipantType != nil {
		updates["participant_type"] = participant.ParticipantType
	}
	if participant.ParticipantID != nil {
		updates["participant_id"] = participant.ParticipantID
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.EventParticipant{}).
		Where("id = ?", participant.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *EventParticipantRepository) Delete(id uint) error {
	return r.db.Delete(&models.EventParticipant{}, id).Error
}
