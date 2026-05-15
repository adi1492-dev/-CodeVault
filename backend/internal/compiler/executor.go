package compiler

import (
	"strings"

	"github.com/adi1492-dev/codevault/internal/compiler/fallback"
	"github.com/adi1492-dev/codevault/internal/models"
)

type SmartExecutor struct {
	CustomCompiler bool
	Fallback       *fallback.FallbackExecutor
}

func NewSmartExecutor() *SmartExecutor {
	return &SmartExecutor{
		CustomCompiler: true,
		Fallback:       fallback.NewFallbackExecutor(),
	}
}

func (se *SmartExecutor) SafeExecute(code string, input string, config models.ExecutionConfig) models.ExecutionResult {
	if se.CustomCompiler {
		return Execute(code, input, config)
	}

	return se.Fallback.Execute(code, input, config)
}

func isRecoverableError(errorMsg string) bool {
	// If the custom compiler doesn't understand the syntax, it's a recoverable error.
	// Critical errors like Time Limit Exceeded or Division by zero are NOT recoverable.
	unrecoverable := []string{
		"Time Limit Exceeded",
		"Division by zero",
		"index out of range",
	}

	for _, s := range unrecoverable {
		if strings.Contains(errorMsg, s) {
			return false
		}
	}

	return true
}
