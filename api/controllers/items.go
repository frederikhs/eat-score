package controllers

import (
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/middleware"
	"github.com/frederikhs/eat-score/response"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetAllItems(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := db.GetItems()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusOK, items)
	}
}

func CreateItem(db *database.Database) gin.HandlerFunc {
	type Item struct {
		ItemName     string `json:"item_name"`
		ItemPriceDKK int    `json:"item_price_dkk"`
	}

	return func(c *gin.Context) {
		venue, err := GetVenueByRouteParam(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		var item Item
		err = c.BindJSON(&item)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if len(item.ItemName) < 3 {
			c.JSON(response.Message(http.StatusBadRequest, "length of item name must be >= 3"))
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)

		existingItem, err := db.GetItemByNameAndVenueId(item.ItemName, venue.VenueId)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if existingItem != nil {
			if existingItem.ItemDeletedAt != nil {
				c.JSON(response.Message(http.StatusBadRequest, "a deleted item with this name already exist"))
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

		itemId, err := db.CreateItem(venue.VenueId, item.ItemName, item.ItemPriceDKK, authedContext.Account.AccountId)
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

		newItem, err := db.GetItemById(itemId)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(http.StatusCreated, newItem)
	}
}

func DeleteItem(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		venue, item, err := GetVenueItemByRouteParams(db, c)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if venue == nil || item == nil {
			c.JSON(response.ResourceNotFound())
			return
		}

		authedContext := middleware.MustGetAuthedContext(c)
		if item.ItemCreatedByAccountId != authedContext.Account.AccountId {
			c.JSON(response.Message(http.StatusForbidden, "you cannot delete items you have not created"))
			return
		}

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		err = db.DeleteItem(item.ItemId)
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

		c.JSON(response.Message(http.StatusOK, "deleted item"))
	}
}
