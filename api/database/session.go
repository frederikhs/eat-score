package database

type Session struct {
	SessionId        string `db:"session_id"`
	SessionAccountId int    `db:"session_account_id"`
	MagicLoginLinkId int    `db:"magic_login_link_id"`
}

func (db *Database) CreateSession(sessionId string, account *Account, magicLoginLink *MagicLoginLink) error {
	_, err := db.Connection.Exec("INSERT INTO eat_score.session (session_id, session_account_id, magic_login_link_id) VALUES ($1, $2, $3)", sessionId, account.AccountId, magicLoginLink.MagicLoginLinkId)
	return err
}

func (db *Database) GetSessionById(sessionId string) *Session {
	var sessions []Session
	err := db.Connection.Select(&sessions, "SELECT * FROM eat_score.session WHERE session_id = $1", sessionId)
	if err != nil {
		panic(err)
	}

	if len(sessions) != 1 {
		return nil
	}

	return &sessions[0]
}
