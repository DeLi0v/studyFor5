package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type TeacherRepository struct {
	db *gorm.DB
}

func NewTeacherRepository(db *gorm.DB) *TeacherRepository {
	return &TeacherRepository{db: db}
}

// Получить всех участников события
func (r *TeacherRepository) GetAll() ([]models.Teacher, error) {
	var teachers []models.Teacher
	err := r.db.Preload("Position").Preload("Specialty").Preload("Groups").Preload("EventGrades").Preload("Lessons").Preload("Grades").Find(&teachers).Error
	return teachers, err
}

// Получить участника события по ID
func (r *TeacherRepository) GetByID(id uint) (*models.Teacher, error) {
	var teacher models.Teacher
	err := r.db.Preload("Position").Preload("Specialty").Preload("Groups").Preload("EventGrades").Preload("Lessons").Preload("Grades").First(&teacher, id).Error
	return &teacher, err
}

// Создать нового участника события
func (r *TeacherRepository) Create(teacher *models.Teacher) error {
	return r.db.Create(teacher).Error
}

// Обновить участника события
func (r *TeacherRepository) Update(teacher *models.Teacher) error {
	return r.db.Save(teacher).Error
}

// Удалить участника события
func (r *TeacherRepository) Delete(id uint) error {
	return r.db.Delete(&models.Teacher{}, id).Error
}
