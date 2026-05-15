package parser

import (
	"bytes"
	"fmt"
	"strings"
)

// Node interface
type Node interface {
	TokenLiteral() string
	String() string
}

// Statement interface
type Statement interface {
	Node
	statementNode()
}

// Expression interface
type Expression interface {
	Node
	expressionNode()
}

// --- Program (Root) ---
type Program struct {
	Statements []Statement
}

func (p *Program) TokenLiteral() string {
	if len(p.Statements) > 0 {
		return p.Statements[0].TokenLiteral()
	}
	return ""
}

func (p *Program) String() string {
	var out bytes.Buffer
	for _, s := range p.Statements {
		out.WriteString(s.String())
	}
	return out.String()
}

// --- Statements ---

type VarDeclaration struct {
	Type        string
	Name        string
	Initializer Expression
	IsArray     bool
	Size        int
}

type MultiVarDeclaration struct {
	Declarations []*VarDeclaration
}

func (mv *MultiVarDeclaration) statementNode()       {}
func (mv *MultiVarDeclaration) TokenLiteral() string { return "multi_var" }
func (mv *MultiVarDeclaration) String() string {
	var out bytes.Buffer
	for i, d := range mv.Declarations {
		if i > 0 {
			out.WriteString(", ")
		}
		out.WriteString(d.String())
	}
	return out.String()
}

func (vd *VarDeclaration) statementNode()       {}
func (vd *VarDeclaration) TokenLiteral() string { return vd.Type }
func (vd *VarDeclaration) String() string {
	var out bytes.Buffer
	out.WriteString(vd.Type + " " + vd.Name)
	if vd.IsArray {
		out.WriteString("[]")
	}
	if vd.Initializer != nil {
		out.WriteString(" = " + vd.Initializer.String())
	}
	out.WriteString(";")
	return out.String()
}

type FunctionDeclaration struct {
	ReturnType string
	Name       string
	Parameters []*Parameter
	Body       Statement
}

func (fd *FunctionDeclaration) statementNode()       {}
func (fd *FunctionDeclaration) TokenLiteral() string { return fd.ReturnType }
func (fd *FunctionDeclaration) String() string {
	var out bytes.Buffer
	out.WriteString(fd.ReturnType + " " + fd.Name + "(")
	params := []string{}
	for _, p := range fd.Parameters {
		params = append(params, p.String())
	}
	out.WriteString(strings.Join(params, ", "))
	out.WriteString(") ")
	out.WriteString(fd.Body.String())
	return out.String()
}

type Parameter struct {
	Type string
	Name string
}

func (p *Parameter) String() string { return p.Type + " " + p.Name }

type BlockStatement struct {
	Statements []Statement
}

func (bs *BlockStatement) statementNode()       {}
func (bs *BlockStatement) TokenLiteral() string { return "{" }
func (bs *BlockStatement) String() string {
	var out bytes.Buffer
	out.WriteString("{")
	for _, s := range bs.Statements {
		out.WriteString(s.String())
	}
	out.WriteString("}")
	return out.String()
}

type ReturnStatement struct {
	ReturnValue Expression
}

func (rs *ReturnStatement) statementNode()       {}
func (rs *ReturnStatement) TokenLiteral() string { return "return" }
func (rs *ReturnStatement) String() string {
	var out bytes.Buffer
	out.WriteString("return ")
	if rs.ReturnValue != nil {
		out.WriteString(rs.ReturnValue.String())
	}
	out.WriteString(";")
	return out.String()
}

type BreakStatement struct{}

func (bs *BreakStatement) statementNode()       {}
func (bs *BreakStatement) TokenLiteral() string { return "break" }
func (bs *BreakStatement) String() string       { return "break;" }

type ContinueStatement struct{}

func (cs *ContinueStatement) statementNode()       {}
func (cs *ContinueStatement) TokenLiteral() string { return "continue" }
func (cs *ContinueStatement) String() string       { return "continue;" }

type IfStatement struct {
	Condition   Expression
	Consequence Statement
	Alternative Statement
}

func (is *IfStatement) statementNode()       {}
func (is *IfStatement) TokenLiteral() string { return "if" }
func (is *IfStatement) String() string {
	var out bytes.Buffer
	out.WriteString("if " + is.Condition.String() + " " + is.Consequence.String())
	if is.Alternative != nil {
		out.WriteString(" else " + is.Alternative.String())
	}
	return out.String()
}

