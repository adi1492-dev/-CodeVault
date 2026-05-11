package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/models"
)

func GetProblems(c *fiber.Ctx) error {
	var problems []models.Problem
	db.DB.Where("is_published = ?", true).Find(&problems)
	return c.JSON(problems)
}

func GetProblem(c *fiber.Ctx) error {
	id := c.Params("id")
	var problem models.Problem
	if err := db.DB.Preload("TestCases", "is_hidden = ?", false).First(&problem, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Problem not found"})
	}
	return c.JSON(problem)
}

func CreateProblem(c *fiber.Ctx) error {
	var problem models.Problem
	if err := c.BodyParser(&problem); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := db.DB.Create(&problem).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create problem"})
	}

	return c.Status(201).JSON(problem)
}
