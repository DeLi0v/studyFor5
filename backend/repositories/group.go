package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type GroupRepository struct {
	db *gorm.DB
}

func NewGroupRepository(db *gorm.DB) *GroupRepository {
	return &GroupRepository{db: db}
}

// Получить всех участников события
func (r *GroupRepository) GetAll() ([]models.Group, error) {
	var groups []models.Group
	result := r.db.Preload("ClassTeacher").Find(&groups)
	return groups, result.Error
}

// Получить участника события по ID
func (r *GroupRepository) GetByID(id uint) (*models.Group, error) {
	var group models.Group
	result := r.db.Preload("ClassTeacher").First(&group, id)
	return &group, result.Error
}

// Создать нового участника события
func (r *GroupRepository) Create(group *models.Group) error {
	return r.db.Create(group).Error
}

// Обновить участника события
func (r *GroupRepository) Update(group *models.Group) error {
	updates := map[string]interface{}{}

	if group.Number != nil {
		updates["number"] = group.Number
	}
	if group.Parallel != nil {
		updates["parallel"] = group.Parallel
	}
	if group.AdmissionDate != nil {
		updates["admission_date"] = group.AdmissionDate
	}
	if group.ClassTeacherID != nil {
		updates["class_teacher_id"] = group.ClassTeacherID
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Group{}).
		Where("id = ?", group.ID).
		Updates(updates).Error

}

// Удалить участника события
func (r *GroupRepository) Delete(id uint) error {
	return r.db.Delete(&models.Group{}, id).Error
}
