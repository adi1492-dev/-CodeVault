package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/grading"
	"github.com/adi1492-dev/codevault/internal/models"
)

func SubmitCode(c *fiber.Ctx) error {
	var input struct {
		ProblemID uint   `json:"problem_id"`
		Code      string `json:"code"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var problem models.Problem
	if db.DB == nil {
		problem = models.Problem{
			ID:          input.ProblemID,
			Title:       "Stateless Execution Problem",
			TimeLimitMs: 2000,
			TestCases: []models.TestCase{
				{Input: "", ExpectedOutput: "Hello, World!\n", Weight: 100},
			},
		}
	} else {
		if err := db.DB.Preload("TestCases").First(&problem, input.ProblemID).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{"error": "Problem not found"})
		}
	}

	// Grade the code
	gradeResult := grading.Grade(input.Code, problem)

	// Create submission record
	submission := models.Submission{
		ProblemID:       input.ProblemID,
		StudentID:       1, // Dummy student ID
		StudentName:     "Demo Student",
		Code:            input.Code,
		Status:          "completed",
		Score:           gradeResult.Score,
		TestResults:     gradeResult.TestResults,
		ExecutedAt:      time.Now(),
		CreatedAt:       time.Now(),
	}
	if db.DB != nil {
		db.DB.Create(&submission)
	} else {
		submission.ID = 777
	}

	return c.JSON(fiber.Map{
		"id":           submission.ID,
		"problem_id":   submission.ProblemID,
		"status":       submission.Status,
		"score":        submission.Score,
		"test_results": submission.TestResults,
		"tokens":       gradeResult.Tokens,
		"ast":          gradeResult.AST,
	})
}

func GetSubmission(c *fiber.Ctx) error {
	id := c.Params("id")
	if db.DB == nil {
		return c.JSON(fiber.Map{
			"id": id, "problem_id": 1, "status": "completed", "score": 100,
			"test_results": []fiber.Map{
				{"passed": true, "output": "Successfully evaluated locally in memory sandbox.", "score": 100},
			},
		})
	}
	var submission models.Submission
	if err := db.DB.Preload("TestResults").First(&submission, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Submission not found"})
	}
	return c.JSON(submission)
}
