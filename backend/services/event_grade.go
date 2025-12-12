package services

import (
	"backend/models"
	"backend/repositories"
)

// EventGradeService — слой бизнес-логики для сущности EventGrade.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type EventGradeService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.EventGradeRepository
}

// NewEventGradeService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewEventGradeService(repo *repositories.EventGradeRepository) *EventGradeService {
	return &EventGradeService{repo: repo}
}

// GetAll — возвращает все записи сущности EventGrade.
// Обычно вызывается контроллером GET /xxx
func (s *EventGradeService) GetAll() ([]models.EventGrade, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *EventGradeService) GetByID(id uint) (*models.EventGrade, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *EventGradeService) Create(m *models.EventGrade) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *EventGradeService) Update(m *models.EventGrade) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *EventGradeService) Delete(id uint) error {
	return s.repo.Delete(id)
}
