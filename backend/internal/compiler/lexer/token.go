package lexer

type TokenType string

const (
	ILLEGAL = "ILLEGAL"
	EOF     = "EOF"

	// Identifiers + Literals
	IDENT  = "IDENT"
	NUMBER = "NUMBER"
	STRING = "STRING"
	CHAR   = "CHAR"

	// Operators
	ASSIGN   = "="
	PLUS     = "+"
	MINUS    = "-"
	ASTERISK = "*"
	SLASH    = "/"
	PERCENT  = "%"

	BANG     = "!"
	EQ       = "=="
	NOT_EQ   = "!="
	LT       = "<"
	GT       = ">"
	LT_EQ    = "<="
	GT_EQ    = ">="
	AND      = "&&"
	OR       = "||"

	PLUS_PLUS   = "++"
	MINUS_MINUS = "--"

	// Delimiters
	COMMA     = ","
	SEMICOLON = ";"
	LPAREN    = "("
	RPAREN    = ")"
	LBRACE    = "{"
	RBRACE    = "}"
	LBRACKET  = "["
	RBRACKET  = "]"

	// Keywords
	INT      = "INT"
	VOID     = "VOID"
	CHAR_KW  = "CHAR_KW"
	FLOAT    = "FLOAT"
	DOUBLE   = "DOUBLE"
	IF       = "IF"
	ELSE     = "ELSE"
	FOR      = "FOR"
	WHILE    = "WHILE"
	DO       = "DO"
	RETURN   = "RETURN"
	BREAK    = "BREAK"
	CONTINUE = "CONTINUE"
	INCLUDE  = "INCLUDE"
	DOT      = "."
)

type Token struct {
	Type    TokenType
	Literal string
	Line    int
	Column  int
}

var keywords = map[string]TokenType{
	"int":      INT,
	"void":     VOID,
	"char":     CHAR_KW,
	"float":    FLOAT,
	"double":   DOUBLE,
	"if":       IF,
	"else":     ELSE,
	"for":      FOR,
	"while":    WHILE,
	"do":       DO,
	"return":   RETURN,
	"break":    BREAK,
	"continue": CONTINUE,
	"include":  INCLUDE,
}

func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok {
		return tok
	}
	return IDENT
}
