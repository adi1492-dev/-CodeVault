package models

import (
	"time"

	"gorm.io/gorm"
)

// Extended User fields — added via a migration-friendly embedded struct
// (actual user table extended via separate GORM model extension)

// CanteenItem represents a menu item
type CanteenItem struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Name           string         `gorm:"size:255;not null" json:"name"`
	Category       string         `gorm:"size:50" json:"category"` // Breakfast/Lunch/Snacks/Beverages
	Price          float64        `json:"price"`
	Description    string         `gorm:"size:500" json:"description"`
	IsAvailable    bool           `gorm:"default:true" json:"is_available"`
	PrepTimeMinutes int           `json:"prep_time_minutes"`
	ImageURL       string         `gorm:"size:500" json:"image_url"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

// CanteenOrder represents a student food order
type CanteenOrder struct {
	ID                  uint           `gorm:"primaryKey" json:"id"`
	StudentID           uint           `gorm:"not null" json:"student_id"`
	Items               string         `gorm:"type:text" json:"items"` // JSON array
	TotalAmount         float64        `json:"total_amount"`
	PaymentMode         string         `gorm:"size:30" json:"payment_mode"` // wallet|fee_deduction
	OrderStatus         string         `gorm:"size:30;default:'pending'" json:"order_status"`
	PickupCode          string         `gorm:"size:10" json:"pickup_code"`
	ScheduledPickupTime string         `gorm:"size:20" json:"scheduled_pickup_time"`
	PlacedAt            time.Time      `json:"placed_at"`
	CompletedAt         *time.Time     `json:"completed_at,omitempty"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}

// CanteenWalletTransaction represents wallet credit/debit events
type CanteenWalletTransaction struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	UserID           uint      `gorm:"not null" json:"user_id"`
	Type             string    `gorm:"size:10" json:"type"` // credit|debit
	Amount           float64   `json:"amount"`
	Description      string    `gorm:"size:255" json:"description"`
	ReferenceOrderID *uint     `json:"reference_order_id,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
}

// Assignment represents a teacher-created task for students
type Assignment struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Title         string         `gorm:"size:255;not null" json:"title"`
	Description   string         `gorm:"type:text" json:"description"`
	SubjectCode   string         `gorm:"size:20" json:"subject_code"`
	TeacherID     uint           `json:"teacher_id"`
	Section       string         `gorm:"size:20" json:"section"`
	DueDate       time.Time      `json:"due_date"`
	MaxMarks      int            `json:"max_marks"`
	AttachmentURL string         `gorm:"size:500" json:"attachment_url"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// AcademicSubmission represents a student's assignment submission
type AcademicSubmission struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	AssignmentID   uint           `gorm:"not null" json:"assignment_id"`
	StudentID      uint           `gorm:"not null" json:"student_id"`
	SubmissionText string         `gorm:"type:text" json:"submission_text"`
	AttachmentURL  string         `gorm:"size:500" json:"attachment_url"`
	MarksAwarded   *int           `json:"marks_awarded,omitempty"`
	Feedback       string         `gorm:"type:text" json:"feedback"`
	SubmittedAt    time.Time      `json:"submitted_at"`
	GradedAt       *time.Time     `json:"graded_at,omitempty"`
	GradedBy       *uint          `json:"graded_by,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

// TimetableSlot represents a class period entry
type TimetableSlot struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Section     string    `gorm:"size:20;not null" json:"section"`
	DayOfWeek   int       `json:"day_of_week"` // 0=Mon ... 5=Sat
	PeriodNo    int       `json:"period_no"`   // 1-8
	SubjectCode string    `gorm:"size:20" json:"subject_code"`
	SubjectName string    `gorm:"size:100" json:"subject_name"`
	TeacherID   uint      `json:"teacher_id"`
	TeacherName string    `gorm:"size:100" json:"teacher_name"`
	RoomNo      string    `gorm:"size:20" json:"room_no"`
	StartTime   string    `gorm:"size:10" json:"start_time"`
	EndTime     string    `gorm:"size:10" json:"end_time"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// LeaveApplication for students and teachers
