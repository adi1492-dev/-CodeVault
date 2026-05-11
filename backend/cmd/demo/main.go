package main

import (
	"fmt"

	"github.com/adi1492-dev/codevault/internal/compiler"
	"github.com/adi1492-dev/codevault/internal/models"
)

func main() {
	executor := compiler.NewSmartExecutor()
	config := models.ExecutionConfig{TimeoutMs: 1000, MemoryMB: 64}

	fmt.Println("--- Case 1: Simple C code (Custom Compiler) ---")
	code1 := "void main() { printf(\"Hello\"); }"
	result1 := executor.SafeExecute(code1, "", config)
	fmt.Printf("Success: %v\nOutput: %s\nCompiler: %s\nError: %s\n\n", result1.Success, result1.Output, result1.CompilerUsed, result1.Error)

	fmt.Println("--- Case 2: Code with #include (Fallback) ---")
	code2 := "#include <stdio.h>\nint main() { return 0; }"
	result2 := executor.SafeExecute(code2, "", config)
	fmt.Printf("Success: %v\nOutput: %s\nCompiler: %s\nError: %s\n\n", result2.Success, result2.Output, result2.CompilerUsed, result2.Error)

	fmt.Println("--- Case 3: Unrecoverable Error (No Fallback) ---")
	fmt.Println("Simulated by specific error patterns like 'Division by zero'")
}
