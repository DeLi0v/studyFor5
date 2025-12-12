package services

import (
	"backend/models"
	"backend/repositories"
)

// PositionService — слой бизнес-логики для сущности Position.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type PositionService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.PositionRepository
}

// NewPositionService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewPositionService(repo *repositories.PositionRepository) *PositionService {
	return &PositionService{repo: repo}
}

// GetAll — возвращает все записи сущности Position.
// Обычно вызывается контроллером GET /xxx
func (s *PositionService) GetAll() ([]models.Position, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *PositionService) GetByID(id uint) (*models.Position, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *PositionService) Create(m *models.Position) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *PositionService) Update(m *models.Position) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *PositionService) Delete(id uint) error {
	return s.repo.Delete(id)
}
