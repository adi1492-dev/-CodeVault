package models

import (
	"time"

	"gorm.io/gorm"
)

type Problem struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Title          string         `gorm:"size:255;not null" json:"title"`
	Description    string         `gorm:"type:text;not null" json:"description"`
	Difficulty     string         `gorm:"size:20;default:'easy'" json:"difficulty"`
	StarterCode    string         `gorm:"type:text;not null" json:"starter_code"`
	TeacherID      uint           `json:"teacher_id"`
	TimeLimitMs    int            `gorm:"default:2000" json:"time_limit_ms"`
	MemoryLimitKB  int            `gorm:"default:65536" json:"memory_limit_kb"`
	IsPublished    bool           `gorm:"default:false" json:"is_published"`
	TestCases      []TestCase     `gorm:"foreignKey:ProblemID;constraint:OnDelete:CASCADE" json:"test_cases,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

type TestCase struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	ProblemID      uint   `json:"problem_id"`
	Input          string `gorm:"type:text" json:"input"`
	ExpectedOutput string `gorm:"type:text;not null" json:"expected_output"`
	IsHidden       bool   `gorm:"default:false" json:"is_hidden"`
	Weight         int    `gorm:"default:10" json:"weight"`
	OrderIndex     int    `gorm:"default:0" json:"order_index"`
}
