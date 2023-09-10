package database

type Item struct {
	ItemId             int      `db:"item_id" json:"item_id"`
	ItemName           string   `db:"item_name" json:"item_name"`
	ItemPriceDKK       int      `db:"item_price_dkk" json:"item_price_dkk"`
	AvgItemRatingValue *float64 `db:"avg_item_rating_value" json:"avg_item_rating_value"`
}

func (db *Database) GetItems() ([]Item, error) {
	var items []Item
	err := db.Connection.Select(&items, "SELECT * FROM eat_score.view_item_with_rating")
	if err != nil {
		return nil, err
	}

	return items, nil
}
