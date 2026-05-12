package seed

import (
	"fmt"

	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func Seed() {
	// 1. Create Default Access Profiles across all 5 Target Scopes
	hashPass := func(p string) string {
		h, _ := bcrypt.GenerateFromPassword([]byte(p), 14)
		return string(h)
	}

	users := []models.User{
		{Name: "Dr. Ramesh S.", Email: "admin@campuscore.edu", Password: hashPass("admin123"), Role: "admin"},
		{Name: "Prof. Anjali M.", Email: "ct@campuscore.edu", Password: hashPass("classteacher123"), Role: "classteacher"},
		{Name: "Mr. Vikram K.", Email: "st@campuscore.edu", Password: hashPass("subjectteacher123"), Role: "subjectteacher"},
		{Name: "Aarav Nikam", Email: "student@campuscore.edu", Password: hashPass("student123"), Role: "student", StudentID: "CS-01"},
		{Name: "Mrs. Sunita Nikam", Email: "parent@campuscore.edu", Password: hashPass("parent123"), Role: "parent"},
	}

	for _, u := range users {
		db.DB.FirstOrCreate(&u, models.User{Email: u.Email})
	}

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
