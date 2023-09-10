package database

import (
	"github.com/frederikhs/go-connection"
	"os"
)

type Database struct {
	Connection *connection.Conn
}

func Connect() *Database {
	config := &connection.Config{
		User:     os.Getenv("POSTGRES_USERNAME"),
		Pass:     os.Getenv("POSTGRES_PASSWORD"),
		Host:     os.Getenv("POSTGRES_HOST"),
		Port:     "5432",
		Database: os.Getenv("POSTGRES_DB_NAME"),
	}
	return &Database{
		Connection: config.Connect(),
	}
}
