package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type LessonRepository struct {
	db *gorm.DB
}

func NewLessonRepository(db *gorm.DB) *LessonRepository {
	return &LessonRepository{db: db}
}

// Получить всех участников события
func (r *LessonRepository) GetAll() ([]models.Lesson, error) {
	var lessons []models.Lesson
	result := r.db.Preload("Group").Preload("Subject").Preload("Teacher").Preload("Room").Find(&lessons)
	return lessons, result.Error
}

// Получить участника события по ID
func (r *LessonRepository) GetByID(id uint) (*models.Lesson, error) {
	var lesson models.Lesson
	result := r.db.Preload("Group").Preload("Subject").Preload("Teacher").Preload("Room").First(&lesson, id)
	return &lesson, result.Error
}

// Создать нового участника события
func (r *LessonRepository) Create(lesson *models.Lesson) error {
	return r.db.Create(lesson).Error
}

// Обновить участника события
func (r *LessonRepository) Update(lesson *models.Lesson) error {
	return r.db.Save(lesson).Error
}

// Удалить участника события
func (r *LessonRepository) Delete(id uint) error {
	return r.db.Delete(&models.Lesson{}, id).Error
}
