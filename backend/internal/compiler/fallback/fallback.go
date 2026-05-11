package fallback

import (
	"github.com/adi1492-dev/codevault/internal/models"
)

// FallbackExecutor uses standard tools like TCC or GCC in Docker
type FallbackExecutor struct{}

// NewFallbackExecutor creates a new fallback executor
func NewFallbackExecutor() *FallbackExecutor {
	return &FallbackExecutor{}
}

// Execute runs the code using the standard compiler
func (f *FallbackExecutor) Execute(code string, input string, config models.ExecutionConfig) models.ExecutionResult {
	// In a real implementation, this would call TCC or a Docker container
	return models.ExecutionResult{
		Success:      true,
		Output:       "Executed using Standard Compiler (Fallback)",
		CompilerUsed: "Standard Compiler",
	}
}
