package database

import "time"

type Item struct {
	ItemId                   int        `db:"item_id" json:"item_id"`
	VenueId                  int        `db:"venue_id" json:"venue_id"`
	VenueName                string     `db:"venue_name" json:"venue_name"`
	VenueDeletedAt           *time.Time `db:"venue_deleted_at" json:"-"`
	ItemName                 string     `db:"item_name" json:"item_name"`
	ItemPriceDKK             int        `db:"item_price_dkk" json:"item_price_dkk"`
	ItemCreatedByAccountId   int        `db:"item_created_by_account_id" json:"item_created_by_account_id"`
	ItemCreatedByAccountName string     `db:"item_created_by_account_name" json:"item_created_by_account_name"`
	ItemCreatedAt            time.Time  `db:"item_created_at" json:"item_created_at"`
	ItemDeletedAt            *time.Time `db:"item_deleted_at" json:"item_deleted_at"`

	AvgItemRatingValue *float64 `db:"avg_item_rating_value" json:"avg_item_rating_value"`
	ItemRatingCount    int      `db:"item_rating_count" json:"item_rating_count"`
}

func (db *Database) GetItems() ([]Item, error) {
	var items []Item
	err := db.Connection.Select(&items, "SELECT * FROM eat_score.view_item_with_rating WHERE item_deleted_at IS NULL ORDER BY item_created_at DESC")
	if err != nil {
		return nil, err
	}

	if items == nil {
		items = []Item{}
	}

	return items, nil
}

func (db *Database) GetItemsByVenueId(venueId int) ([]Item, error) {
	var items []Item
	err := db.Connection.Select(&items, "SELECT * FROM eat_score.view_item_with_rating WHERE item_deleted_at IS NULL AND venue_id = $1", venueId)
	if err != nil {
		return nil, err
	}

	if items == nil {
		items = []Item{}
	}

	return items, nil
}

func (db *Database) GetItemById(itemId int) (*Item, error) {
	var items []Item
	err := db.Connection.Select(&items, "SELECT * FROM eat_score.view_item_with_rating WHERE item_deleted_at IS NULL AND item_id = $1", itemId)
	if err != nil {
		return nil, err
	}

	if len(items) != 1 {
		return nil, nil
	}

	return &items[0], nil
}

func (db *Database) GetItemByNameAndVenueId(itemName string, venueId int) (*Item, error) {
	var items []Item
	err := db.Connection.Select(&items, "SELECT * FROM eat_score.view_item_with_rating WHERE item_deleted_at IS NULL AND item_name = $1 AND venue_id = $2", itemName, venueId)
	if err != nil {
		return nil, err
	}

	if len(items) != 1 {
		return nil, nil
	}

	return &items[0], nil
}

func (db *Database) CreateItem(itemVenueId int, itemName string, itemPriceDKK int, itemCreatedByAccountId int) (int, error) {
	itemId := 0
	err := db.Connection.QueryRow("INSERT INTO eat_score.item (item_venue_id, item_name, item_price_dkk, item_created_by_account_id) VALUES ($1, $2, $3, $4) RETURNING item_id", itemVenueId, itemName, itemPriceDKK, itemCreatedByAccountId).Scan(&itemId)
	return itemId, err
}

func (db *Database) DeleteItem(itemId int) error {
	_, err := db.Connection.Exec("UPDATE eat_score.item SET item_deleted_at = NOW() WHERE item_id = $1", itemId)
	return err
}
