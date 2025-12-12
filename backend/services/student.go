package services

import (
	"backend/models"
	"backend/repositories"
)

// StudentService — слой бизнес-логики для сущности Student.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type StudentService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.StudentRepository
}

// NewStudentService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewStudentService(repo *repositories.StudentRepository) *StudentService {
	return &StudentService{repo: repo}
}

// GetAll — возвращает все записи сущности Student.
// Обычно вызывается контроллером GET /xxx
func (s *StudentService) GetAll() ([]models.Student, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *StudentService) GetByID(id uint) (*models.Student, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *StudentService) Create(m *models.Student) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *StudentService) Update(m *models.Student) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *StudentService) Delete(id uint) error {
	return s.repo.Delete(id)
}
