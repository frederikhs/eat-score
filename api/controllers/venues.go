package controllers

import (
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAllVenues(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venues, err := db.GetVenues()
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusOK, venues)
	}
}

func GetVenueById(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, err := GetVenueByRouteParam(db, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusOK, venue)
	}
}

func GetVenueItemsByVenueId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, err := GetVenueByRouteParam(db, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		items, err := db.GetItemsByVenueId(venue.VenueId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusOK, items)
	}
}

func GetVenueItemByVenueIdAndItemId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, item, err := GetVenueItemByRouteParams(db, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusOK, item)
	}
}

func GetVenueItemRatingsByVenueIdAndItemId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, item, err := GetVenueItemByRouteParams(db, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		itemRatings, err := db.GetItemRatingByItemIdAndVenueId(item.ItemId, venue.VenueId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusOK, itemRatings)
	}
}

func CreateItemRatingByVenueIdAndItemId(db *database.Database) gin.HandlerFunc {
	type Rating struct {
		Value int `json:"value"`
	}

	return func(c *gin.Context) {
		_, item, err := GetVenueItemByRouteParams(db, c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		var rating Rating
		err = c.BindJSON(&rating)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		err = db.CreateItemRating(item.ItemId, authedContext.Account.AccountId, rating.Value)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		err = db.Connection.Commit()
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: err})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "rating created",
		})
	}
}
