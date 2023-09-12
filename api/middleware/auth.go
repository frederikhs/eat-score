package middleware

import (
	"errors"
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"github.com/gin-gonic/gin"
	"net/http"
)

const SessionIdCookieName = "session_id"

var (
	ErrNoSessionCookie            = errors.New("no session id")
	ErrSessionIdNotFound          = errors.New("session id not found")
	ErrAccountNotFoundBySessionId = errors.New("account not found by session id")
)

type LoggedInInfo struct {
	LoggedIn bool   `json:"logged_in"`
	Message  string `json:"message"`
}

const authedContextKey = "authed_context"

type AuthedContext struct {
	Session *database.Session `json:"-"`
	Account *database.Account `json:"account"`
}

func MustGetAuthedContext(c *gin.Context) AuthedContext {
	value := c.MustGet(authedContextKey)
	return value.(AuthedContext)
}

func AuthenticationMiddleware(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionId, err := c.Cookie(SessionIdCookieName)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, LoggedInInfo{LoggedIn: false, Message: ErrNoSessionCookie.Error()})
			return
		}

		session := db.GetSessionById(sessionId)
		if session == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, LoggedInInfo{LoggedIn: false, Message: ErrSessionIdNotFound.Error()})
			return
		}

		account, err := db.GetAccountById(session.SessionAccountId)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, LoggedInInfo{LoggedIn: false, Message: fmt.Errorf("something bad happened: %v", err).Error()})
			return
		}

		if account == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, LoggedInInfo{LoggedIn: false, Message: ErrAccountNotFoundBySessionId.Error()})
			return
		}

		c.Set(authedContextKey, AuthedContext{
			Session: session,
			Account: account,
		})

		c.Next()
	}
}