type ExpressionStatement struct {
	Expression Expression
}

func (es *ExpressionStatement) statementNode()       {}
func (es *ExpressionStatement) TokenLiteral() string { return "" }
func (es *ExpressionStatement) String() string {
	if es.Expression != nil {
		return es.Expression.String() + ";"
	}
	return ""
}

// --- Expressions ---

type Identifier struct {
	Value string
}

func (i *Identifier) expressionNode()      {}
func (i *Identifier) TokenLiteral() string { return i.Value }
func (i *Identifier) String() string       { return i.Value }

type IntegerLiteral struct {
	Value int64
}

func (il *IntegerLiteral) expressionNode()      {}
func (il *IntegerLiteral) TokenLiteral() string { return "int" }
func (il *IntegerLiteral) String() string       { return fmt.Sprintf("%d", il.Value) }

type FloatLiteral struct {
	Value float64
}

func (fl *FloatLiteral) expressionNode()      {}
func (fl *FloatLiteral) TokenLiteral() string { return "float" }
func (fl *FloatLiteral) String() string       { return fmt.Sprintf("%f", fl.Value) }

type StringLiteral struct {
	Value string
}

func (sl *StringLiteral) expressionNode()      {}
func (sl *StringLiteral) TokenLiteral() string { return sl.Value }
func (sl *StringLiteral) String() string       { return "\"" + sl.Value + "\"" }

type CharLiteral struct {
	Value rune
}

func (cl *CharLiteral) expressionNode()      {}
func (cl *CharLiteral) TokenLiteral() string { return string(cl.Value) }
func (cl *CharLiteral) String() string       { return "'" + string(cl.Value) + "'" }

type UnaryExpression struct {
	Operator string
	Right    Expression
}

func (ue *UnaryExpression) expressionNode()      {}
func (ue *UnaryExpression) TokenLiteral() string { return ue.Operator }
func (ue *UnaryExpression) String() string       { return "(" + ue.Operator + ue.Right.String() + ")" }


type PostfixExpression struct {
	Operator string
	Left     Expression
}

func (pe *PostfixExpression) expressionNode()      {}
func (pe *PostfixExpression) TokenLiteral() string { return pe.Operator }
func (pe *PostfixExpression) String() string       { return "(" + pe.Left.String() + pe.Operator + ")" }

type BinaryExpression struct {
	Left     Expression
	Operator string
	Right    Expression
}

func (be *BinaryExpression) expressionNode()      {}
func (be *BinaryExpression) TokenLiteral() string { return be.Operator }
func (be *BinaryExpression) String() string {
	return "(" + be.Left.String() + " " + be.Operator + " " + be.Right.String() + ")"
}

type CallExpression struct {
	Function  Expression
	Arguments []Expression
}

func (ce *CallExpression) expressionNode()      {}
func (ce *CallExpression) TokenLiteral() string { return ce.Function.TokenLiteral() }
func (ce *CallExpression) String() string {
	var out bytes.Buffer
	args := []string{}
	for _, a := range ce.Arguments {
		args = append(args, a.String())
	}
	out.WriteString(ce.Function.String())
	out.WriteString("(")
	out.WriteString(strings.Join(args, ", "))
	out.WriteString(")")
	return out.String()
}

type IndexExpression struct {
	Left  Expression
	Index Expression
}

func (ie *IndexExpression) expressionNode()      {}
func (ie *IndexExpression) TokenLiteral() string { return "[" }
func (ie *IndexExpression) String() string {
	return "(" + ie.Left.String() + "[" + ie.Index.String() + "])"
}

type AssignmentExpression struct {
	Name  string
	Value Expression
}

func (ae *AssignmentExpression) expressionNode()      {}
func (ae *AssignmentExpression) TokenLiteral() string { return "=" }
func (ae *AssignmentExpression) String() string {
	return ae.Name + " = " + ae.Value.String()
}

type ForStatement struct {
	Init      Statement
	Condition Expression
	Update    Expression
	Body      Statement
}

func (fs *ForStatement) statementNode()       {}
func (fs *ForStatement) TokenLiteral() string { return "for" }
func (fs *ForStatement) String() string       { return "for(...)" }

type WhileStatement struct {
	Condition Expression
	Body      Statement
}

func (ws *WhileStatement) statementNode()       {}
func (ws *WhileStatement) TokenLiteral() string { return "while" }
func (ws *WhileStatement) String() string       { return "while(...)" }
