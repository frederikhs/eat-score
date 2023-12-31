package database

import "time"

type ItemRating struct {
	ItemRatingId        int        `db:"item_rating_id" json:"item_rating_id"`
	ItemId              int        `db:"item_id" json:"item_id"`
	ItemName            string     `db:"item_name" json:"item_name"`
	VenueId             int        `db:"venue_id" json:"venue_id"`
	VenueName           string     `db:"venue_name" json:"venue_name"`
	VenueDeletedAt      *time.Time `db:"venue_deleted_at" json:"venue_deleted_at"`
	ItemRatingValue     int        `db:"item_rating_value" json:"item_rating_value"`
	ItemRatingCreatedAt time.Time  `db:"item_rating_created_at" json:"item_rating_created_at"`
	AccountId           int        `db:"item_rating_account_id" json:"item_rating_account_id"`
	AccountName         string     `db:"item_rating_account_name" json:"item_rating_account_name"`
}

func (db *Database) GetItemRatingByItemIdAndVenueId(itemId int, venueId int) ([]ItemRating, error) {
	var itemRatings []ItemRating
	err := db.Connection.Select(&itemRatings, "SELECT * FROM eat_score.view_item_rating WHERE venue_deleted_at IS NULL AND item_id = $1 AND venue_id = $2 ORDER BY item_rating_created_at DESC", itemId, venueId)
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

func (db *Database) DeleteItemRating(itemId int, accountId int) error {
	_, err := db.Connection.Exec("DELETE FROM eat_score.item_rating WHERE item_rating_item_id = $1 AND item_rating_account_id = $2", itemId, accountId)
	return err
}

type ItemRatingAccountStatistics struct {
	AccountId   int      `db:"account_id" json:"account_id"`
	AccountName string   `db:"account_name" json:"account_name"`
	Count       int      `db:"count" json:"count"`
	Avg         *float64 `db:"avg" json:"avg"`
	StdDev      *float64 `db:"std_dev" json:"std_dev"`
}

func (db *Database) GetItemRatingAccountStatistics() ([]ItemRatingAccountStatistics, error) {
	var stats []ItemRatingAccountStatistics
	err := db.Connection.Select(&stats, `
		SELECT a.account_id,
			   a.account_name,
			   COUNT(1)                            as count,
			   ROUND(AVG(item_rating_value), 1)    as avg,
			   ROUND(stddev(item_rating_value), 1) as std_dev
		FROM eat_score.account a
				 JOIN eat_score.item_rating on item_rating.item_rating_account_id = a.account_id
		GROUP BY 1, 2
		ORDER BY count DESC
`)
	if err != nil {
		return nil, err
	}

	if stats == nil {
		stats = []ItemRatingAccountStatistics{}
	}

	return stats, nil
}
