package controllers

import (
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/middleware"
	"github.com/frederikhs/eat-score/response"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAllVenues(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venues, err := db.GetVenues()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusOK, venues)
	}
}

func GetVenueById(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, err := GetVenueByRouteParam(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if venue == nil {
			c.JSON(response.ResourceNotFound())
			return
		}

		c.JSON(http.StatusOK, venue)
	}
}

func GetVenueItemsByVenueId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, err := GetVenueByRouteParam(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if venue == nil {
			c.JSON(response.ResourceNotFound())
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)
		items, err := db.GetItemsByVenueId(authedContext.Account.AccountId, venue.VenueId)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusOK, items)
	}
}

func GetVenueItemByVenueIdAndItemId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, item, err := GetVenueItemByRouteParams(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusOK, item)
	}
}

func GetItemByItemId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		item, err := GetItemByRouteParam(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusOK, item)
	}
}

func GetVenueItemRatingsByVenueIdAndItemId(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, item, err := GetVenueItemByRouteParams(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		itemRatings, err := db.GetItemRatingByItemIdAndVenueId(item.ItemId, venue.VenueId)
		if err != nil {
			c.JSON(response.Error(err))
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
			c.JSON(response.Error(err))
			return
		}

		var rating Rating
		err = c.BindJSON(&rating)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if rating.Value == -1 {
			err = db.DeleteItemRating(item.ItemId, authedContext.Account.AccountId)
		} else if rating.Value >= 0 && rating.Value <= 10 {
			err = db.CreateItemRating(item.ItemId, authedContext.Account.AccountId, rating.Value)
		} else {
			err = fmt.Errorf("rating of item %d must be of value 0 trough 10", item.ItemId)
		}

		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		err = db.Connection.Commit()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(response.Message(http.StatusCreated, "rating created"))
	}
}

func CreateVenue(db *database.Database) gin.HandlerFunc {
	type Venue struct {
		VenueName string `json:"venue_name"`
	}

	return func(c *gin.Context) {
		var venue Venue
		err := c.BindJSON(&venue)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if len(venue.VenueName) < 3 {
			c.JSON(response.Message(http.StatusBadRequest, "length of venue name must be >= 3"))
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)

		existingVenue, err := db.GetVenueByName(venue.VenueName)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if existingVenue != nil {
			if existingVenue.VenueDeletedAt != nil {
				c.JSON(response.Message(http.StatusBadRequest, "a deleted venue with this name already exist"))
				return
			}

			c.JSON(response.ResourceAlreadyExists())
			return
		}

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		err = db.CreateVenue(venue.VenueName, authedContext.Account.AccountId)
		if err != nil {
			_ = db.Connection.Rollback()
			c.JSON(response.Error(err))
			return
		}

		err = db.Connection.Commit()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		newVenue, err := db.GetVenueByName(venue.VenueName)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusCreated, newVenue)
	}
}

func DeleteVenue(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, err := GetVenueByRouteParam(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if venue == nil {
			c.JSON(response.ResourceNotFound())
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)
		if venue.VenueCreatedByAccountId != authedContext.Account.AccountId {
			c.JSON(response.Message(http.StatusForbidden, "you cannot delete venues you have not created"))
			return
		}

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		err = db.DeleteVenueById(venue.VenueId)
		if err != nil {
			_ = db.Connection.Rollback()
			c.JSON(response.Error(err))
			return
		}

		err = db.Connection.Commit()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(response.Message(http.StatusOK, "deleted venue"))
	}
}

func GetItemRatingAccountStatistics(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats, err := db.GetItemRatingAccountStatistics()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusOK, stats)
	}
}
