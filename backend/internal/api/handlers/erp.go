package handlers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/models"
)

// ── Assignments ───────────────────────────────────────────────────────────────

func GetAssignments(c *fiber.Ctx) error {
	section := c.Query("section")
	if db.DB == nil {
		return c.JSON(mockAssignments())
	}
	var assignments []models.Assignment
	q := db.DB.Where("deleted_at IS NULL")
	if section != "" {
		q = q.Where("section = ?", section)
	}
	q.Order("due_date asc").Find(&assignments)
	return c.JSON(assignments)
}

func CreateAssignment(c *fiber.Ctx) error {
	var a models.Assignment
	if err := c.BodyParser(&a); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	a.CreatedAt = time.Now()
	a.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&a)
	}
	return c.Status(201).JSON(a)
}

func SubmitAssignment(c *fiber.Ctx) error {
	var sub models.AcademicSubmission
	if err := c.BodyParser(&sub); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	sub.SubmittedAt = time.Now()
	sub.CreatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&sub)
	}
	return c.Status(201).JSON(sub)
}

func GradeSubmission(c *fiber.Ctx) error {
	id := c.Params("id")
	var body struct {
		Marks    int    `json:"marks_awarded"`
		Feedback string `json:"feedback"`
		GraderID uint   `json:"graded_by"`
	}
	c.BodyParser(&body)
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true})
	}
	now := time.Now()
	db.DB.Model(&models.AcademicSubmission{}).Where("id = ?", id).Updates(map[string]interface{}{
		"marks_awarded": body.Marks,
		"feedback":      body.Feedback,
		"graded_by":     body.GraderID,
		"graded_at":     now,
	})
	return c.JSON(fiber.Map{"ok": true})
}

// ── Timetable ─────────────────────────────────────────────────────────────────

func GetTimetable(c *fiber.Ctx) error {
	section := c.Params("section")
	if db.DB == nil {
		return c.JSON(mockTimetable(section))
	}
	var slots []models.TimetableSlot
	db.DB.Where("section = ?", section).Order("day_of_week, period_no").Find(&slots)
	return c.JSON(slots)
}

func CreateTimetableSlot(c *fiber.Ctx) error {
	var slot models.TimetableSlot
	if err := c.BodyParser(&slot); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	slot.CreatedAt = time.Now()
	slot.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&slot)
	}
	return c.Status(201).JSON(slot)
}

// ── Attendance ────────────────────────────────────────────────────────────────

func MarkAttendance(c *fiber.Ctx) error {
	var records []models.AttendanceRecord
	if err := c.BodyParser(&records); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	now := time.Now()
	for i := range records {
		records[i].CreatedAt = now
	}
	if db.DB != nil {
		db.DB.Create(&records)
	}
	return c.Status(201).JSON(fiber.Map{"marked": len(records)})
}

func GetStudentAttendance(c *fiber.Ctx) error {
	studentID := c.Params("studentId")
	if db.DB == nil {
		return c.JSON([]fiber.Map{})
	}
	var records []models.AttendanceRecord
	db.DB.Where("student_id = ?", studentID).Order("date desc").Find(&records)
	return c.JSON(records)
}

// ── Leaves ────────────────────────────────────────────────────────────────────

func GetLeaves(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON(mockLeaves())
	}
	var leaves []models.LeaveApplication
	db.DB.Where("deleted_at IS NULL").Order("created_at desc").Find(&leaves)
	return c.JSON(leaves)
}

func ApplyLeave(c *fiber.Ctx) error {
	var leave models.LeaveApplication
	if err := c.BodyParser(&leave); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	leave.Status = "pending"
	leave.CreatedAt = time.Now()
	leave.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&leave)
	}
	return c.Status(201).JSON(leave)
}

func ReviewLeave(c *fiber.Ctx) error {
	id := c.Params("id")
	action := c.Params("action") // approve|reject
	var body struct{ ReviewedBy uint `json:"reviewed_by"` }
	c.BodyParser(&body)
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true})
	}
	now := time.Now()
	status := "approved"
	if action == "reject" {
		status = "rejected"
	}
	db.DB.Model(&models.LeaveApplication{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status": status, "reviewed_by": body.ReviewedBy, "reviewed_at": now,
	})
	return c.JSON(fiber.Map{"ok": true, "status": status})
}

