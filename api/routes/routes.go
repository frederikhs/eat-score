package routes

import (
	"github.com/frederikhs/eat-score/controllers"
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/middleware"
	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine, db *database.Database) {
	r.GET("/healthz", controllers.HealthCheck())
	r.POST("/logout", controllers.Logout())
	r.POST("/login/request", controllers.LoginRequest(db))
	r.POST("/login", controllers.LoginWithMagicLink(db))

	ar := r.Group("/", middleware.AuthenticationMiddleware(db))
	registerAuthedRoutes(ar, db)

	r.NoRoute(controllers.NotFound())
}

func registerAuthedRoutes(r *gin.RouterGroup, db *database.Database) {
	r.GET("/me", controllers.AccountInfo())
	r.GET("/accounts/item-rating-statistics", controllers.GetItemRatingAccountStatistics(db))

	r.GET("/venues", controllers.GetAllVenues(db))
	r.POST("/venues", controllers.CreateVenue(db))
	r.GET("/venues/:venue_id", controllers.GetVenueById(db))
	r.DELETE("/venues/:venue_id", controllers.DeleteVenue(db))
	r.GET("/venues/:venue_id/items", controllers.GetVenueItemsByVenueId(db))
	r.POST("/venues/:venue_id/items", controllers.CreateItem(db))
	r.GET("/venues/:venue_id/items/:item_id", controllers.GetVenueItemByVenueIdAndItemId(db))
	r.DELETE("/venues/:venue_id/items/:item_id", controllers.DeleteItem(db))
	r.GET("/venues/:venue_id/items/:item_id/ratings", controllers.GetVenueItemRatingsByVenueIdAndItemId(db))
	r.POST("/venues/:venue_id/items/:item_id/ratings", controllers.CreateItemRatingByVenueIdAndItemId(db))

	r.GET("/items", controllers.GetAllItems(db))
	r.GET("/items/paginated", controllers.GetAllItemsPaginated(db))
}
