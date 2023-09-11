package controllers

import (
	"errors"
	"github.com/frederikhs/eat-score/database"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type ErrorResponse struct {
	Message error `json:"message"`
}

func GetVenueByRouteParam(db *database.Database, c *gin.Context) (*database.Venue, error) {
	id, err := strconv.Atoi(c.Param("venue_id"))
	if err != nil {
		return nil, err
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
		return nil, nil, err
	}

	item, err := db.GetItemById(itemId)
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
		c.JSON(http.StatusNotFound, gin.H{"message": "empty in here"})
	}
}
