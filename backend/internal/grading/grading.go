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
	Tokens      interface{}
	AST         interface{}
}

func Grade(code string, problem models.Problem) GradeResult {
	executor := compiler.NewSmartExecutor()
	totalScore := 0
	maxScore := 0
	results := []models.TestResult{}
	var firstTokens interface{}
	var firstAST interface{}

	config := models.ExecutionConfig{
		TimeoutMs: problem.TimeLimitMs,
		MemoryMB:  problem.MemoryLimitKB / 1024,
	}

	for i, tc := range problem.TestCases {
		maxScore += tc.Weight

		execResult := executor.SafeExecute(code, tc.Input, config)

		if i == 0 {
			firstTokens = execResult.Tokens
			firstAST = execResult.AST
		}

		passed := execResult.Success && stringsTrim(execResult.Output) == stringsTrim(tc.ExpectedOutput)
		earned := 0
		if passed {
			earned = tc.Weight
			totalScore += earned
		}

		results = append(results, models.TestResult{
			TestCaseID: tc.ID,
			Input:      tc.Input,
			Expected:   tc.ExpectedOutput,
			Actual:     execResult.Output,
			Passed:     passed,
			Weight:     earned,
		})
	}

	return GradeResult{
		Score:       totalScore,
		MaxScore:    maxScore,
		TestResults: results,
		Tokens:      firstTokens,
		AST:         firstAST,
	}
}

func stringsTrim(s string) string {
	return strings.TrimSpace(s)
}
