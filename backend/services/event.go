package services

import (
	"backend/models"
	"backend/repositories"
)

// EventService — слой бизнес-логики для сущности Event.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type EventService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.EventRepository
}

// NewEventService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewEventService(repo *repositories.EventRepository) *EventService {
	return &EventService{repo: repo}
}

// GetAll — возвращает все записи сущности Event.
// Обычно вызывается контроллером GET /xxx
func (s *EventService) GetAll() ([]models.Event, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *EventService) GetByID(id uint) (*models.Event, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *EventService) Create(m *models.Event) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *EventService) Update(m *models.Event) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *EventService) Delete(id uint) error {
	return s.repo.Delete(id)
}
