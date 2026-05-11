package seed

import (
	"fmt"

	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func Seed() {
	// 1. Create Teacher
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), 14)
	teacher := models.User{
		Name:     "Demo Teacher",
		Email:    "teacher@codevault.edu",
		Password: string(hashedPassword),
		Role:     "teacher",
	}
	db.DB.FirstOrCreate(&teacher, models.User{Email: "teacher@codevault.edu"})

	// 2. Create Problems
	problems := []models.Problem{
		{
			Title:       "Hello World",
			Description: "Write a program that prints 'Hello, World!'",
			Difficulty:  "easy",
			StarterCode: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}",
			TimeLimitMs: 2000,
			IsPublished: true,
			TestCases: []models.TestCase{
				{Input: "", ExpectedOutput: "Hello, World!\n", IsHidden: false, Weight: 10},
			},
		},
		{
			Title:       "Sum of Two Numbers",
			Description: "Read two integers and print their sum",
			Difficulty:  "easy",
			StarterCode: "#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Read and print sum\n    return 0;\n}",
			TimeLimitMs: 2000,
			IsPublished: true,
			TestCases: []models.TestCase{
				{Input: "5 3\n", ExpectedOutput: "8\n", IsHidden: false, Weight: 5},
				{Input: "-10 20\n", ExpectedOutput: "10\n", IsHidden: false, Weight: 5},
				{Input: "100 200\n", ExpectedOutput: "300\n", IsHidden: true, Weight: 10},
			},
		},
		{
			Title:       "Factorial Calculator",
			Description: "Calculate factorial of N using recursion or loops",
			Difficulty:  "medium",
			StarterCode: "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // Calculate factorial\n    return 0;\n}",
			TimeLimitMs: 2000,
			IsPublished: true,
			TestCases: []models.TestCase{
				{Input: "5\n", ExpectedOutput: "120\n", IsHidden: false, Weight: 5},
				{Input: "0\n", ExpectedOutput: "1\n", IsHidden: false, Weight: 5},
				{Input: "7\n", ExpectedOutput: "5040\n", IsHidden: true, Weight: 10},
			},
		},
	}

	for _, p := range problems {
		db.DB.FirstOrCreate(&p, models.Problem{Title: p.Title})
	}

	fmt.Println("Database seeded successfully")
}
