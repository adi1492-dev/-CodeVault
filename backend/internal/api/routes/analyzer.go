package routes

import (
	"fmt"
	"strings"
)

// AnalysisResult represents the diagnostic output
type AnalysisResult struct {
	Level   string `json:"level"` // "error", "warning", "info"
	Line    int    `json:"line"`
	Message string `json:"message"`
	Code    string `json:"code"`
}

// AnalyzeCode performs script-based analysis on the provided code
func AnalyzeCode(language, code string) []AnalysisResult {
	var results []AnalysisResult

	lines := strings.Split(code, "\n")

	switch strings.ToLower(language) {
	case "c", "cpp":
		// Check for missing semicolons (basic regex-like check)
		for i, line := range lines {
			trimmed := strings.TrimSpace(line)
			if trimmed == "" || strings.HasPrefix(trimmed, "//") || strings.HasPrefix(trimmed, "#") || strings.HasSuffix(trimmed, "{") || strings.HasSuffix(trimmed, "}") || strings.HasSuffix(trimmed, ";") || strings.HasSuffix(trimmed, ":") {
				continue
			}
			// Potential missing semicolon
			if !strings.Contains(trimmed, "if") && !strings.Contains(trimmed, "for") && !strings.Contains(trimmed, "while") {
				results = append(results, AnalysisResult{
					Level:   "error",
					Line:    i + 1,
					Message: "Potential missing semicolon at end of statement.",
					Code:    "MISSING_SEMICOLON",
				})
			}
		}

		// Check for missing headers
		if !strings.Contains(code, "#include <stdio.h>") && (strings.Contains(code, "printf") || strings.Contains(code, "scanf")) {
			results = append(results, AnalysisResult{
				Level:   "warning",
				Line:    1,
				Message: "Usage of printf/scanf requires <stdio.h> header.",
				Code:    "MISSING_HEADER_STDIO",
			})
		}

		// Check for potentially unsafe functions
		if strings.Contains(code, "gets(") {
			results = append(results, AnalysisResult{
				Level:   "error",
				Line:    0,
				Message: "The 'gets' function is dangerous and should not be used. Use 'fgets' instead.",
				Code:    "UNSAFE_FUNCTION_GETS",
			})
		}

		// Check for memory leaks (simple pattern)
		if strings.Contains(code, "malloc") && !strings.Contains(code, "free") {
			results = append(results, AnalysisResult{
				Level:   "warning",
				Line:    0,
				Message: "Memory allocated with 'malloc' is never freed. Potential memory leak.",
				Code:    "MEMORY_LEAK",
			})
		}

	case "python":
		for i, line := range lines {
			if strings.Contains(line, "print ") && !strings.Contains(line, "(") {
				results = append(results, AnalysisResult{
					Level:   "error",
					Line:    i + 1,
					Message: "Python 3 requires parentheses for print functions.",
					Code:    "PYTHON3_PRINT",
				})
			}
		}
	}

	return results
}

// FixCode attempts to auto-repair common issues
func FixCode(language, code string) string {
	newCode := code

	switch strings.ToLower(language) {
	case "c", "cpp":
		// Fix missing <stdio.h>
		if !strings.Contains(newCode, "#include <stdio.h>") && (strings.Contains(newCode, "printf") || strings.Contains(newCode, "scanf")) {
			newCode = "#include <stdio.h>\n" + newCode
		}

		// Fix missing semicolons
		lines := strings.Split(newCode, "\n")
		for i, line := range lines {
			trimmed := strings.TrimSpace(line)
			if trimmed == "" || strings.HasPrefix(trimmed, "//") || strings.HasPrefix(trimmed, "#") || strings.HasSuffix(trimmed, "{") || strings.HasSuffix(trimmed, "}") || strings.HasSuffix(trimmed, ";") || strings.HasSuffix(trimmed, ":") {
				continue
			}
			if !strings.Contains(trimmed, "if") && !strings.Contains(trimmed, "for") && !strings.Contains(trimmed, "while") {
				lines[i] = line + ";"
			}
		}
		newCode = strings.Join(lines, "\n")

		// Replace gets with fgets
		if strings.Contains(newCode, "gets(") {
			newCode = strings.ReplaceAll(newCode, "gets(", "fgets(")
			fmt.Println("Warning: Replaced gets with fgets. Buffer size and stdin need manual adjustment.")
		}
	}

	return newCode
}
