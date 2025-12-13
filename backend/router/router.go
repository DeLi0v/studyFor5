package router

import (
	handlers "backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRouter настраивает маршруты для всех сущностей и возвращает готовый Gin Engine
func SetupRouter(
	eventHandler *handlers.EventHandler,
	eventParticipantHandler *handlers.EventParticipantHandler,
	gradeHandler *handlers.GradeHandler,
	eventGradeHandler *handlers.EventGradeHandler,
	groupHandler *handlers.GroupHandler,
	studentHandler *handlers.StudentHandler,
	studentRelationHandler *handlers.StudentRelationHandler,
	teacherHandler *handlers.TeacherHandler,
	parentHandler *handlers.ParentHandler,
	positionHandler *handlers.PositionHandler,
	lessonHandler *handlers.LessonHandler,
	roomHandler *handlers.RoomHandler,
	specialtyHandler *handlers.SpecialtyHandler,
	subjectHandler *handlers.SubjectHandler,
) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())

	// Группы маршрутов по сущностям
	api := r.Group("/api")

	// Event
	event := api.Group("/events")
	event.GET("", eventHandler.GetAll)
	event.GET("/:id", eventHandler.GetByID)
	event.POST("", eventHandler.Create)
	event.PUT("/:id", eventHandler.Update)
	event.DELETE("/:id", eventHandler.Delete)

	// EventParticipant
	eventParticipant := api.Group("/event-participants")
	eventParticipant.GET("", eventParticipantHandler.GetAll)
	eventParticipant.GET("/:id", eventParticipantHandler.GetByID)
	eventParticipant.POST("", eventParticipantHandler.Create)
	eventParticipant.PUT("/:id", eventParticipantHandler.Update)
	eventParticipant.DELETE("/:id", eventParticipantHandler.Delete)

	// Grade
	grade := api.Group("/grades")
	grade.GET("", gradeHandler.GetAll)
	grade.GET("/:id", gradeHandler.GetByID)
	grade.POST("", gradeHandler.Create)
	grade.PUT("/:id", gradeHandler.Update)
	grade.DELETE("/:id", gradeHandler.Delete)

	// Grade
	eventGrade := api.Group("/eventGrades")
	eventGrade.GET("", eventGradeHandler.GetAll)
	eventGrade.GET("/:id", eventGradeHandler.GetByID)
	eventGrade.POST("", eventGradeHandler.Create)
	eventGrade.PUT("/:id", eventGradeHandler.Update)
	eventGrade.DELETE("/:id", eventGradeHandler.Delete)

	// Group
	group := api.Group("/groups")
	group.GET("", groupHandler.GetAll)
	group.GET("/:id", groupHandler.GetByID)
	group.POST("", groupHandler.Create)
	group.PUT("/:id", groupHandler.Update)
	group.DELETE("/:id", groupHandler.Delete)

	// Student
	student := api.Group("/students")
	student.GET("", studentHandler.GetAll)
	student.GET("/:id", studentHandler.GetByID)
	student.GET("/:id/parents", studentRelationHandler.GetParentsByStudent)
	student.POST("", studentHandler.Create)
	student.PUT("/:id", studentHandler.Update)
	student.DELETE("/:id", studentHandler.Delete)

	// StudentRelation
	studentRelation := api.Group("/student-relations")
	studentRelation.GET("", studentRelationHandler.GetAll)
	studentRelation.GET("/:student_id/:parent_id", studentRelationHandler.GetByID)
	studentRelation.POST("", studentRelationHandler.Create)
	studentRelation.PUT("/:student_id/:parent_id", studentRelationHandler.Update)
	studentRelation.DELETE("/:student_id/:parent_id", studentRelationHandler.Delete)

	// Teacher
	teacher := api.Group("/teachers")
	teacher.GET("", teacherHandler.GetAll)
	teacher.GET("/:id", teacherHandler.GetByID)
	teacher.POST("", teacherHandler.Create)
	teacher.PUT("/:id", teacherHandler.Update)
	teacher.DELETE("/:id", teacherHandler.Delete)

	// Parent
	parent := api.Group("/parents")
	parent.GET("", parentHandler.GetAll)
	parent.GET("/:id", parentHandler.GetByID)
	parent.GET("/parents/:id/students", studentRelationHandler.GetStudentsByParent)
	parent.POST("", parentHandler.Create)
	parent.PUT("/:id", parentHandler.Update)
	parent.DELETE("/:id", parentHandler.Delete)

	// Lesson
	lesson := api.Group("/lessons")
	lesson.GET("", lessonHandler.GetAll)
	lesson.GET("/:id", lessonHandler.GetByID)
	lesson.POST("", lessonHandler.Create)
	lesson.PUT("/:id", lessonHandler.Update)
	lesson.DELETE("/:id", lessonHandler.Delete)

	// Position
	position := api.Group("/positions")
	position.GET("", positionHandler.GetAll)
	position.GET("/:id", positionHandler.GetByID)
	position.POST("", positionHandler.Create)
	position.PUT("/:id", positionHandler.Update)
	position.DELETE("/:id", positionHandler.Delete)

	// Room
	room := api.Group("/rooms")
	room.GET("", roomHandler.GetAll)
	room.GET("/:id", roomHandler.GetByID)
	room.POST("", roomHandler.Create)
	room.PUT("/:id", roomHandler.Update)
	room.DELETE("/:id", roomHandler.Delete)

	// Specialty
	specialty := api.Group("/specialties")
	specialty.GET("", specialtyHandler.GetAll)
	specialty.GET("/:id", specialtyHandler.GetByID)
	specialty.POST("", specialtyHandler.Create)
	specialty.PUT("/:id", specialtyHandler.Update)
	specialty.DELETE("/:id", specialtyHandler.Delete)

	// Subject
	subject := api.Group("/subjects")
	subject.GET("", subjectHandler.GetAll)
	subject.GET("/:id", subjectHandler.GetByID)
	subject.POST("", subjectHandler.Create)
	subject.PUT("/:id", subjectHandler.Update)
	subject.DELETE("/:id", subjectHandler.Delete)

	return r
}
