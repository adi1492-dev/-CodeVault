package compiler

import (
	"context"
	"fmt"
	"time"

	"github.com/adi1492-dev/codevault/internal/compiler/evaluator"
	"github.com/adi1492-dev/codevault/internal/compiler/lexer"
	"github.com/adi1492-dev/codevault/internal/compiler/parser"
	"github.com/adi1492-dev/codevault/internal/models"
)

func Execute(code string, input string, config models.ExecutionConfig) models.ExecutionResult {
	start := time.Now()

	// 1. Lexical Analysis
	l := lexer.New(code)
	tokens, _ := l.Tokenize()

	// 2. Syntactic Analysis
	p := parser.New(lexer.New(code))
	ast := p.ParseProgram()

	if len(p.Errors()) > 0 {
		return models.ExecutionResult{
			Success:      false,
			Error:        p.Errors()[0], // Return first error for simplicity
			Tokens:       tokens,
			CompilerUsed: "Custom Go Micro-Compiler ⚡",
		}
	}

	// 3. Execution
	env := evaluator.NewEnvironment(nil)
	env.Input.WriteString(input)

	// Use context for timeout
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(config.TimeoutMs)*time.Millisecond)
	defer cancel()

	resultChan := make(chan models.ExecutionResult)

	go func() {
		defer func() {
			if r := recover(); r != nil {
				resultChan <- models.ExecutionResult{
					Success:      false,
					Error:        fmt.Sprintf("Runtime Error: %v", r),
					Tokens:       tokens,
					AST:          parser.ToJSON(ast),
					CompilerUsed: "Custom Go Micro-Compiler ⚡",
				}
			}
		}()

		evaluator.Eval(ast, env)
		resultChan <- models.ExecutionResult{
			Success:      true,
			Output:       env.Output.String(),
			Tokens:       tokens,
			AST:          parser.ToJSON(ast),
			CompilerUsed: "Custom Go Micro-Compiler ⚡",
		}
	}()

	select {
	case res := <-resultChan:
		res.TimeTakenMs = time.Since(start).Milliseconds()
		return res
	case <-ctx.Done():
		return models.ExecutionResult{
			Success:      false,
			Error:        "Time Limit Exceeded",
			Tokens:       tokens,
			AST:          parser.ToJSON(ast),
			TimeTakenMs:  time.Since(start).Milliseconds(),
			CompilerUsed: "Custom Go Micro-Compiler ⚡",
		}
	}
}