// ── Announcements ─────────────────────────────────────────────────────────────

func GetAnnouncements(c *fiber.Ctx) error {
	role := c.Query("role")
	if db.DB == nil {
		return c.JSON(mockAnnouncements())
	}
	var ann []models.Announcement
	q := db.DB.Where("deleted_at IS NULL")
	if role != "" {
		q = q.Where("target_role = 'all' OR target_role = ?", role)
	}
	q.Order("created_at desc").Find(&ann)
	return c.JSON(ann)
}

func CreateAnnouncement(c *fiber.Ctx) error {
	var a models.Announcement
	if err := c.BodyParser(&a); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	a.CreatedAt = time.Now()
	a.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&a)
	}
	return c.Status(201).JSON(a)
}

// ── Fees ──────────────────────────────────────────────────────────────────────

func GetStudentFees(c *fiber.Ctx) error {
	studentID := c.Params("studentId")
	if db.DB == nil {
		return c.JSON(fiber.Map{"student_id": studentID, "transactions": []fiber.Map{}})
	}
	var txns []models.FeeTransaction
	db.DB.Where("student_id = ?", studentID).Order("paid_at desc").Find(&txns)
	return c.JSON(txns)
}

func RecordFeePayment(c *fiber.Ctx) error {
	var txn models.FeeTransaction
	if err := c.BodyParser(&txn); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	txn.PaidAt = time.Now()
	txn.CreatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&txn)
		// Update user fee fields
		db.DB.Model(&models.User{}).Where("id = ?", txn.StudentID).
			UpdateColumn("fee_paid", db.DB.Raw("fee_paid + ?", txn.Amount))
	}
	return c.Status(201).JSON(txn)
}

// ── Library ───────────────────────────────────────────────────────────────────

func GetLibraryLoans(c *fiber.Ctx) error {
	studentID := c.Params("studentId")
	if db.DB == nil {
		return c.JSON(mockLibraryLoans())
	}
	var loans []models.LibraryLoan
	db.DB.Where("student_id = ? AND returned_at IS NULL", studentID).Find(&loans)
	return c.JSON(loans)
}

// ── Hostel / Warden ───────────────────────────────────────────────────────────

func GetGatePasses(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON(mockGatePasses())
	}
	var passes []models.GatePass
	db.DB.Where("deleted_at IS NULL").Order("created_at desc").Find(&passes)
	return c.JSON(passes)
}

func ApplyGatePass(c *fiber.Ctx) error {
	var pass models.GatePass
	if err := c.BodyParser(&pass); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	pass.Status = "pending"
	pass.CreatedAt = time.Now()
	pass.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&pass)
	}
	return c.Status(201).JSON(pass)
}

func ReviewGatePass(c *fiber.Ctx) error {
	id := c.Params("id")
	var body struct{ Status string `json:"status"`; ApprovedBy uint `json:"approved_by"` }
	c.BodyParser(&body)
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true})
	}
	db.DB.Model(&models.GatePass{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status": body.Status, "approved_by": body.ApprovedBy,
	})
	return c.JSON(fiber.Map{"ok": true})
}

func GetComplaints(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON(mockComplaints())
	}
	var c2 []models.MaintenanceComplaint
	db.DB.Where("deleted_at IS NULL").Order("created_at desc").Find(&c2)
	return c.JSON(c2)
}

func CreateComplaint(c *fiber.Ctx) error {
	var comp models.MaintenanceComplaint
	if err := c.BodyParser(&comp); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	comp.Status = "open"
	comp.CreatedAt = time.Now()
	comp.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&comp)
	}
	return c.Status(201).JSON(comp)
}

func UpdateComplaint(c *fiber.Ctx) error {
	id := c.Params("id")
	var body struct{ Status string `json:"status"`; AssignedTo string `json:"assigned_to"` }
	c.BodyParser(&body)
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true})
	}
	db.DB.Model(&models.MaintenanceComplaint{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status": body.Status, "assigned_to": body.AssignedTo,
	})
	return c.JSON(fiber.Map{"ok": true})
}

