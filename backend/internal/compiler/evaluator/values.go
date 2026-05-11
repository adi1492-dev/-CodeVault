package evaluator

import (
	"fmt"
)

type ValueType string

const (
	INT_VALUE      = "int"
	FLOAT_VALUE    = "float"
	STRING_VALUE   = "string"
	CHAR_VALUE     = "char"
	BOOL_VALUE     = "bool"
	NULL_VALUE     = "null"
	ARRAY_VALUE    = "array"
	FUNCTION_VALUE = "function"
	RETURN_VALUE   = "return"
	BREAK_VALUE    = "break"
	CONTINUE_VALUE = "continue"
)

type Value struct {
	Type     ValueType
	IntVal   int64
	FloatVal float64
	StrVal   string
	CharVal  rune
	BoolVal  bool
	ArrayVal []Value
	FuncVal  interface{} // We'll cast this to *FunctionValue later
}

func (v Value) String() string {
	switch v.Type {
	case INT_VALUE:
		return fmt.Sprintf("%d", v.IntVal)
	case FLOAT_VALUE:
		return fmt.Sprintf("%f", v.FloatVal)
	case STRING_VALUE:
		return v.StrVal
	case CHAR_VALUE:
		return string(v.CharVal)
	case BOOL_VALUE:
		return fmt.Sprintf("%t", v.BoolVal)
	case NULL_VALUE:
		return "null"
	default:
		return "unknown"
	}
}

type FunctionValue struct {
	Parameters []string
	Body       interface{} // *parser.BlockStatement
	Env        *Environment
}
