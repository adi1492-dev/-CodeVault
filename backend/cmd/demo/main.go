package main

import (
	"fmt"

	"github.com/adi1492-dev/codevault/internal/compiler"
	"github.com/adi1492-dev/codevault/internal/models"
)

func main() {
	config := models.ExecutionConfig{TimeoutMs: 5000, MemoryMB: 64}

	fmt.Println("--- Case 1: Simple C code (Native GCC) ---")
	code1 := "#include <stdio.h>\nint main() { printf(\"Hello World from GCC\"); return 0; }"
	result1 := compiler.Execute(code1, "", config)
	fmt.Printf("Success: %v\nOutput: %s\nTime: %vms\nError: %s\n\n", result1.Success, result1.Output, result1.TimeTakenMs, result1.Error)

	fmt.Println("--- Case 2: Standard IO (scanf) ---")
	code2 := "#include <stdio.h>\nint main() { int a; scanf(\"%d\", &a); printf(\"Value: %d\", a); return 0; }"
	result2 := compiler.Execute(code2, "42", config)
	fmt.Printf("Success: %v\nOutput: %s\nTime: %vms\nError: %s\n\n", result2.Success, result2.Output, result2.TimeTakenMs, result2.Error)
}
