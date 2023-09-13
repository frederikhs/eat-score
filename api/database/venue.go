package database

import "time"

type Venue struct {
	VenueId                   int        `db:"venue_id" json:"venue_id"`
	VenueName                 string     `db:"venue_name" json:"venue_name"`
	VenueCreatedAt            time.Time  `db:"venue_created_at" json:"venue_created_at"`
	VenueDeletedAt            *time.Time `db:"venue_deleted_at" json:"venue_deleted_at"`
	AvgVenueRatingValue       *float64   `db:"avg_venue_rating_value" json:"avg_venue_rating_value"`
	VenueCreatedByAccountId   int        `db:"venue_created_by_account_id" json:"venue_created_by_account_id"`
	VenueCreatedByAccountName string     `db:"venue_created_by_account_name" json:"venue_created_by_account_name"`
}

func (db *Database) GetVenues() ([]Venue, error) {
	var venues []Venue
	err := db.Connection.Select(&venues, "SELECT * FROM eat_score.view_venue_with_rating WHERE venue_deleted_at IS NULL ORDER BY avg_venue_rating_value DESC")
	if err != nil {
		return nil, err
	}

	if venues == nil {
		venues = []Venue{}
	}

	return venues, nil
}

func (db *Database) GetVenueById(venueId int) (*Venue, error) {
	var venues []Venue
	err := db.Connection.Select(&venues, "SELECT * FROM eat_score.view_venue_with_rating WHERE venue_deleted_at IS NULL AND venue_id = $1", venueId)
	if err != nil {
		return nil, err
	}

	if len(venues) != 1 {
		return nil, nil
	}

	return &venues[0], nil
}

func (db *Database) GetVenueByName(venueName string) (*Venue, error) {
	var venues []Venue
	err := db.Connection.Select(&venues, "SELECT * FROM eat_score.view_venue_with_rating WHERE venue_deleted_at IS NULL AND venue_name = $1", venueName)
	if err != nil {
		return nil, err
	}

	if len(venues) != 1 {
		return nil, nil
	}

	return &venues[0], nil
}

func (db *Database) CreateVenue(venueName string, venueCreatedByAccountId int) error {
	_, err := db.Connection.Exec("INSERT INTO eat_score.venue (venue_name, venue_created_by_account_id) VALUES ($1, $2)", venueName, venueCreatedByAccountId)
	return err
}

func (db *Database) DeleteVenueById(venueId int) error {
	_, err := db.Connection.Exec("UPDATE eat_score.venue SET venue_deleted_at = NOW() WHERE venue_id = $1", venueId)
	if err != nil {
		return err
	}

	_, err = db.Connection.Exec("UPDATE eat_score.item SET item_deleted_at = NOW() WHERE item_venue_id = $1", venueId)
	return err
}
