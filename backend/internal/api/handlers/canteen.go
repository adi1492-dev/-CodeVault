package handlers

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/adi1492-dev/codevault/internal/db"
	"github.com/adi1492-dev/codevault/internal/models"
)

// ── Menu ──────────────────────────────────────────────────────────────────────

func GetMenu(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON(mockMenuItems())
	}
	var items []models.CanteenItem
	db.DB.Where("deleted_at IS NULL").Find(&items)
	return c.JSON(items)
}

func CreateMenuItem(c *fiber.Ctx) error {
	var item models.CanteenItem
	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&item)
	}
	return c.Status(201).JSON(item)
}

func UpdateMenuItem(c *fiber.Ctx) error {
	id := c.Params("id")
	var item models.CanteenItem
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true})
	}
	if err := db.DB.First(&item, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	c.BodyParser(&item)
	item.UpdatedAt = time.Now()
	db.DB.Save(&item)
	return c.JSON(item)
}

func DeleteMenuItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true})
	}
	db.DB.Delete(&models.CanteenItem{}, id)
	return c.JSON(fiber.Map{"ok": true})
}

// ── Orders ────────────────────────────────────────────────────────────────────

func GetOrders(c *fiber.Ctx) error {
	if db.DB == nil {
		return c.JSON(mockOrders())
	}
	var orders []models.CanteenOrder
	db.DB.Where("deleted_at IS NULL").Order("placed_at desc").Find(&orders)
	return c.JSON(orders)
}

func PlaceOrder(c *fiber.Ctx) error {
	var order models.CanteenOrder
	if err := c.BodyParser(&order); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	order.OrderStatus = "pending"
	order.PickupCode = randCode(6)
	order.PlacedAt = time.Now()
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()
	if db.DB != nil {
		db.DB.Create(&order)
		// Debit wallet if payment_mode == "wallet"
		if order.PaymentMode == "wallet" {
			db.DB.Model(&models.User{}).Where("id = ?", order.StudentID).
				UpdateColumn("canteen_balance", fmt.Sprintf("canteen_wallet_balance - %f", order.TotalAmount))
			db.DB.Create(&models.CanteenWalletTransaction{
				UserID:           order.StudentID,
				Type:             "debit",
				Amount:           order.TotalAmount,
				Description:      fmt.Sprintf("Order #%d", order.ID),
				ReferenceOrderID: &order.ID,
				CreatedAt:        time.Now(),
			})
		}
	}
	return c.Status(201).JSON(order)
}

func UpdateOrderStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var body struct{ Status string `json:"status"` }
	c.BodyParser(&body)
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true, "status": body.Status})
	}
	var order models.CanteenOrder
	if err := db.DB.First(&order, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	order.OrderStatus = body.Status
	order.UpdatedAt = time.Now()
	if body.Status == "completed" {
		now := time.Now()
		order.CompletedAt = &now
	}
	db.DB.Save(&order)
	return c.JSON(order)
}

// ── Wallet ────────────────────────────────────────────────────────────────────

func GetWallet(c *fiber.Ctx) error {
	userID := c.Params("userId")
	if db.DB == nil {
		return c.JSON(fiber.Map{"balance": 200.0, "transactions": []fiber.Map{}})
	}
	var user models.User
	if err := db.DB.Select("id,name,canteen_wallet_balance").First(&user, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	var txns []models.CanteenWalletTransaction
	db.DB.Where("user_id = ?", userID).Order("created_at desc").Limit(20).Find(&txns)
	return c.JSON(fiber.Map{"balance": user.CanteenBalance, "user": user.Name, "transactions": txns})
}

func RechargeWallet(c *fiber.Ctx) error {
	var body struct {
		UserID uint    `json:"user_id"`
		Amount float64 `json:"amount"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	if db.DB == nil {
		return c.JSON(fiber.Map{"ok": true, "new_balance": body.Amount})
	}
	db.DB.Model(&models.User{}).Where("id = ?", body.UserID).
		UpdateColumn("canteen_wallet_balance", fmt.Sprintf("canteen_wallet_balance + %f", body.Amount))
	db.DB.Create(&models.CanteenWalletTransaction{
		UserID: body.UserID, Type: "credit", Amount: body.Amount,
		Description: "Wallet recharge by parent", CreatedAt: time.Now(),
	})
	var user models.User
	db.DB.Select("canteen_wallet_balance").First(&user, body.UserID)
	return c.JSON(fiber.Map{"ok": true, "new_balance": user.CanteenBalance})
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func randCode(n int) string {
	const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func mockMenuItems() []fiber.Map {
	return []fiber.Map{
		{"id": 1, "name": "Veg Biryani", "category": "Lunch", "price": 60, "is_available": true, "prep_time_minutes": 15},
		{"id": 2, "name": "Masala Dosa", "category": "Breakfast", "price": 35, "is_available": true, "prep_time_minutes": 8},
		{"id": 3, "name": "Samosa (2 pcs)", "category": "Snacks", "price": 20, "is_available": true, "prep_time_minutes": 3},
		{"id": 4, "name": "Cold Coffee", "category": "Beverages", "price": 45, "is_available": true, "prep_time_minutes": 5},
		{"id": 5, "name": "Paneer Roll", "category": "Snacks", "price": 50, "is_available": false, "prep_time_minutes": 10},
	}
}

func mockOrders() []fiber.Map {
	return []fiber.Map{
		{"id": 101, "student_id": 4, "items": `[{"name":"Veg Biryani","qty":1,"price":60}]`, "total_amount": 60, "order_status": "preparing", "pickup_code": "ABX7K2", "placed_at": time.Now().Add(-10 * time.Minute)},
	}
}
