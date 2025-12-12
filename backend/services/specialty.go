package services

import (
	"backend/models"
	"backend/repositories"
)

// SpecialtyService — слой бизнес-логики для сущности Specialty.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type SpecialtyService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.SpecialtyRepository
}

// NewSpecialtyService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewSpecialtyService(repo *repositories.SpecialtyRepository) *SpecialtyService {
	return &SpecialtyService{repo: repo}
}

// GetAll — возвращает все записи сущности Specialty.
// Обычно вызывается контроллером GET /xxx
func (s *SpecialtyService) GetAll() ([]models.Specialty, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *SpecialtyService) GetByID(id uint) (*models.Specialty, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *SpecialtyService) Create(m *models.Specialty) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *SpecialtyService) Update(m *models.Specialty) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *SpecialtyService) Delete(id uint) error {
	return s.repo.Delete(id)
}
