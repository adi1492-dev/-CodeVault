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
				"description": "The standard entry point for all programmers. Write a program that prints 'Hello, World!' to the console.",
				"starter_code": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}",
			},
			{
				"ID": 2, "title": "Addition of Two Integers", "difficulty": "easy",
				"description": "Read two integers from standard input and output their sum.",
				"starter_code": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Read input and print sum here\n    return 0;\n}",
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
		if id == "1" {
			return c.JSON(fiber.Map{
				"ID": 1, "title": "Hello World", "difficulty": "easy",
				"description": "The standard entry point for all programmers. Write a program that prints 'Hello, World!' to the console.",
				"starter_code": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}",
				"TestCases": []fiber.Map{
					{"input": "", "expected_output": "Hello, World!\n"},
				},
			})
		}
		return c.JSON(fiber.Map{
			"ID": id, "title": "Addition of Two Integers", "difficulty": "easy",
			"description": "Read two integers from standard input and output their sum.",
			"starter_code": "#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Read input and print sum here\n    return 0;\n}",
			"TestCases": []fiber.Map{
				{"input": "5 3", "expected_output": "8\n"},
				{"input": "10 20", "expected_output": "30\n"},
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
