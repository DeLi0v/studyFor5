package services

import (
	"backend/models"
	"backend/repositories"
)

// LessonService — слой бизнес-логики для сущности Lesson.
// Он отделяет контроллеры (HTTP слой) от репозиториев (доступ к БД).
// Контроллеры вызывают сервисы, а сервисы — репозитории.
type LessonService struct {
	// repo — зависимость сервиса.
	// Через него сервис получает доступ к методам работы с базой.
	repo *repositories.LessonRepository
}

// NewLessonService — конструктор сервиса.
// Принимает репозиторий, который уже содержит подключение к базе.
func NewLessonService(repo *repositories.LessonRepository) *LessonService {
	return &LessonService{repo: repo}
}

// GetAll — возвращает все записи сущности Lesson.
// Обычно вызывается контроллером GET /xxx
func (s *LessonService) GetAll() ([]models.Lesson, error) {
	return s.repo.GetAll()
}

// GetByID — находит запись по её ID.
// Обычно вызывается контроллером GET /xxx/{id}
func (s *LessonService) GetByID(id uint) (*models.Lesson, error) {
	return s.repo.GetByID(id)
}

// Create — создаёт новую запись.
// Обычно вызывается контроллером POST /xxx
func (s *LessonService) Create(m *models.Lesson) error {
	// Здесь можно добавить бизнес-валидацию, если нужно.
	return s.repo.Create(m)
}

// Update — обновляет существующую запись.
// Обычно вызывается контроллером PUT /xxx/{id}
func (s *LessonService) Update(m *models.Lesson) error {
	// Можно добавить логику: проверить, существует ли запись перед обновлением.
	return s.repo.Update(m)
}

// Delete — удаляет запись по ID.
// Обычно вызывается контроллером DELETE /xxx/{id}
func (s *LessonService) Delete(id uint) error {
	return s.repo.Delete(id)
}
