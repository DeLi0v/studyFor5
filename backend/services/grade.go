package services

import (
	"backend/models"
	"backend/repositories"
)

// GradeService — слой бизнес-логики для сущности Grade.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type GradeService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.GradeRepository
}

// NewGradeService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewGradeService(repo *repositories.GradeRepository) *GradeService {
	return &GradeService{repo: repo}
}

// GetAll — возвращает все записи сущности Grade.
// Обычно вызывается контроллером GET /xxx
func (s *GradeService) GetAll() ([]models.Grade, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *GradeService) GetByID(id uint) (*models.Grade, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *GradeService) Create(m *models.Grade) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *GradeService) Update(m *models.Grade) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *GradeService) Delete(id uint) error {
	return s.repo.Delete(id)
}
