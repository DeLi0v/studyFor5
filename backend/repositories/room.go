package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type RoomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) *RoomRepository {
	return &RoomRepository{db: db}
}

// Получить всех участников события
func (r *RoomRepository) GetAll() ([]models.Room, error) {
	var rooms []models.Room
	result := r.db.Find(&rooms)
	return rooms, result.Error
}

// Получить участника события по ID
func (r *RoomRepository) GetByID(id uint) (*models.Room, error) {
	var room models.Room
	result := r.db.First(&room, id)
	return &room, result.Error
}

// Создать нового участника события
func (r *RoomRepository) Create(room *models.Room) error {
	return r.db.Create(room).Error
}

// Обновить участника события
func (r *RoomRepository) Update(room *models.Room) error {
	updates := map[string]interface{}{}

	if room.Number != "" {
		updates["number"] = room.Number
	}
	if room.Floor != 0 {
		updates["floor"] = room.Floor
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Room{}).
		Where("id = ?", room.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *RoomRepository) Delete(id uint) error {
	return r.db.Delete(&models.Room{}, id).Error
}