type LeaveApplication struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	ApplicantID   uint           `gorm:"not null" json:"applicant_id"`
	ApplicantType string         `gorm:"size:20" json:"applicant_type"` // student|teacher
	LeaveType     string         `gorm:"size:30" json:"leave_type"`     // medical|personal|emergency
	FromDate      time.Time      `json:"from_date"`
	ToDate        time.Time      `json:"to_date"`
	Reason        string         `gorm:"type:text" json:"reason"`
	Status        string         `gorm:"size:20;default:'pending'" json:"status"` // pending|approved|rejected
	ReviewedBy    *uint          `json:"reviewed_by,omitempty"`
	ReviewedAt    *time.Time     `json:"reviewed_at,omitempty"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// AttendanceRecord tracks daily per-subject attendance
type AttendanceRecord struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	StudentID  uint      `gorm:"not null" json:"student_id"`
	SubjectCode string   `gorm:"size:20" json:"subject_code"`
	Date       time.Time `json:"date"`
	Status     string    `gorm:"size:10" json:"status"` // present|absent|late
	MarkedBy   uint      `json:"marked_by"`
	CreatedAt  time.Time `json:"created_at"`
}

// FeeTransaction records payments
type FeeTransaction struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	StudentID   uint      `gorm:"not null" json:"student_id"`
	Amount      float64   `json:"amount"`
	PaymentMode string    `gorm:"size:30" json:"payment_mode"` // online|cash|scholarship
	Semester    string    `gorm:"size:20" json:"semester"`
	Description string    `gorm:"size:255" json:"description"`
	ReceiptNo   string    `gorm:"size:50" json:"receipt_no"`
	PaidAt      time.Time `json:"paid_at"`
	RecordedBy  uint      `json:"recorded_by"`
	CreatedAt   time.Time `json:"created_at"`
}

// Announcement for system-wide notices
type Announcement struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Title         string         `gorm:"size:255;not null" json:"title"`
	Body          string         `gorm:"type:text" json:"body"`
	TargetRole    string         `gorm:"size:30" json:"target_role"`    // all|student|teacher|parent
	TargetSection string         `gorm:"size:20" json:"target_section"` // empty = all sections
	CreatedBy     uint           `json:"created_by"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// LibraryLoan tracks borrowed books
type LibraryLoan struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	StudentID  uint       `gorm:"not null" json:"student_id"`
	BookTitle  string     `gorm:"size:255" json:"book_title"`
	BookISBN   string     `gorm:"size:30" json:"book_isbn"`
	IssuedAt   time.Time  `json:"issued_at"`
	DueDate    time.Time  `json:"due_date"`
	ReturnedAt *time.Time `json:"returned_at,omitempty"`
	FineAmount float64    `json:"fine_amount"`
	CreatedAt  time.Time  `json:"created_at"`
}

// GatePass for hostel students going out
type GatePass struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	StudentID   uint           `gorm:"not null" json:"student_id"`
	Destination string         `gorm:"size:255" json:"destination"`
	Reason      string         `gorm:"size:500" json:"reason"`
	OutTime     time.Time      `json:"out_time"`
	InTime      *time.Time     `json:"in_time,omitempty"`
	Status      string         `gorm:"size:20;default:'pending'" json:"status"` // pending|sanctioned|returned
	ApprovedBy  *uint          `json:"approved_by,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// MaintenanceComplaint for hostel issues
type MaintenanceComplaint struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	StudentID   uint           `gorm:"not null" json:"student_id"`
	HostelRoom  string         `gorm:"size:20" json:"hostel_room"`
	Category    string         `gorm:"size:30" json:"category"` // plumbing|electrical|other
	Description string         `gorm:"type:text" json:"description"`
	Status      string         `gorm:"size:20;default:'open'" json:"status"` // open|in_progress|resolved
	AssignedTo  string         `gorm:"size:100" json:"assigned_to"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
