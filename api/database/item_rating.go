package database

import "time"

type ItemRating struct {
	ItemRatingId    int        `db:"item_rating_id" json:"item_rating_id"`
	ItemId          int        `db:"item_id" json:"item_id"`
	ItemName        string     `db:"item_name" json:"item_name"`
	VenueId         int        `db:"venue_id" json:"venue_id"`
	VenueName       string     `db:"venue_name" json:"venue_name"`
	VenueDeletedAt  *time.Time `db:"venue_deleted_at" json:"venue_deleted_at"`
	ItemRatingValue int        `db:"item_rating_value" json:"item_rating_value"`
	AccountId       int        `db:"item_rating_account_id" json:"item_rating_account_id"`
	AccountName     string     `db:"item_rating_account_name" json:"item_rating_account_name"`
}

func (db *Database) GetItemRatingByItemIdAndVenueId(itemId int, venueId int) ([]ItemRating, error) {
	var itemRatings []ItemRating
	err := db.Connection.Select(&itemRatings, "SELECT * FROM eat_score.view_item_rating WHERE venue_deleted_at IS NULL AND item_id = $1 AND venue_id = $2", itemId, venueId)
	if err != nil {
		return nil, err
	}

	if itemRatings == nil {
		itemRatings = []ItemRating{}
	}

	return itemRatings, nil
}

func (db *Database) CreateItemRating(itemId int, accountId, value int) error {
	_, err := db.Connection.Exec("INSERT INTO eat_score.item_rating (item_rating_item_id, item_rating_account_id, item_rating_value) VALUES ($1, $2, $3) ON CONFLICT (item_rating_item_id, item_rating_account_id) DO UPDATE SET item_rating_value = $3", itemId, accountId, value)
	return err
}
