package database

import "time"

type Account struct {
	AccountId        int        `json:"account_id" db:"account_id"`
	AccountEmail     string     `json:"account_email" db:"account_email"`
	AccountName      string     `json:"account_name" db:"account_name"`
	AccountCreatedAt time.Time  `json:"account_created_at" db:"account_created_at"`
	AccountDeletedAt *time.Time `json:"-" db:"account_deleted_at"`
}

func (db *Database) GetAccountById(id int) (*Account, error) {
	var accounts []Account
	err := db.Connection.Select(&accounts, "SELECT * FROM eat_score.account WHERE account.account_id = $1", id)
	if err != nil {
		return nil, err
	}

	if len(accounts) != 1 {
		return nil, nil
	}

	return &accounts[0], nil
}

func (db *Database) GetAccountByEmail(email string) (*Account, error) {
	var accounts []Account
	err := db.Connection.Select(&accounts, "SELECT * FROM eat_score.account WHERE account.account_email = $1", email)
	if err != nil {
		return nil, err
	}

	if len(accounts) != 1 {
		return nil, nil
	}

	return &accounts[0], nil
}
