package lexer

import (
)

type Lexer struct {
	input        string
	position     int  // current position in input (points to current char)
	readPosition int  // current reading position in input (after current char)
	ch           byte // current char under examination
	line         int
	column       int
}

func New(input string) *Lexer {
	l := &Lexer{input: input, line: 1, column: 0}
	l.readChar()
	return l
}

func (l *Lexer) readChar() {
	if l.readPosition >= len(l.input) {
		l.ch = 0
	} else {
		l.ch = l.input[l.readPosition]
	}
	l.position = l.readPosition
	l.readPosition++
	l.column++
}

func (l *Lexer) peekChar() byte {
	if l.readPosition >= len(l.input) {
		return 0
	}
	return l.input[l.readPosition]
}

func (l *Lexer) NextToken() Token {
	var tok Token

	l.skipWhitespace()

	switch l.ch {
	case '=':
		if l.peekChar() == '=' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: EQ, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(ASSIGN, l.ch)
		}
	case '+':
		if l.peekChar() == '+' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: PLUS_PLUS, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(PLUS, l.ch)
		}
	case '-':
		if l.peekChar() == '-' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: MINUS_MINUS, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(MINUS, l.ch)
		}
	case '!':
		if l.peekChar() == '=' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: NOT_EQ, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(BANG, l.ch)
		}
	case '/':
		if l.peekChar() == '/' {
			l.skipSingleLineComment()
			return l.NextToken()
		} else if l.peekChar() == '*' {
			l.skipMultiLineComment()
			return l.NextToken()
		}
		tok = l.newToken(SLASH, l.ch)
	case '*':
		tok = l.newToken(ASTERISK, l.ch)
	case '%':
		tok = l.newToken(PERCENT, l.ch)
	case '<':
		if l.peekChar() == '=' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: LT_EQ, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(LT, l.ch)
		}
	case '>':
		if l.peekChar() == '=' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: GT_EQ, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(GT, l.ch)
		}
	case ';':
		tok = l.newToken(SEMICOLON, l.ch)
	case ',':
		tok = l.newToken(COMMA, l.ch)
	case '(':
		tok = l.newToken(LPAREN, l.ch)
	case ')':
		tok = l.newToken(RPAREN, l.ch)
	case '{':
		tok = l.newToken(LBRACE, l.ch)
	case '}':
		tok = l.newToken(RBRACE, l.ch)
	case '[':
		tok = l.newToken(LBRACKET, l.ch)
	case ']':
		tok = l.newToken(RBRACKET, l.ch)
	case '&':
		if l.peekChar() == '&' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: AND, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(ADDR, l.ch)
		}
	case '|':
		if l.peekChar() == '|' {
			ch := l.ch
			l.readChar()
			tok = Token{Type: OR, Literal: string(ch) + string(l.ch), Line: l.line, Column: l.column - 1}
		} else {
			tok = l.newToken(ILLEGAL, l.ch)
		}
	case '.':
		tok = l.newToken(DOT, l.ch)
	case '#':
		tok = Token{Type: INCLUDE, Literal: "#", Line: l.line, Column: l.column}
	case '"':
		tok.Type = STRING
		tok.Literal = l.readString()
		tok.Line = l.line
		tok.Column = l.column
	case '\'':
		tok.Type = CHAR
		tok.Literal = l.readCharLiteral()
		tok.Line = l.line
		tok.Column = l.column
	case 0:
		tok.Literal = ""
		tok.Type = EOF
		tok.Line = l.line
		tok.Column = l.column
	default:
		if isLetter(l.ch) {
			tok.Literal = l.readIdentifier()
			tok.Type = LookupIdent(tok.Literal)
			tok.Line = l.line
			tok.Column = l.column - len(tok.Literal)
			return tok
		} else if isDigit(l.ch) {
			tok.Literal = l.readNumber()
			tok.Type = NUMBER
			tok.Line = l.line
			tok.Column = l.column - len(tok.Literal)
			return tok
		} else {
			tok = l.newToken(ILLEGAL, l.ch)
		}
	}

	l.readChar()
	return tok
}

func (l *Lexer) newToken(tokenType TokenType, ch byte) Token {
	return Token{Type: tokenType, Literal: string(ch), Line: l.line, Column: l.column}
}

func (l *Lexer) readIdentifier() string {
	position := l.position
	for isLetter(l.ch) || isDigit(l.ch) {
		l.readChar()
	}
	return l.input[position:l.position]
}

func isLetter(ch byte) bool {
	return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch == '_'
}

func (l *Lexer) skipWhitespace() {
	for l.ch == ' ' || l.ch == '\t' || l.ch == '\n' || l.ch == '\r' {
		if l.ch == '\n' {
			l.line++
			l.column = 0
		}
		l.readChar()
	}
}

func (l *Lexer) readNumber() string {
	position := l.position
	for isDigit(l.ch) || l.ch == '.' {
		l.readChar()
	}
	return l.input[position:l.position]
}

func isDigit(ch byte) bool {
	return '0' <= ch && ch <= '9'
}

func (l *Lexer) readString() string {
	l.readChar() // skip "
	position := l.position
	for l.ch != '"' && l.ch != 0 {
		if l.ch == '\\' {
			l.readChar() // skip \
		}
		l.readChar()
	}
	return l.input[position:l.position]
}

func (l *Lexer) readCharLiteral() string {
	l.readChar() // skip '
	position := l.position
	if l.ch == '\\' {
		l.readChar() // skip \
	}
	l.readChar() // char itself
	l.readChar() // skip '
	return l.input[position : l.position-1]
}

func (l *Lexer) skipSingleLineComment() {
	for l.ch != '\n' && l.ch != 0 {
		l.readChar()
	}
	l.skipWhitespace()
}

func (l *Lexer) skipMultiLineComment() {
	l.readChar() // /
	l.readChar() // *
	for !(l.ch == '*' && l.peekChar() == '/') && l.ch != 0 {
		if l.ch == '\n' {
			l.line++
			l.column = 0
		}
		l.readChar()
	}
	l.readChar() // *
	l.readChar() // /
	l.skipWhitespace()
}

func (l *Lexer) Tokenize() ([]Token, error) {
	tokens := []Token{}
	for {
		tok := l.NextToken()
		tokens = append(tokens, tok)
		if tok.Type == EOF {
			break
		}
	}
	return tokens, nil
}
