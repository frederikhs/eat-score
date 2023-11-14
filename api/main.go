package main

import (
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/routes"
	"github.com/frederikhs/eat-score/sandsmad"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"time"
)

func main() {
	switch os.Getenv("ENVIRONMENT") {
	case "PRODUCTION":
		_ = godotenv.Load(".env.production")
	default:
		_ = godotenv.Load(".env.development")
	}

	db := database.Connect()

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{os.Getenv("WEB_BASE_URI")}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	routes.Register(r, db)

	go func() {
		for {
			err := sandsmad.Run(db)
			if err != nil {
				log.Println(err)
			}
			time.Sleep(time.Hour)
		}
	}()

	log.Fatal(r.Run(":8080"))
}
