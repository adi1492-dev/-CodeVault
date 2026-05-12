package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/adi1492-dev/codevault/internal/api/routes"
	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/seed"
)

func main() {
	// Initialize Database
	db.InitDB()
	seed.Seed()

	// Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName: "CodeVault API v1",
	})

	// Middleware
	app.Use(cors.New())

	// Setup Routes
	routes.SetupRoutes(app)

	// Start Server
	log.Fatal(app.Listen(":8080"))
}
