package services

import (
	"backend/models"
	"backend/repositories"
)

// StudentRelationService — слой бизнес-логики
type StudentRelationService struct {
	repo *repositories.StudentRelationRepository
}

func NewStudentRelationService(repo *repositories.StudentRelationRepository) *StudentRelationService {
	return &StudentRelationService{repo: repo}
}

func (s *StudentRelationService) GetAll() ([]models.StudentRelation, error) {
	return s.repo.GetAll()
}

func (s *StudentRelationService) GetByID(studentID, parentID uint) (*models.StudentRelation, error) {
	return s.repo.GetByID(studentID, parentID)
}

func (s *StudentRelationService) GetParentsByStudentID(studentID uint) ([]models.StudentRelation, error) {
	return s.repo.GetParentsByStudentID(studentID)
}

func (s *StudentRelationService) GetStudentsByParentID(parentID uint) ([]models.StudentRelation, error) {
	return s.repo.GetStudentsByParentID(parentID)
}

func (s *StudentRelationService) Create(rel *models.StudentRelation) error {
	return s.repo.Create(rel)
}

func (s *StudentRelationService) Update(oldRel *models.StudentRelation, newRel *models.StudentRelation) error {
	return s.repo.Update(oldRel, newRel)
}

func (s *StudentRelationService) Delete(studentID, parentID uint) error {
	return s.repo.Delete(studentID, parentID)
}
