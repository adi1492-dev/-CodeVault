package parser

import (
	"fmt"
	"strconv"

	"github.com/adi1492-dev/codevault/internal/compiler/lexer"
)

const (
	_ int = iota
	LOWEST
	EQUALS      // ==
	LESSGREATER // > or <
	SUM         // +
	PRODUCT     // *
	PREFIX      // -X or !X
	CALL        // myFunction(X)
	INDEX       // array[index]
)

var precedences = map[lexer.TokenType]int{
	lexer.EQ:       EQUALS,
	lexer.NOT_EQ:   EQUALS,
	lexer.LT:       LESSGREATER,
	lexer.GT:       LESSGREATER,
	lexer.LT_EQ:    LESSGREATER,
	lexer.GT_EQ:    LESSGREATER,
	lexer.PLUS:     SUM,
	lexer.MINUS:    SUM,
	lexer.SLASH:    PRODUCT,
	lexer.ASTERISK: PRODUCT,
	lexer.PERCENT:  PRODUCT,
	lexer.LPAREN:   CALL,
	lexer.LBRACKET: INDEX,
}

type (
	prefixParseFn func() Expression
	infixParseFn  func(Expression) Expression
)

type Parser struct {
	l      *lexer.Lexer
	errors []string

	curToken  lexer.Token
	peekToken lexer.Token

	prefixParseFns map[lexer.TokenType]prefixParseFn
	infixParseFns  map[lexer.TokenType]infixParseFn
}

func New(l *lexer.Lexer) *Parser {
	p := &Parser{
		l:      l,
		errors: []string{},
	}

	p.prefixParseFns = make(map[lexer.TokenType]prefixParseFn)
	p.registerPrefix(lexer.IDENT, p.parseIdentifier)
	p.registerPrefix(lexer.NUMBER, p.parseIntegerLiteral)
	p.registerPrefix(lexer.BANG, p.parsePrefixExpression)
	p.registerPrefix(lexer.MINUS, p.parsePrefixExpression)
	p.registerPrefix(lexer.LPAREN, p.parseGroupedExpression)
	p.registerPrefix(lexer.STRING, p.parseStringLiteral)

	p.infixParseFns = make(map[lexer.TokenType]infixParseFn)
	p.registerInfix(lexer.PLUS, p.parseInfixExpression)
	p.registerInfix(lexer.MINUS, p.parseInfixExpression)
	p.registerInfix(lexer.SLASH, p.parseInfixExpression)
	p.registerInfix(lexer.ASTERISK, p.parseInfixExpression)
	p.registerInfix(lexer.PERCENT, p.parseInfixExpression)
	p.registerInfix(lexer.EQ, p.parseInfixExpression)
	p.registerInfix(lexer.NOT_EQ, p.parseInfixExpression)
	p.registerInfix(lexer.LT, p.parseInfixExpression)
	p.registerInfix(lexer.GT, p.parseInfixExpression)
	p.registerInfix(lexer.LT_EQ, p.parseInfixExpression)
	p.registerInfix(lexer.GT_EQ, p.parseInfixExpression)
	p.registerInfix(lexer.LPAREN, p.parseCallExpression)
	p.registerInfix(lexer.LBRACKET, p.parseIndexExpression)
	p.registerInfix(lexer.ASSIGN, p.parseAssignmentExpression)

	// Read two tokens, so curToken and peekToken are both set
	p.nextToken()
	p.nextToken()

	return p
}

func (p *Parser) nextToken() {
	p.curToken = p.peekToken
	p.peekToken = p.l.NextToken()
}

func (p *Parser) ParseProgram() *Program {
	program := &Program{}
	program.Statements = []Statement{}

	for p.curToken.Type != lexer.EOF {
		stmt := p.parseStatement()
		if stmt != nil {
			program.Statements = append(program.Statements, stmt)
		}
		p.nextToken()
	}

	return program
}

func (p *Parser) parseStatement() Statement {
	switch p.curToken.Type {
	case lexer.INT, lexer.VOID, lexer.CHAR_KW, lexer.FLOAT:
		return p.parseDeclaration()
	case lexer.RETURN:
		return p.parseReturnStatement()
	case lexer.IF:
		return p.parseIfStatement()
	case lexer.FOR:
		return p.parseForStatement()
	case lexer.WHILE:
		return p.parseWhileStatement()
	case lexer.INCLUDE:
		p.skipUntilNewline()
		return nil
	default:
		return p.parseExpressionStatement()
	}
}

