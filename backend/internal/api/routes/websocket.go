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

	// Mutex for writing to the websocket connection to avoid concurrency issues
	wsWriteMu sync.Mutex

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
			
			// If it's a proctoring alert, we broadcast it to everyone (including teachers)
			// In a real app, we'd filter by role, but for this ERP, global broadcast is used for live notifications.
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
				// Initialize files map if not present
				if roomData[roomId]["files"] == nil {
					roomData[roomId]["files"] = make(map[string]interface{})
				}
				
				files := roomData[roomId]["files"].(map[string]interface{})
				if fileName, ok := msg["fileName"].(string); ok {
					files[fileName] = msg["code"].(string)
				}
				
				roomData[roomId]["language"] = msg["language"]
				roomDataMu.Unlock()
			}

			// Handle Code Execution
			if msg["type"] == "RUN_CODE" {
				lang := msg["language"].(string)
				code := msg["code"].(string)
				go RunCommand(lang, code, roomId, c, &wsWriteMu)
				// We don't broadcast RUN_CODE to others, only the results via TERMINAL_DATA
				continue
			}

			// Handle Code Analysis
			if msg["type"] == "ANALYZE_CODE" {
				lang := msg["language"].(string)
				code := msg["code"].(string)
				results := AnalyzeCode(lang, code)
				c.WriteJSON(fiber.Map{
					"type":    "ANALYSIS_RESULTS",
					"results": results,
				})
				continue
			}

			// Handle Code Fix
			if msg["type"] == "FIX_CODE" {
				lang := msg["language"].(string)
				code := msg["code"].(string)
				fixedCode := FixCode(lang, code)
				c.WriteJSON(fiber.Map{
					"type": "CODE_FIXED",
					"code": fixedCode,
				})
				continue
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
