package routes

import (
	"log"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

var (
	// Store connected clients for global alerts
	clients   = make(map[*websocket.Conn]bool)
	clientsMu sync.Mutex

	// Store rooms for collaborative coding
	// roomId -> map of connections
	rooms   = make(map[string]map[*websocket.Conn]bool)
	roomsMu sync.Mutex

	// Store room data (current code, language, etc.)
	roomData   = make(map[string]map[string]interface{})
	roomDataMu sync.Mutex
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

	// Global WebSocket for alerts and generic broadcasts
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		clientsMu.Lock()
		clients[c] = true
		clientsMu.Unlock()

		log.Printf("Global client connected. Total: %d", len(clients))

		defer func() {
			clientsMu.Lock()
			delete(clients, c)
			clientsMu.Unlock()
			c.Close()
		}()

		for {
			mt, msg, err := c.ReadMessage()
			if err != nil {
				break
			}
			// Broadcast to all global clients
			clientsMu.Lock()
			for client := range clients {
				client.WriteMessage(mt, msg)
			}
			clientsMu.Unlock()
		}
	}))

	// Collaborative Room WebSocket
	app.Get("/ws/collaborative/:roomId", websocket.New(func(c *websocket.Conn) {
		roomId := c.Params("roomId")
		if roomId == "" {
			c.Close()
			return
		}

		roomsMu.Lock()
		if rooms[roomId] == nil {
			rooms[roomId] = make(map[*websocket.Conn]bool)
		}
		rooms[roomId][c] = true
		roomsMu.Unlock()

		log.Printf("Client joined room %s. Members: %d", roomId, len(rooms[roomId]))

		// Send initial data if exists
		roomDataMu.Lock()
		if data, ok := roomData[roomId]; ok {
			c.WriteJSON(fiber.Map{
				"type": "INIT_DATA",
				"data": data,
			})
		}
		roomDataMu.Unlock()

		defer func() {
			roomsMu.Lock()
			delete(rooms[roomId], c)
			if len(rooms[roomId]) == 0 {
				delete(rooms, roomId)
				// Optional: clear room data if no one is left
				// roomDataMu.Lock()
				// delete(roomData, roomId)
				// roomDataMu.Unlock()
			}
			roomsMu.Unlock()
			c.Close()
			log.Printf("Client left room %s", roomId)
		}()

		for {
			var msg map[string]interface{}
			if err := c.ReadJSON(&msg); err != nil {
				break
			}

			// Update room data if it's a sync message
			if msg["type"] == "CODE_SYNC" {
				roomDataMu.Lock()
				if roomData[roomId] == nil {
					roomData[roomId] = make(map[string]interface{})
				}
				roomData[roomId]["code"] = msg["code"]
				roomData[roomId]["language"] = msg["language"]
				roomDataMu.Unlock()
			}

			// Broadcast to everyone in the room EXCEPT the sender
			roomsMu.Lock()
			for client := range rooms[roomId] {
				if client != c {
					client.WriteJSON(msg)
				}
			}
			roomsMu.Unlock()
		}
	}))
}
