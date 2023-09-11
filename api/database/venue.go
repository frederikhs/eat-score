package database

type Venue struct {
	VenueId             int      `db:"venue_id" json:"venue_id"`
	VenueName           string   `db:"venue_name" json:"venue_name"`
	AvgVenueRatingValue *float64 `db:"avg_venue_rating_value" json:"avg_venue_rating_value"`
}

func (db *Database) GetVenues() ([]Venue, error) {
	var venues []Venue
	err := db.Connection.Select(&venues, "SELECT * FROM eat_score.view_venue_with_rating ORDER BY avg_venue_rating_value DESC")
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
	err := db.Connection.Select(&venues, "SELECT * FROM eat_score.view_venue_with_rating WHERE venue_id = $1", venueId)
	if err != nil {
		return nil, err
	}

	if len(venues) != 1 {
		return nil, nil
	}

	return &venues[0], nil
}
