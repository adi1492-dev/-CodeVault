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
		return c.JSON(fiber.Map{"status": "ok", "service": "codevault"})
	})
}
