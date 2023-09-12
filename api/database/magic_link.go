package database

import (
	"time"
)

type MagicLoginLink struct {
	MagicLoginLinkId        int        `db:"magic_login_link_id"`
	MagicLoginLinkAccountId int        `db:"magic_login_link_account_id"`
	MagicLoginLinkHash      string     `db:"magic_login_link_hash"`
	MagicLoginLinkCreatedAt time.Time  `db:"magic_login_link_created_at"`
	MagicLoginLinkUsedAt    *time.Time `db:"magic_login_link_used_at"`
}

func (db *Database) CreateMagicLoginLink(account *Account, hash string) error {
	_, err := db.Connection.Exec("INSERT INTO eat_score.magic_login_link (magic_login_link_account_id, magic_login_link_hash) VALUES ($1, $2)", account.AccountId, hash)
	return err
}

func (db *Database) GetMagicLoginLinkByLinkHash(magicLinkHash string) *MagicLoginLink {
	var links []MagicLoginLink
	err := db.Connection.Select(&links, "SELECT * FROM eat_score.magic_login_link WHERE magic_login_link_hash = $1", magicLinkHash)
	if err != nil {
		panic(err)
	}

	if len(links) != 1 {
		return nil
	}

	return &links[0]
}

func (db *Database) SetMagicLoginLinkUsedAt(magicLinkHash string) error {
	_, err := db.Connection.Exec("UPDATE eat_score.magic_login_link SET magic_login_link_used_at = $1 WHERE magic_login_link_hash = $2", time.Now(), magicLinkHash)
	return err
}
