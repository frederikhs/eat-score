package controllers

import (
	"github.com/frederikhs/eat-score/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AccountInfo() func(c *gin.Context) {
	return func(c *gin.Context) {
		authedContext := middleware.MustGetAuthedContext(c)

		c.JSON(http.StatusOK, authedContext.Account)
	}
}
