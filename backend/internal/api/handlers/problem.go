package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/models"
)

func GetProblems(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON([]fiber.Map{
			{
				"ID": 1, "title": "Hello World", "difficulty": "easy", 
				"description": "Write a program that prints 'Hello, World!'",
				"starter_code": "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}",
			},
			{
				"ID": 2, "title": "Sum of Two Numbers", "difficulty": "easy",
				"description": "Read two integers and print their sum",
				"starter_code": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Read and print sum\n    return 0;\n}",
			},
		})
	}
	var problems []models.Problem
	db.DB.Where("is_published = ?", true).Find(&problems)
	return c.JSON(problems)
}

func GetProblem(c *fiber.Ctx) error {
	id := c.Params("id")
	if db.DB == nil {
		return c.JSON(fiber.Map{
			"ID": id, "title": "Stateless Sandbox Problem", "difficulty": "easy",
			"description": "Stateless coding problem executing AST token trees directly inside Go compiler memory.",
			"starter_code": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello from CampusCore Engine!\\n\");\n    return 0;\n}",
			"TestCases": []fiber.Map{
				{"input": "", "expected_output": "Hello from CampusCore Engine!\n"},
			},
		})
	}
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

	if db.DB == nil {
		problem.ID = 999
		return c.Status(201).JSON(problem)
	}

	if err := db.DB.Create(&problem).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create problem"})
	}

	return c.Status(201).JSON(problem)
}