// Students list for admin
func GetStudents(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON([]fiber.Map{})
	}
	var users []models.User
	db.DB.Where("role = 'student' AND deleted_at IS NULL").Find(&users)
	return c.JSON(users)
}

// ── Mock data (stateless fallback) ───────────────────────────────────────────

func mockAssignments() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "title": "Linked List Implementation", "subject_code": "CS301", "section": "CS-A", "due_date": "2026-05-20", "max_marks": 20, "teacher_id": 1},
		{"id": 2, "title": "Build a Mini Lexer", "subject_code": "CS402", "section": "CS-A", "due_date": "2026-05-25", "max_marks": 30, "teacher_id": 1},
		{"id": 3, "title": "OS Process Scheduler Simulation", "subject_code": "CS305", "section": "CS-A", "due_date": "2026-05-22", "max_marks": 25, "teacher_id": 1},
	}
}

func mockTimetable(section string) []fiber.Map {
	_ = section
	days := []string{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}
	subjects := []fiber.Map{
		{"code": "CS301", "name": "Data Structures", "teacher": "Dr. Vikram", "room": "A-101"},
		{"code": "CS402", "name": "Compiler Design", "teacher": "Dr. Vikram", "room": "A-102"},
		{"code": "CS305", "name": "Operating Systems", "teacher": "Dr. Vikram", "room": "B-201"},
	}
	var slots []fiber.Map
	for d, day := range days {
		for p := 1; p <= 6; p++ {
			s := subjects[(d+p)%len(subjects)]
			slots = append(slots, fiber.Map{
				"day": day, "day_of_week": d, "period_no": p,
				"subject_code": s["code"], "subject_name": s["name"],
				"teacher_name": s["teacher"], "room_no": s["room"],
				"start_time": fmt.Sprintf("%02d:00", 8+p), "end_time": fmt.Sprintf("%02d:00", 9+p),
			})
		}
	}
	return slots
}

func mockLeaves() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "applicant_id": 4, "leave_type": "medical", "from_date": "2026-05-10", "to_date": "2026-05-12", "reason": "Fever", "status": "approved"},
		{"id": 2, "applicant_id": 4, "leave_type": "personal", "from_date": "2026-05-18", "to_date": "2026-05-18", "reason": "Family function", "status": "pending"},
	}
}

func mockAnnouncements() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "title": "Mid-term Exam Schedule Released", "body": "Mid-term exams for Sem 2 are scheduled from June 1-7.", "target_role": "all", "created_at": time.Now().Add(-48 * time.Hour)},
		{"id": 2, "title": "Library Closed on Monday", "body": "Library will remain closed on Monday for maintenance.", "target_role": "student", "created_at": time.Now().Add(-24 * time.Hour)},
	}
}

func mockLibraryLoans() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "book_title": "Introduction to Algorithms (CLRS)", "book_isbn": "978-0262046305", "issued_at": "2026-04-15", "due_date": "2026-05-15", "fine_amount": 0},
		{"id": 2, "book_title": "Compilers: Principles, Techniques, and Tools", "book_isbn": "978-0321486813", "issued_at": "2026-05-01", "due_date": "2026-05-31", "fine_amount": 0},
	}
}

func mockGatePasses() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "student_id": 4, "destination": "Pune City", "reason": "Medical appointment", "status": "sanctioned", "out_time": "2026-05-13T10:00:00Z"},
		{"id": 2, "student_id": 5, "destination": "Railway Station", "reason": "Weekend home visit", "status": "pending", "out_time": "2026-05-17T14:00:00Z"},
	}
}

func mockComplaints() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "hostel_room": "B-204", "category": "plumbing", "description": "Tap leaking in bathroom", "status": "open"},
		{"id": 2, "hostel_room": "C-110", "category": "electrical", "description": "Fan not working", "status": "in_progress", "assigned_to": "Electrician Raju"},
	}
}
