package models

import (
	"time"
)

type Submission struct {
	ID              uint         `gorm:"primaryKey" json:"id"`
	ProblemID       uint         `json:"problem_id"`
	StudentID       uint         `json:"student_id"`
	StudentName     string       `gorm:"size:255;index" json:"student_name"`
	Code            string       `gorm:"type:text;not null" json:"code"`
	Status          string       `gorm:"size:20;default:'pending'" json:"status"` // pending/running/completed/error
	Score           int          `gorm:"default:0" json:"score"`
	Output          string       `gorm:"type:text" json:"output"`
	ErrorMessage    string       `gorm:"type:text" json:"error_message"`
	ExecutionTimeMs int64        `json:"execution_time_ms"`
	TestResults     []TestResult `gorm:"foreignKey:SubmissionID;constraint:OnDelete:CASCADE" json:"test_results"`
	ExecutedAt      time.Time    `json:"executed_at"`
	CreatedAt       time.Time    `json:"created_at"`
}

type TestResult struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	SubmissionID uint   `json:"submission_id"`
	TestCaseID   uint   `json:"test_case_id"`
	Input        string `gorm:"type:text" json:"input"`
	Expected     string `gorm:"type:text" json:"expected"`
	Actual       string `gorm:"type:text" json:"actual"`
	Passed       bool   `json:"passed"`
	Weight       int    `json:"weight"`
}