func (p *Parser) parseDeclaration() Statement {
	typeToken := p.curToken
	p.nextToken() // ident

	// Check if it's a function declaration
	if p.peekToken.Type == lexer.LPAREN {
		return p.parseFunctionDeclaration(typeToken.Literal, p.curToken.Literal)
	}

	// It's a variable declaration (possibly multiple)
	stmts := []Statement{}

	for {
		ident := p.curToken.Literal
		stmt := &VarDeclaration{Type: typeToken.Literal, Name: ident}

		if p.peekToken.Type == lexer.LBRACKET {
			p.nextToken() // [
			p.nextToken() // size or ]
			if p.curToken.Type == lexer.NUMBER {
				size, _ := strconv.Atoi(p.curToken.Literal)
				stmt.IsArray = true
				stmt.Size = size
				p.nextToken() // ]
			}
		}

		if p.peekToken.Type == lexer.ASSIGN {
			p.nextToken() // =
			p.nextToken()
			stmt.Initializer = p.parseExpression(LOWEST)
		}

		stmts = append(stmts, stmt)

		if p.peekToken.Type == lexer.COMMA {
			p.nextToken() // ,
			p.nextToken() // next ident
		} else {
			break
		}
	}

	if p.peekToken.Type == lexer.SEMICOLON {
		p.nextToken()
	}

	if len(stmts) == 1 {
		return stmts[0]
	}

	multi := &MultiVarDeclaration{}
	for _, s := range stmts {
		multi.Declarations = append(multi.Declarations, s.(*VarDeclaration))
	}
	return multi
}

func (p *Parser) parseFunctionDeclaration(retType string, name string) *FunctionDeclaration {
	stmt := &FunctionDeclaration{ReturnType: retType, Name: name}

	p.nextToken() // (
	stmt.Parameters = p.parseFunctionParameters()

	if !p.expectPeek(lexer.LBRACE) {
		return nil
	}

	stmt.Body = p.parseBlockStatement()

	return stmt
}

func (p *Parser) parseFunctionParameters() []*Parameter {
	parameters := []*Parameter{}

	if p.peekToken.Type == lexer.RPAREN {
		p.nextToken()
		return parameters
	}

	p.nextToken()

	param := &Parameter{Type: p.curToken.Literal}
	p.nextToken()
	param.Name = p.curToken.Literal
	parameters = append(parameters, param)

	for p.peekToken.Type == lexer.COMMA {
		p.nextToken()
		p.nextToken()
		param := &Parameter{Type: p.curToken.Literal}
		p.nextToken()
		param.Name = p.curToken.Literal
		parameters = append(parameters, param)
	}

	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	return parameters
}

func (p *Parser) parseBlockStatement() *BlockStatement {
	block := &BlockStatement{Statements: []Statement{}}

	p.nextToken()

	for p.curToken.Type != lexer.RBRACE && p.curToken.Type != lexer.EOF {
		stmt := p.parseStatement()
		if stmt != nil {
			block.Statements = append(block.Statements, stmt)
		}
		p.nextToken()
	}

	return block
}

func (p *Parser) parseReturnStatement() *ReturnStatement {
	stmt := &ReturnStatement{}

	p.nextToken()

	if p.curToken.Type != lexer.SEMICOLON {
		stmt.ReturnValue = p.parseExpression(LOWEST)
	}

	if p.peekToken.Type == lexer.SEMICOLON {
		p.nextToken()
	}

	return stmt
}

func (p *Parser) parseExpressionStatement() *ExpressionStatement {
	stmt := &ExpressionStatement{Expression: p.parseExpression(LOWEST)}

	if p.peekToken.Type == lexer.SEMICOLON {
		p.nextToken()
	}

	return stmt
}

func (p *Parser) parseExpression(precedence int) Expression {
	prefix := p.prefixParseFns[p.curToken.Type]
	if prefix == nil {
		p.noPrefixParseFnError(p.curToken.Type)
		return nil
	}
	leftExp := prefix()

	for p.peekToken.Type != lexer.SEMICOLON && precedence < p.peekPrecedence() {
		infix := p.infixParseFns[p.peekToken.Type]
		if infix == nil {
			return leftExp
		}

		p.nextToken()

		leftExp = infix(leftExp)
	}

	return leftExp
}

func (p *Parser) parseIdentifier() Expression {
	return &Identifier{Value: p.curToken.Literal}
}

func (p *Parser) parseIntegerLiteral() Expression {
	lit := &IntegerLiteral{}
	value, err := strconv.ParseInt(p.curToken.Literal, 0, 64)
	if err != nil {
		msg := fmt.Sprintf("could not parse %q as integer", p.curToken.Literal)
		p.errors = append(p.errors, msg)
		return nil
	}
	lit.Value = value
	return lit
}

func (p *Parser) parseStringLiteral() Expression {
	return &StringLiteral{Value: p.curToken.Literal}
}

func (p *Parser) parsePrefixExpression() Expression {
	expression := &UnaryExpression{
		Operator: p.curToken.Literal,
	}

	p.nextToken()

	expression.Right = p.parseExpression(PREFIX)

	return expression
}

func (p *Parser) parseInfixExpression(left Expression) Expression {
	expression := &BinaryExpression{
		Operator: p.curToken.Literal,
		Left:     left,
	}

	precedence := p.curPrecedence()
	p.nextToken()
	expression.Right = p.parseExpression(precedence)

	return expression
}

