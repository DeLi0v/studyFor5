package handlers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// StudentRelationHandler — контроллер для работы с StudentRelation
type StudentRelationHandler struct {
	service *services.StudentRelationService
}

func NewStudentRelationHandler(service *services.StudentRelationService) *StudentRelationHandler {
	return &StudentRelationHandler{service: service}
}

// GET /student_relations
func (h *StudentRelationHandler) GetAll(c *gin.Context) {
	relations, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, relations)
}

// GET /student_relations/:student_id/:parent_id
func (h *StudentRelationHandler) GetByID(c *gin.Context) {
	studentID, _ := strconv.ParseUint(c.Param("student_id"), 10, 64)
	parentID, _ := strconv.ParseUint(c.Param("parent_id"), 10, 64)

	rel, err := h.service.GetByID(uint(studentID), uint(parentID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "relation not found"})
		return
	}
	c.JSON(http.StatusOK, rel)
}

// POST /student_relations
func (h *StudentRelationHandler) Create(c *gin.Context) {
	var rel models.StudentRelation
	if err := c.ShouldBindJSON(&rel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Create(&rel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, rel)
}

// PUT /student_relations/:student_id/:parent_id
func (h *StudentRelationHandler) Update(c *gin.Context) {
	studentID, _ := strconv.ParseUint(c.Param("student_id"), 10, 64)
	parentID, _ := strconv.ParseUint(c.Param("parent_id"), 10, 64)

	var rel models.StudentRelation
	if err := c.ShouldBindJSON(&rel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rel.StudentID = uint(studentID)
	rel.ParentID = uint(parentID)

	if err := h.service.Update(&rel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rel)
}

// DELETE /student_relations/:student_id/:parent_id
func (h *StudentRelationHandler) Delete(c *gin.Context) {
	studentID, _ := strconv.ParseUint(c.Param("student_id"), 10, 64)
	parentID, _ := strconv.ParseUint(c.Param("parent_id"), 10, 64)

	if err := h.service.Delete(uint(studentID), uint(parentID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
