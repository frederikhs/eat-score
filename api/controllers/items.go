package controllers

import (
	"github.com/frederikhs/eat-score/database"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAllItems(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := db.GetItems()
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}
