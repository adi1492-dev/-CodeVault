package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Name       string         `gorm:"size:255;not null" json:"name"`
	Email      string         `gorm:"size:255;unique;not null" json:"email"`
	Password   string         `gorm:"size:255;not null" json:"-"`
	Role       string         `gorm:"size:20;default:'student'" json:"role"`
	StudentID  string         `gorm:"size:50" json:"student_id"`
	// ERP Extended Fields
	Phone          string  `gorm:"size:20" json:"phone"`
	DOB            string  `gorm:"size:20" json:"dob"`
	Address        string  `gorm:"size:500" json:"address"`
	RollNo         string  `gorm:"size:30" json:"roll_no"`
	Section        string  `gorm:"size:20" json:"section"`
	Department     string  `gorm:"size:100" json:"department"`
	AcademicYear   string  `gorm:"size:20" json:"academic_year"`
	SemesterNo     int     `json:"semester_no"`
	ParentName     string  `gorm:"size:100" json:"parent_name"`
	ParentPhone    string  `gorm:"size:20" json:"parent_phone"`
	BloodGroup     string  `gorm:"size:5" json:"blood_group"`
	Category       string  `gorm:"size:20" json:"category"`
	Nationality    string  `gorm:"size:50" json:"nationality"`
	AdmissionDate  string  `gorm:"size:20" json:"admission_date"`
	HostelStatus   string  `gorm:"size:20" json:"hostel_status"`
	ScholarStatus  string  `gorm:"size:20" json:"scholarship_status"`
	AttendancePct  float64 `json:"attendance_pct"`
	LeaveBalance   int     `json:"leave_balance"`
	BacklogCount   int     `json:"backlog_count"`
	CGPA           float64 `json:"cgpa"`
	FeeTotal       float64 `json:"fee_total"`
	FeePaid        float64 `json:"fee_paid"`
	FeeDue         float64 `json:"fee_due"`
	FeeStatus      string  `gorm:"size:20" json:"fee_status"`
	CanteenBalance float64 `gorm:"default:0" json:"canteen_wallet_balance"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
