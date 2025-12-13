package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type StudentRepository struct {
	db *gorm.DB
}

func NewStudentRepository(db *gorm.DB) *StudentRepository {
	return &StudentRepository{db: db}
}

// Получить всех участников события
func (r *StudentRepository) GetAll() ([]models.Student, error) {
	var students []models.Student
	result := r.db.Preload("Grades").Preload("EventGrades").Preload("Parents").Find(&students)
	return students, result.Error
}

// Получить участника события по ID
func (r *StudentRepository) GetByID(id uint) (*models.Student, error) {
	var student models.Student
	result := r.db.First(&student, id)
	return &student, result.Error
}

// Создать нового участника события
func (r *StudentRepository) Create(student *models.Student) error {
	return r.db.Create(student).Error
}

// Обновить участника события
func (r *StudentRepository) Update(student *models.Student) error {
	return r.db.Save(student).Error
}

// Удалить участника события
func (r *StudentRepository) Delete(id uint) error {
	return r.db.Delete(&models.Student{}, id).Error
}
