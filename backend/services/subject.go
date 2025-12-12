package services

import (
	"backend/models"
	"backend/repositories"
)

// SubjectService — слой бизнес-логики для сущности Subject.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type SubjectService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.SubjectRepository
}

// NewSubjectService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewSubjectService(repo *repositories.SubjectRepository) *SubjectService {
	return &SubjectService{repo: repo}
}

// GetAll — возвращает все записи сущности Subject.
// Обычно вызывается контроллером GET /xxx
func (s *SubjectService) GetAll() ([]models.Subject, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *SubjectService) GetByID(id uint) (*models.Subject, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *SubjectService) Create(m *models.Subject) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *SubjectService) Update(m *models.Subject) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *SubjectService) Delete(id uint) error {
	return s.repo.Delete(id)
}
