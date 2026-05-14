package db

import (
	"fmt"
	"log"
	"os"

	"github.com/adi1492-dev/codevault/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "codevault"),
		getEnv("DB_PORT", "5432"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Printf("⚠️ WARNING: PostgreSQL connection failed: %v. Running in stateless local mode.", err)
		return
	}

	fmt.Println("Database connection established")

	// Auto Migration
	err = db.AutoMigrate(
		&models.User{},
		&models.Problem{},
		&models.TestCase{},
		&models.Submission{},
		&models.TestResult{},
		&models.CanteenItem{},
		&models.CanteenOrder{},
		&models.CanteenWalletTransaction{},
		&models.Assignment{},
		&models.AcademicSubmission{},
		&models.TimetableSlot{},
		&models.LeaveApplication{},
		&models.AttendanceRecord{},
		&models.FeeTransaction{},
		&models.Announcement{},
		&models.LibraryLoan{},
		&models.GatePass{},
		&models.MaintenanceComplaint{},
	)

	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	DB = db
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
