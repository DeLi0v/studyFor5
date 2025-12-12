package services

import (
	"backend/models"
	"backend/repositories"
)

// TeacherService — слой бизнес-логики для сущности Teacher.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type TeacherService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.TeacherRepository
}

// NewTeacherService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewTeacherService(repo *repositories.TeacherRepository) *TeacherService {
	return &TeacherService{repo: repo}
}

// GetAll — возвращает все записи сущности Teacher.
// Обычно вызывается контроллером GET /xxx
func (s *TeacherService) GetAll() ([]models.Teacher, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *TeacherService) GetByID(id uint) (*models.Teacher, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *TeacherService) Create(m *models.Teacher) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *TeacherService) Update(m *models.Teacher) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *TeacherService) Delete(id uint) error {
	return s.repo.Delete(id)
}
