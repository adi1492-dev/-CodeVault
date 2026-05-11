package models

// ExecutionConfig defines the constraints for code execution
type ExecutionConfig struct {
	TimeoutMs int
	MemoryMB  int
}

// ExecutionResult contains the output and metadata of execution
type ExecutionResult struct {
	Success      bool
	Output       string
	Error        string
	TimeTakenMs  int64
	MemoryUsedKB int64
	CompilerUsed string
	Tokens       interface{} // For AST/Token display
	AST          interface{}
}
