package services

import (
	"backend/models"
	"backend/repositories"
)

// ParentService — слой бизнес-логики для сущности Parent.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type ParentService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.ParentRepository
}

// NewParentService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewParentService(repo *repositories.ParentRepository) *ParentService {
	return &ParentService{repo: repo}
}

// GetAll — возвращает все записи сущности Parent.
// Обычно вызывается контроллером GET /xxx
func (s *ParentService) GetAll() ([]models.Parent, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *ParentService) GetByID(id uint) (*models.Parent, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *ParentService) Create(m *models.Parent) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *ParentService) Update(m *models.Parent) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *ParentService) Delete(id uint) error {
	return s.repo.Delete(id)
}
