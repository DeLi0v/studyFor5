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
	updates := map[string]interface{}{}

	if lesson.GroupID != nil {
		updates["group_id"] = lesson.GroupID
	}
	if lesson.SubjectID != nil {
		updates["subject_id"] = lesson.SubjectID
	}
	if lesson.TeacherID != nil {
		updates["teacher_id"] = lesson.TeacherID
	}
	if lesson.RoomID != nil {
		updates["room_id"] = lesson.RoomID
	}
	if lesson.Weekday != nil {
		updates["weekday"] = lesson.Weekday
	}
	if lesson.TimeStart != nil {
		updates["time_start"] = lesson.TimeStart
	}
	if lesson.TimeEnd != nil {
		updates["time_end"] = lesson.TimeEnd
	}
	if lesson.EndDate != nil {
		updates["end_date"] = lesson.EndDate
	}

	if len(updates) == 0 {
		return nil
	}

	return r.db.Model(&models.Lesson{}).
		Where("id = ?", lesson.ID).
		Updates(updates).Error

}

// Удалить участника события
func (r *LessonRepository) Delete(id uint) error {
	return r.db.Delete(&models.Lesson{}, id).Error
}
