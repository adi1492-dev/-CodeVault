package evaluator

import (
	"fmt"
	"strings"

	"github.com/adi1492-dev/codevault/internal/compiler/parser"
)

type Environment struct {
	store    map[string]Value
	parent   *Environment
	Output   strings.Builder
	Input    strings.Builder
	InputPos int
}

func NewEnvironment(parent *Environment) *Environment {
	return &Environment{
		store:  make(map[string]Value),
		parent: parent,
	}
}

func (e *Environment) Get(name string) (Value, bool) {
	val, ok := e.store[name]
	if !ok && e.parent != nil {
		return e.parent.Get(name)
	}
	return val, ok
}

func (e *Environment) Set(name string, val Value) {
	// If already exists in parent, update it there
	if _, ok := e.store[name]; !ok && e.parent != nil {
		if _, okParent := e.parent.Get(name); okParent {
			e.parent.Set(name, val)
			return
		}
	}
	e.store[name] = val
}

func (e *Environment) Write(s string) {
	curr := e
	for curr.parent != nil {
		curr = curr.parent
	}
	curr.Output.WriteString(s)
}

func Eval(node parser.Node, env *Environment) Value {
	if node == nil {
		return Value{Type: NULL_VALUE}
	}

	switch n := node.(type) {
	case *parser.Program:
		return evalProgram(n, env)

	case *parser.BlockStatement:
		return evalBlockStatement(n, env)

	case *parser.ExpressionStatement:
		return Eval(n.Expression, env)

	case *parser.ReturnStatement:
		if n.ReturnValue == nil {
			return Value{Type: RETURN_VALUE, ReturnedVal: &Value{Type: NULL_VALUE}}
		}
		val := Eval(n.ReturnValue, env)
		return Value{Type: RETURN_VALUE, IntVal: val.IntVal, FloatVal: val.FloatVal, StrVal: val.StrVal, BoolVal: val.BoolVal, ReturnedVal: &val}

	case *parser.VarDeclaration:
		var val Value
		if n.Initializer != nil {
			val = Eval(n.Initializer, env)
		} else {
			val = Value{Type: INT_VALUE, IntVal: 0} // Default for int in C
		}
		env.Set(n.Name, val)
		return Value{Type: NULL_VALUE}

	case *parser.FunctionDeclaration:
		params := []string{}
		for _, p := range n.Parameters {
			params = append(params, p.Name)
		}
		fnVal := &FunctionValue{
			Parameters: params,
			Body:       n.Body,
			Env:        env,
		}
		env.Set(n.Name, Value{Type: FUNCTION_VALUE, FuncVal: fnVal})
		return Value{Type: NULL_VALUE}

	case *parser.IntegerLiteral:
		return Value{Type: INT_VALUE, IntVal: n.Value}

	case *parser.StringLiteral:
		return Value{Type: STRING_VALUE, StrVal: n.Value}

	case *parser.Identifier:
		val, ok := env.Get(n.Value)
		if !ok {
			panic(fmt.Sprintf("identifier not found: %s", n.Value))
		}
		return val

	case *parser.BinaryExpression:
		left := Eval(n.Left, env)
		right := Eval(n.Right, env)
		return evalBinaryExpression(n.Operator, left, right)

	case *parser.IfStatement:
		condition := Eval(n.Condition, env)
		if isTrue(condition) {
			return Eval(n.Consequence, env)
		} else if n.Alternative != nil {
			return Eval(n.Alternative, env)
		}
		return Value{Type: NULL_VALUE}

	case *parser.CallExpression:
		return evalCallExpression(n, env)
	
	case *parser.AssignmentExpression:
		val := Eval(n.Value, env)
		env.Set(n.Name, val)
		return val
	}

	return Value{Type: NULL_VALUE}
}

func evalProgram(p *parser.Program, env *Environment) Value {
	var result Value
	for _, stmt := range p.Statements {
		result = Eval(stmt, env)
		if result.Type == RETURN_VALUE {
			if result.ReturnedVal != nil {
				return *result.ReturnedVal
			}
			return result
		}
	}
	// Auto-execute main() if defined
	if mainVal, ok := env.Get("main"); ok && mainVal.Type == FUNCTION_VALUE {
		if fn, ok := mainVal.FuncVal.(*FunctionValue); ok {
			if block, ok := fn.Body.(*parser.BlockStatement); ok {
				res := evalBlockStatement(block, NewEnvironment(fn.Env))
				if res.Type == RETURN_VALUE && res.ReturnedVal != nil {
					return *res.ReturnedVal
				}
				return res
			}
		}
	}
	return result
}