func (p *Parser) parseGroupedExpression() Expression {
	p.nextToken()

	exp := p.parseExpression(LOWEST)

	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	return exp
}

func (p *Parser) parseIfStatement() Statement {
	expression := &IfStatement{}

	if !p.expectPeek(lexer.LPAREN) {
		return nil
	}

	p.nextToken()
	expression.Condition = p.parseExpression(LOWEST)

	if !p.expectPeek(lexer.RPAREN) {
		return nil
	}

	if !p.expectPeek(lexer.LBRACE) {
		return nil
	}

	expression.Consequence = p.parseBlockStatement()

	if p.peekToken.Type == lexer.ELSE {
		p.nextToken()

		if !p.expectPeek(lexer.LBRACE) {
			return nil
		}

		expression.Alternative = p.parseBlockStatement()
	}

	return expression
}

func (p *Parser) parseCallExpression(function Expression) Expression {
	exp := &CallExpression{Function: function}
	exp.Arguments = p.parseExpressionList(lexer.RPAREN)
	return exp
}

func (p *Parser) parseExpressionList(end lexer.TokenType) []Expression {
	list := []Expression{}

	if p.peekToken.Type == end {
		p.nextToken()
		return list
	}

	p.nextToken()
	list = append(list, p.parseExpression(LOWEST))

	for p.peekToken.Type == lexer.COMMA {
		p.nextToken()
		p.nextToken()
		list = append(list, p.parseExpression(LOWEST))
	}

	if !p.expectPeek(end) {
		return nil
	}

	return list
}

func (p *Parser) parseIndexExpression(left Expression) Expression {
	exp := &IndexExpression{Left: left}

	p.nextToken()
	exp.Index = p.parseExpression(LOWEST)

	if !p.expectPeek(lexer.RBRACKET) {
		return nil
	}

	return exp
}

func (p *Parser) parseAssignmentExpression(left Expression) Expression {
	ident, ok := left.(*Identifier)
	if !ok {
		p.errors = append(p.errors, "Left side of assignment must be an identifier")
		return nil
	}

	exp := &AssignmentExpression{Name: ident.Value}
	p.nextToken()
	exp.Value = p.parseExpression(LOWEST)

	return exp
}

func (p *Parser) parseForStatement() Statement {
	p.nextToken() // (
	p.nextToken()
	
	// Very simplified for loop parsing
	stmt := &ForStatement{}
	// Skip for now or implement properly
	p.skipUntilBrace()
	stmt.Body = p.parseBlockStatement()
	return stmt
}

func (p *Parser) parseWhileStatement() Statement {
	p.nextToken() // (
	p.nextToken()
	stmt := &WhileStatement{Condition: p.parseExpression(LOWEST)}
	p.expectPeek(lexer.RPAREN)
	p.expectPeek(lexer.LBRACE)
	stmt.Body = p.parseBlockStatement()
	return stmt
}

// Helpers

func (p *Parser) registerPrefix(tokenType lexer.TokenType, fn prefixParseFn) {
	p.prefixParseFns[tokenType] = fn
}

func (p *Parser) registerInfix(tokenType lexer.TokenType, fn infixParseFn) {
	p.infixParseFns[tokenType] = fn
}

func (p *Parser) expectPeek(t lexer.TokenType) bool {
	if p.peekToken.Type == t {
		p.nextToken()
		return true
	} else {
		p.peekError(t)
		return false
	}
}

func (p *Parser) peekPrecedence() int {
	if p, ok := precedences[p.peekToken.Type]; ok {
		return p
	}
	return LOWEST
}

func (p *Parser) curPrecedence() int {
	if p, ok := precedences[p.curToken.Type]; ok {
		return p
	}
	return LOWEST
}

func (p *Parser) peekError(t lexer.TokenType) {
	msg := fmt.Sprintf("expected next token to be %s, got %s instead at line %d, col %d",
		t, p.peekToken.Type, p.peekToken.Line, p.peekToken.Column)
	p.errors = append(p.errors, msg)
}

func (p *Parser) noPrefixParseFnError(t lexer.TokenType) {
	msg := fmt.Sprintf("no prefix parse function for %s found at line %d, col %d", t, p.curToken.Line, p.curToken.Column)
	p.errors = append(p.errors, msg)
}

func (p *Parser) Errors() []string {
	return p.errors
}

func (p *Parser) skipUntilNewline() {
	startLine := p.curToken.Line
	for p.curToken.Type != lexer.EOF && p.curToken.Line == startLine {
		p.nextToken()
	}
}

func lLine(t lexer.Token) int { return t.Line }

func (p *Parser) skipUntilBrace() {
	for p.curToken.Type != lexer.LBRACE && p.curToken.Type != lexer.EOF {
		p.nextToken()
	}
}
