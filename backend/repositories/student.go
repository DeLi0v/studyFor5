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
	result := r.db.Preload("Group").Preload("Parents").Find(&students)
	return students, result.Error
}

// Получить участника события по ID
func (r *StudentRepository) GetByID(id uint) (*models.Student, error) {
	var student models.Student
	result := r.db.Preload("Group").Preload("Parents").First(&student, id)
	return &student, result.Error
}

// Создать нового участника события
func (r *StudentRepository) Create(student *models.Student) error {
	return r.db.Create(student).Error
}

// Обновить участника события
func (r *StudentRepository) Update(student *models.Student) error {
	updates := map[string]interface{}{}

	if student.FirstName != nil {
		updates["first_name"] = student.FirstName
	}
	if student.LastName != nil {
		updates["last_name"] = student.LastName
	}
	if student.MiddleName != nil {
		updates["middle_name"] = student.MiddleName
	}
	if student.GroupID != nil {
		updates["group_id"] = student.GroupID
	}
	if student.Phone != nil {
		updates["phone"] = student.Phone
	}
	if student.Email != nil {
		updates["email"] = student.Email
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Student{}).
		Where("id = ?", student.ID).
		Updates(updates).Error
}

// Удалить участника события
func (r *StudentRepository) Delete(id uint) error {
	return r.db.Delete(&models.Student{}, id).Error
}
