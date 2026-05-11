package parser

import (
	"encoding/json"
)

func ToJSON(node Node) string {
	b, err := json.MarshalIndent(node, "", "  ")
	if err != nil {
		return "{ \"error\": \"could not visualize AST\" }"
	}
	return string(b)
}
