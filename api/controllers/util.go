package controllers

import (
	"errors"
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/middleware"
	"github.com/frederikhs/eat-score/response"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

var (
	ErrCouldNotParseInt = "could not parse as integer"
)

type ErrorResponse struct {
	Message error `json:"message"`
}

func GetVenueByRouteParam(db *database.Database, c *gin.Context) (*database.Venue, error) {
	id, err := strconv.Atoi(c.Param("venue_id"))
	if err != nil {
		return nil, fmt.Errorf("could not parse venue_id: %v", ErrCouldNotParseInt)
	}

	venue, err := db.GetVenueById(id)
	if err != nil {
		return nil, err
	}

	return venue, nil
}

func GetVenueItemByRouteParams(db *database.Database, c *gin.Context) (*database.Venue, *database.Item, error) {
	venue, err := GetVenueByRouteParam(db, c)
	if err != nil {
		return nil, nil, err
	}

	itemId, err := strconv.Atoi(c.Param("item_id"))
	if err != nil {
		return nil, nil, fmt.Errorf("could not parse item_id: %v", ErrCouldNotParseInt)
	}

	authedContext := middleware.MustGetAuthedContext(c)
	item, err := db.GetItemById(authedContext.Account.AccountId, itemId)
	if err != nil {
		return nil, nil, err
	}

	if venue.VenueId != item.VenueId {
		return nil, nil, errors.New("item not found at venue")
	}

	return venue, item, nil
}

func NotFound() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(response.Message(http.StatusNotFound, "empty in here"))
	}
}

func HealthCheck() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(response.Message(http.StatusOK, "ok"))
	}
}
