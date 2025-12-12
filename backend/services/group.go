package services

import (
	"backend/models"
	"backend/repositories"
)

// GroupService — слой бизнес-логики для сущности Group.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type GroupService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.GroupRepository
}

// NewGroupService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewGroupService(repo *repositories.GroupRepository) *GroupService {
	return &GroupService{repo: repo}
}

// GetAll — возвращает все записи сущности Group.
// Обычно вызывается контроллером GET /xxx
func (s *GroupService) GetAll() ([]models.Group, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *GroupService) GetByID(id uint) (*models.Group, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *GroupService) Create(m *models.Group) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *GroupService) Update(m *models.Group) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *GroupService) Delete(id uint) error {
	return s.repo.Delete(id)
}
