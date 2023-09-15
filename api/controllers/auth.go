package controllers

import (
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/email"
	"github.com/frederikhs/eat-score/response"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"os"
)

func Logout() func(c *gin.Context) {
	return func(c *gin.Context) {
		c.SetCookie("session_id", "", -1, "/", os.Getenv("WEB_BASE_URI"), os.Getenv("ENVIRONMENT") == "PRODUCTION", true)
		c.JSON(response.Message(http.StatusOK, "you are now logged out"))
	}
}

func LoginRequest(db *database.Database) func(c *gin.Context) {
	type LoginRequest struct {
		Email string `json:"email"`
	}

	return func(c *gin.Context) {
		var lr LoginRequest
		err := c.BindJSON(&lr)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		account, err := db.GetAccountByEmail(lr.Email)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		if account == nil {
			c.JSON(response.Message(http.StatusBadRequest, "account does not exist"))
			return
		}

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		hash := uuid.New().String()
		err = db.CreateMagicLoginLink(account, hash)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		link := fmt.Sprintf("%s/magic-login?magic_login_link_hash=%s", os.Getenv("WEB_BASE_URI"), hash)
		fmt.Println(link)

		err = email.SendMail(link, account)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		err = db.Connection.Commit()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.JSON(response.Message(http.StatusCreated, "check your inbox"))
	}
}

func LoginWithMagicLink(db *database.Database) func(c *gin.Context) {
	type Login struct {
		MagicLoginLinkHash string `json:"magic_login_link_hash"`
	}

	return func(c *gin.Context) {
		if sessionId, err := c.Cookie("session_id"); err == nil {
			session := db.GetSessionById(sessionId)
			if session != nil {
				c.JSON(response.Message(http.StatusOK, "hi again"))
				return
			}
		}

		var l Login
		err := c.BindJSON(&l)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		link := db.GetMagicLoginLinkByLinkHash(l.MagicLoginLinkHash)
		if link == nil {
			c.JSON(response.Message(http.StatusBadRequest, "no magic link found by that hash"))
			return
		}

		if link.MagicLoginLinkUsedAt != nil {
			c.JSON(response.Message(http.StatusBadRequest, "magic link already used"))
			return
		}

		account, err := db.GetAccountById(link.MagicLoginLinkAccountId)
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		err = db.Connection.Begin()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		err = db.SetMagicLoginLinkUsedAt(l.MagicLoginLinkHash)
		if err != nil {
			db.Connection.Rollback()
			c.JSON(response.Error(err))
			return
		}

		sessionId := uuid.New().String()

		err = db.CreateSession(sessionId, account, link)
		if err != nil {
			db.Connection.Rollback()
			c.JSON(response.Error(err))
			return
		}

		err = db.Connection.Commit()
		if err != nil {
			c.JSON(response.Error(err))
			return
		}

		c.SetCookie("session_id", sessionId, 60*60*24*365, "/", os.Getenv("WEB_BASE_URI"), os.Getenv("ENVIRONMENT") == "PRODUCTION", true)
		c.JSON(response.Message(http.StatusCreated, fmt.Sprintf("hello account id: %d", account.AccountId)))
	}
}