func evalBlockStatement(block *parser.BlockStatement, env *Environment) Value {
	var result Value
	newEnv := NewEnvironment(env)
	for _, stmt := range block.Statements {
		result = Eval(stmt, newEnv)
		if result.Type == RETURN_VALUE || result.Type == BREAK_VALUE || result.Type == CONTINUE_VALUE {
			return result
		}
	}
	return result
}

func evalBinaryExpression(op string, left, right Value) Value {
	if left.Type == INT_VALUE && right.Type == INT_VALUE {
		return evalIntegerBinaryExpression(op, left.IntVal, right.IntVal)
	}
	// Add float and other types...
	return Value{Type: NULL_VALUE}
}

func evalIntegerBinaryExpression(op string, left, right int64) Value {
	switch op {
	case "+":
		return Value{Type: INT_VALUE, IntVal: left + right}
	case "-":
		return Value{Type: INT_VALUE, IntVal: left - right}
	case "*":
		return Value{Type: INT_VALUE, IntVal: left * right}
	case "/":
		if right == 0 {
			panic("Division by zero")
		}
		return Value{Type: INT_VALUE, IntVal: left / right}
	case "==":
		return Value{Type: BOOL_VALUE, BoolVal: left == right}
	case "!=":
		return Value{Type: BOOL_VALUE, BoolVal: left != right}
	case "<":
		return Value{Type: BOOL_VALUE, BoolVal: left < right}
	case ">":
		return Value{Type: BOOL_VALUE, BoolVal: left > right}
	}
	return Value{Type: NULL_VALUE}
}

func isTrue(v Value) bool {
	switch v.Type {
	case BOOL_VALUE:
		return v.BoolVal
	case INT_VALUE:
		return v.IntVal != 0
	case NULL_VALUE:
		return false
	default:
		return true
	}
}

func evalCallExpression(n *parser.CallExpression, env *Environment) Value {
	// Handle Built-ins first
	if ident, ok := n.Function.(*parser.Identifier); ok {
		if ident.Value == "printf" {
			return handlePrintf(n.Arguments, env)
		}
		// Add more built-ins...
		
		// Check if it's a custom function in env
		if fnVal, ok := env.Get(ident.Value); ok && fnVal.Type == FUNCTION_VALUE {
			if fn, ok := fnVal.FuncVal.(*FunctionValue); ok {
				callEnv := NewEnvironment(fn.Env)
				for i, paramName := range fn.Parameters {
					if i < len(n.Arguments) {
						callEnv.Set(paramName, Eval(n.Arguments[i], env))
					} else {
						callEnv.Set(paramName, Value{Type: NULL_VALUE})
					}
				}
				if block, ok := fn.Body.(*parser.BlockStatement); ok {
					res := evalBlockStatement(block, callEnv)
					if res.Type == RETURN_VALUE && res.ReturnedVal != nil {
						return *res.ReturnedVal
					}
					return res
				}
			}
		}
	}
	
	return Value{Type: NULL_VALUE}
}

func handlePrintf(args []parser.Expression, env *Environment) Value {
	if len(args) == 0 {
		return Value{Type: NULL_VALUE}
	}
	formatVal := Eval(args[0], env)
	if formatVal.Type != STRING_VALUE {
		return Value{Type: NULL_VALUE}
	}
	
	format := formatVal.StrVal
	var out strings.Builder
	argIdx := 1
	
	for i := 0; i < len(format); i++ {
		if format[i] == '%' && i+1 < len(format) && argIdx < len(args) {
			val := Eval(args[argIdx], env)
			switch format[i+1] {
			case 'd':
				out.WriteString(fmt.Sprintf("%d", val.IntVal))
			case 's':
				out.WriteString(val.StrVal)
			}
			i++
			argIdx++
		} else if format[i] == '\\' && i+1 < len(format) {
			switch format[i+1] {
			case 'n':
				out.WriteByte('\n')
			case 't':
				out.WriteByte('\t')
			case '"':
				out.WriteByte('"')
			case '\\':
				out.WriteByte('\\')
			default:
				out.WriteByte(format[i+1])
			}
			i++
		} else {
			out.WriteByte(format[i])
		}
	}
	
	env.Write(out.String())
	return Value{Type: NULL_VALUE}
}
