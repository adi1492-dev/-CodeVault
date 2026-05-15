package compiler

import (
	"bytes"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/adi1492-dev/codevault/internal/models"
)

// Execute takes C code and input, compiles it with GCC, and returns the result.
func Execute(code string, input string, config models.ExecutionConfig) models.ExecutionResult {
	start := time.Now()
	
	// 1. Create a clean sandbox
	tempDir, err := os.MkdirTemp("", "cc-sandbox-*")
	if err != nil {
		return models.ExecutionResult{Success: false, Error: "System Error: Failed to initialize sandbox"}
	}
	defer os.RemoveAll(tempDir)

	sourcePath := filepath.Join(tempDir, "main.c")
	outputPath := filepath.Join(tempDir, "main.exe")

	if err := os.WriteFile(sourcePath, []byte(code), 0644); err != nil {
		return models.ExecutionResult{Success: false, Error: "System Error: Failed to write source file"}
	}

	// 2. Compilation Phase
	gccPath := `C:\MinGW\bin\gcc.exe`
	gccBinDir := filepath.Dir(gccPath)
	
	compileCmd := exec.Command(gccPath, sourcePath, "-o", outputPath)
	
	// Inject GCC path to ensure sub-tools are found
	env := os.Environ()
	pathFound := false
	for i, v := range env {
		if strings.HasPrefix(strings.ToUpper(v), "PATH=") {
			env[i] = v + ";" + gccBinDir
			pathFound = true
			break
		}
	}
	if !pathFound {
		env = append(env, "PATH="+gccBinDir)
	}
	compileCmd.Env = env
	
	var compileOut bytes.Buffer
	compileCmd.Stdout = &compileOut
	compileCmd.Stderr = &compileOut

	if err := compileCmd.Run(); err != nil {
		return models.ExecutionResult{
			Success: false,
			Error:   "Compilation Error:\n" + compileOut.String(),
		}
	}

	// 3. Execution Phase
	runCmd := exec.Command(outputPath)
	var stdout, stderr bytes.Buffer
	runCmd.Stdout = &stdout
	runCmd.Stderr = &stderr
	runCmd.Stdin = bytes.NewBufferString(input)

	timeout := time.Duration(config.TimeoutMs) * time.Millisecond
	if timeout == 0 {
		timeout = 10 * time.Second
	}

	done := make(chan error, 1)
	go func() {
		done <- runCmd.Run()
	}()

	select {
	case <-time.After(timeout):
		if runCmd.Process != nil {
			runCmd.Process.Kill()
		}
		return models.ExecutionResult{
			Success:     false,
			Error:       "Execution Timeout (TLE)",
			TimeTakenMs: time.Since(start).Milliseconds(),
		}
	case err := <-done:
		if err != nil {
			return models.ExecutionResult{
				Success:     false,
				Error:       "Runtime Error:\n" + stderr.String(),
				TimeTakenMs: time.Since(start).Milliseconds(),
			}
		}
	}

	return models.ExecutionResult{
		Success:     true,
		Output:      stdout.String(),
		TimeTakenMs: time.Since(start).Milliseconds(),
	}
}
