package sandsmad

import (
	"errors"
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/sandsmad_parser"
	"log"
)

const sandsmadVenueId = 7
const robotAccountId = 0

var ErrAlreadyExist = errors.New("item with this name already exist")

func Run(db *database.Database) error {
	err := db.Connection.Begin()
	if err != nil {
		return err
	}

	err = fetchAndTryCreateDishForToday(db)
	if err != nil {
		_ = db.Connection.Rollback()
		if errors.Is(err, ErrAlreadyExist) {
			return nil
		}

		return err
	}

	err = db.Connection.Commit()
	if err != nil {
		return err
	}

	return nil
}

func fetchAndTryCreateDishForToday(db *database.Database) error {
	dishes, err := sandsmad_parser.FetchThisWeeksDishes()
	if err != nil {
		return err
	}

	var yes bool
	for _, dish := range dishes {
		err, yes = dish.IsDishOnTheMenuToday()

		if err != nil && !errors.Is(err, sandsmad_parser.ErrWeekdayNotDishDay) {
			return err
		}

		if !yes {
			continue
		}

		err = CreateDish(db, dish)
		if err != nil {
			return err
		}

		log.Printf("Created dish \"%s\" automatically\n", dish.ShortDescription)
	}

	return nil
}

func CreateDish(db *database.Database, dish sandsmad_parser.DishOfTheDay) error {
	venue, err := db.GetVenueById(sandsmadVenueId)
	if err != nil {
		return err
	}

	existingItem, err := db.GetItemByNameAndVenueId(robotAccountId, dish.ShortDescription, venue.VenueId)
	if err != nil {
		return err
	}

	if existingItem != nil {
		return ErrAlreadyExist
	}

	_, err = db.CreateItem(venue.VenueId, dish.ShortDescription, 0, robotAccountId)
	if err != nil {
		return err
	}

	return nil
}
