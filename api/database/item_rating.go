package database

type ItemRating struct {
	ItemRatingId    int    `db:"item_rating_id" json:"item_rating_id"`
	ItemId          int    `db:"item_id" json:"item_id"`
	ItemName        string `db:"item_name" json:"item_name"`
	VenueId         int    `db:"venue_id" json:"venue_id"`
	VenueName       string `db:"venue_name" json:"venue_name"`
	ItemRatingValue int    `db:"item_rating_value" json:"item_rating_value"`
	AccountId       int    `db:"account_id" json:"account_id"`
	AccountName     string `db:"account_name" json:"account_name"`
}

func (db *Database) GetItemRatingByItemIdAndVenueId(itemId int, venueId int) ([]ItemRating, error) {
	var itemRatings []ItemRating
	err := db.Connection.Select(&itemRatings, "SELECT * FROM eat_score.view_item_rating WHERE item_id = $1 AND venue_id = $2", itemId, venueId)
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
