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

	if lesson.GroupID != 0 {
		updates["group_id"] = lesson.GroupID
	}
	if lesson.SubjectID != 0 {
		updates["subject_id"] = lesson.SubjectID
	}
	if lesson.TeacherID != 0 {
		updates["teacher_id"] = lesson.TeacherID
	}
	if lesson.RoomID != 0 {
		updates["room_id"] = lesson.RoomID
	}
	if lesson.Weekday != 0 {
		updates["weekday"] = lesson.Weekday
	}
	if lesson.TimeStart.IsZero() {
		updates["time_start"] = lesson.TimeStart
	}
	if lesson.TimeEnd.IsZero() {
		updates["time_end"] = lesson.TimeEnd
	}
	if lesson.EndDate.IsZero() {
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
