package services

import (
	"backend/models"
	"backend/repositories"
)

// EventParticipantService — слой бизнес-логики для сущности EventParticipant.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type EventParticipantService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.EventParticipantRepository
}

// NewEventParticipantService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewEventParticipantService(repo *repositories.EventParticipantRepository) *EventParticipantService {
	return &EventParticipantService{repo: repo}
}

// GetAll — возвращает все записи сущности EventParticipant.
// Обычно вызывается контроллером GET /xxx
func (s *EventParticipantService) GetAll() ([]models.EventParticipant, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *EventParticipantService) GetByID(id uint) (*models.EventParticipant, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *EventParticipantService) Create(m *models.EventParticipant) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *EventParticipantService) Update(m *models.EventParticipant) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *EventParticipantService) Delete(id uint) error {
	return s.repo.Delete(id)
}
