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

	AvgItemRatingValue               *float64 `db:"avg_item_rating_value" json:"avg_item_rating_value"`
	ItemRatingCount                  int      `db:"item_rating_count" json:"item_rating_count"`
	MinItemRatingValue               *int     `db:"min_item_rating_value" json:"min_item_rating_value"`
	MaxItemRatingValue               *int     `db:"max_item_rating_value" json:"max_item_rating_value"`
	StandardDeviationItemRatingValue *float64 `db:"standard_deviation_item_rating_value" json:"standard_deviation_item_rating_value"`
	HasRatedItem                     bool     `db:"has_rated_item" json:"has_rated_item"`
}

const ItemsSelect = `SELECT item.item_id,
		item.venue_id,
		item.venue_name,
		item.venue_deleted_at,
		item.item_name,
		item.item_price_dkk,
		item.item_created_by_account_id,
		item.item_created_by_account_name,
		item.item_created_at,
		item.item_deleted_at,
		item.avg_item_rating_value,
		item.item_rating_count,
		item.min_item_rating_value,
		item.max_item_rating_value,
		item.standard_deviation_item_rating_value,
		CASE
	WHEN EXISTS(SELECT ir.item_rating_item_id
	FROM eat_score.item_rating ir
	WHERE ir.item_rating_item_id = item.item_id AND ir.item_rating_account_id = $1) THEN True
	ELSE false END as has_rated_item
	FROM eat_score.view_item_with_rating item`

func (db *Database) GetItems(accountId int) ([]Item, error) {
	var items []Item
	err := db.Connection.Select(&items, ItemsSelect+" WHERE item_deleted_at IS NULL ORDER BY item_created_at DESC", accountId)
	if err != nil {
		return nil, err
	}

	if items == nil {
		items = []Item{}
	}

	return items, nil
}

func (db *Database) GetItemsByVenueId(accountId int, venueId int) ([]Item, error) {
	var items []Item
	err := db.Connection.Select(&items, ItemsSelect+" WHERE item_deleted_at IS NULL AND venue_id = $2 ORDER BY item_created_at DESC", accountId, venueId)
	if err != nil {
		return nil, err
	}

	if items == nil {
		items = []Item{}
	}

	return items, nil
}

func (db *Database) GetItemById(accountId int, itemId int) (*Item, error) {
	var items []Item
	err := db.Connection.Select(&items, ItemsSelect+" WHERE item_deleted_at IS NULL AND item_id = $2", accountId, itemId)
	if err != nil {
		return nil, err
	}

	if len(items) != 1 {
		return nil, nil
	}

	return &items[0], nil
}

func (db *Database) GetItemByNameAndVenueId(accountId int, itemName string, venueId int) (*Item, error) {
	var items []Item
	err := db.Connection.Select(&items, ItemsSelect+" WHERE item_deleted_at IS NULL AND item_name = $2 AND venue_id = $3", accountId, itemName, venueId)
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
