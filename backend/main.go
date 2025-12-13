package main

import (
	"backend/config"
	handlers "backend/controllers"
	"backend/repositories"
	"backend/router"
	"backend/services"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Загружаем конфигурацию (host, port, user, password, dbname)
	cfg := config.LoadConfig("config.json")

	// Подключаемся к базе PostgreSQL через GORM
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.DbName, cfg.Port, cfg.SslMode, cfg.TimeZone,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к базе:", err)
	}

	// Создаем репозитории
	eventRepo := repositories.NewEventRepository(db)
	eventParticipantRepo := repositories.NewEventParticipantRepository(db)
	gradeRepo := repositories.NewGradeRepository(db)
	eventGradeRepo := repositories.NewEventGradeRepository(db)
	groupRepo := repositories.NewGroupRepository(db)
	studentRepo := repositories.NewStudentRepository(db)
	studentRelationRepo := repositories.NewStudentRelationRepository(db)
	teacherRepo := repositories.NewTeacherRepository(db)
	parentRepo := repositories.NewParentRepository(db)
	positionRepo := repositories.NewPositionRepository(db)
	lessonRepo := repositories.NewLessonRepository(db)
	roomRepo := repositories.NewRoomRepository(db)
	specialtyRepo := repositories.NewSpecialtyRepository(db)
	subjectRepo := repositories.NewSubjectRepository(db)

	// Создаем сервисы
	eventService := services.NewEventService(eventRepo)
	eventParticipantService := services.NewEventParticipantService(eventParticipantRepo)
	gradeService := services.NewGradeService(gradeRepo)
	eventGradeService := services.NewEventGradeService(eventGradeRepo)
	groupService := services.NewGroupService(groupRepo)
	studentService := services.NewStudentService(studentRepo)
	studentRelationService := services.NewStudentRelationService(studentRelationRepo)
	teacherService := services.NewTeacherService(teacherRepo)
	parentService := services.NewParentService(parentRepo)
	positionService := services.NewPositionService(positionRepo)
	lessonService := services.NewLessonService(lessonRepo)
	roomService := services.NewRoomService(roomRepo)
	specialtyService := services.NewSpecialtyService(specialtyRepo)
	subjectService := services.NewSubjectService(subjectRepo)

	// Создаем контроллеры (handlers)
	eventHandler := handlers.NewEventHandler(eventService)
	eventParticipantHandler := handlers.NewEventParticipantHandler(eventParticipantService)
	gradeHandler := handlers.NewGradeHandler(gradeService)
	eventGradeHandler := handlers.NewEventGradeHandler(eventGradeService)
	groupHandler := handlers.NewGroupHandler(groupService)
	studentHandler := handlers.NewStudentHandler(studentService)
	studentRelationHandler := handlers.NewStudentRelationHandler(studentRelationService)
	teacherHandler := handlers.NewTeacherHandler(teacherService)
	parentHandler := handlers.NewParentHandler(parentService)
	positionHandler := handlers.NewPositionHandler(positionService)
	lessonHandler := handlers.NewLessonHandler(lessonService)
	roomHandler := handlers.NewRoomHandler(roomService)
	specialtyHandler := handlers.NewSpecialtyHandler(specialtyService)
	subjectHandler := handlers.NewSubjectHandler(subjectService)

	// Настраиваем маршруты через router
	r := router.SetupRouter(
		eventHandler,
		eventParticipantHandler,
		gradeHandler,
		eventGradeHandler,
		groupHandler,
		studentHandler,
		studentRelationHandler,
		teacherHandler,
		parentHandler,
		positionHandler,
		lessonHandler,
		roomHandler,
		specialtyHandler,
		subjectHandler,
	)

	// Запускаем сервер на порту из конфига
	log.Println("Сервер запущен на порту", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal("Ошибка запуска сервера:", err)
	}
}
