package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/adi1492-dev/codevault/internal/api/handlers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/auth/register", handlers.Register)
	api.Post("/auth/login", handlers.Login)

	// Problems
	api.Get("/problems", handlers.GetProblems)
	api.Get("/problems/:id", handlers.GetProblem)
	api.Post("/problems", handlers.CreateProblem)

	// Submissions
	api.Post("/submissions", handlers.SubmitCode)
	api.Get("/submissions/:id", handlers.GetSubmission)

	// Health
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "campuscore"})
	})

	// Canteen
	api.Get("/canteen/menu", handlers.GetMenu)
	api.Post("/canteen/menu", handlers.CreateMenuItem)
	api.Put("/canteen/menu/:id", handlers.UpdateMenuItem)
	api.Delete("/canteen/menu/:id", handlers.DeleteMenuItem)
	api.Get("/canteen/orders", handlers.GetOrders)
	api.Post("/canteen/orders", handlers.PlaceOrder)
	api.Put("/canteen/orders/:id/status", handlers.UpdateOrderStatus)
	api.Get("/canteen/wallet/:userId", handlers.GetWallet)
	api.Post("/canteen/wallet/recharge", handlers.RechargeWallet)

	// Assignments
	api.Get("/assignments", handlers.GetAssignments)
	api.Post("/assignments", handlers.CreateAssignment)
	api.Post("/assignments/:id/submit", handlers.SubmitAssignment)
	api.Put("/assignments/submissions/:id/grade", handlers.GradeSubmission)

	// Timetable & Attendance
	api.Get("/timetable/:section", handlers.GetTimetable)
	api.Post("/timetable", handlers.CreateTimetableSlot)
	api.Post("/attendance/mark", handlers.MarkAttendance)
	api.Get("/attendance/:studentId", handlers.GetStudentAttendance)

	// Leaves
	api.Get("/leaves", handlers.GetLeaves)
	api.Post("/leaves", handlers.ApplyLeave)
	api.Put("/leaves/:id/:action", handlers.ReviewLeave) // action=approve|reject

	// Announcements
	api.Get("/announcements", handlers.GetAnnouncements)
	api.Post("/announcements", handlers.CreateAnnouncement)

	// Fees
	api.Get("/fees/:studentId", handlers.GetStudentFees)
	api.Post("/fees/payment", handlers.RecordFeePayment)

	// Library
	api.Get("/library/:studentId", handlers.GetLibraryLoans)

	// Hostel/Warden
	api.Get("/hostel/passes", handlers.GetGatePasses)
	api.Post("/hostel/passes", handlers.ApplyGatePass)
	api.Put("/hostel/passes/:id/review", handlers.ReviewGatePass)
	api.Get("/hostel/complaints", handlers.GetComplaints)
	api.Post("/hostel/complaints", handlers.CreateComplaint)
	api.Put("/hostel/complaints/:id", handlers.UpdateComplaint)

	// Users
	api.Get("/students", handlers.GetStudents)
}
