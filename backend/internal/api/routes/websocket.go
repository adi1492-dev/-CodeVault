package routes

import (
	"log"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var (
	// Store connected clients
	clients = make(map[*websocket.Conn]bool)
	// Mutex for concurrent map access
	clientsMu sync.Mutex
)

// SetupWebSocketRoutes initializes the WebSocket endpoints
func SetupWebSocketRoutes(app *fiber.App) {
	// Middleware to check if the connection is a WebSocket upgrade
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		clientsMu.Lock()
		clients[c] = true
		clientsMu.Unlock()

		log.Printf("Client connected. Total clients: %d", len(clients))

		defer func() {
			clientsMu.Lock()
			delete(clients, c)
			clientsMu.Unlock()
			c.Close()
			log.Printf("Client disconnected. Total clients: %d", len(clients))
		}()

		// Infinite loop to read incoming messages and broadcast to others
		for {
			mt, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Read error:", err)
				break
			}

			// Broadcast message to all connected clients
			clientsMu.Lock()
			for client := range clients {
				// Send to everyone (including sender to confirm, or exclude sender)
				// For real-time syncing of alerts, it's fine to broadcast to all
				if err := client.WriteMessage(mt, msg); err != nil {
					log.Println("Write error:", err)
					client.Close()
					delete(clients, client)
				}
			}
			clientsMu.Unlock()
		}
	}))
}
