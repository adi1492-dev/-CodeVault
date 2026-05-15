package grading

import (
	"strings"

	"github.com/adi1492-dev/codevault/internal/compiler"
	"github.com/adi1492-dev/codevault/internal/models"
)

type GradeResult struct {
	Score       int
	MaxScore    int
	TestResults []models.TestResult
	BadgeType   string
}

// Grade evaluates a student's code against a set of problem test cases.
func Grade(code string, problem models.Problem) GradeResult {
	totalScore := 0
	maxScore := 0
	results := []models.TestResult{}

	config := models.ExecutionConfig{
		TimeoutMs: problem.TimeLimitMs,
		MemoryMB:  problem.MemoryLimitKB / 1024,
	}

	for _, tc := range problem.TestCases {
		maxScore += tc.Weight

		// Execute code using the native system compiler
		execResult := compiler.Execute(code, tc.Input, config)

		// Determine success via normalized output comparison
		actual := strings.TrimSpace(execResult.Output)
		expected := strings.TrimSpace(tc.ExpectedOutput)
		
		passed := execResult.Success && actual == expected
		
		earned := 0
		if passed {
			earned = tc.Weight
			totalScore += earned
		}

		// Surface raw compiler errors if execution failed
		finalOutput := execResult.Output
		if !execResult.Success && execResult.Error != "" {
			finalOutput = execResult.Error
		}

		results = append(results, models.TestResult{
			TestCaseID: tc.ID,
			Input:      tc.Input,
			Expected:   tc.ExpectedOutput,
			Actual:     finalOutput,
			Passed:     passed,
			Weight:     earned,
		})
	}

	status := "FAIL"
	if totalScore == maxScore && maxScore > 0 {
		status = "PASS"
	}

	return GradeResult{
		Score:       totalScore,
		MaxScore:    maxScore,
		TestResults: results,
		BadgeType:   status,
	}
}
