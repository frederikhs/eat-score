package main

import (
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	err := godotenv.Load(".env.development")
	if err != nil {
		panic(err)
	}

	db := database.Connect()

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	routes.Register(r, db)

	log.Fatal(r.Run(":8080"))
}
