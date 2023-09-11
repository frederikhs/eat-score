package controllers

import (
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"os"
)

func Logout() func(c *gin.Context) {
	return func(c *gin.Context) {
		c.SetCookie("session_id", "", -1, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{
			"message": "you are now logged out",
		})
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
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		account, err := db.GetAccountByEmail(lr.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		if account == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "account does not exist",
			})
			return
		}

		db.Connection.Begin()

		hash := uuid.New().String()
		err = db.CreateMagicLoginLink(account, hash)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		link := fmt.Sprintf("%s/magic-login?magic_login_link_hash=%s", os.Getenv("WEB_BASE_URI"), hash)
		fmt.Println(link)

		//err = email.SendMail(db, link, account)
		//if err != nil {
		//	c.JSON(http.StatusInternalServerError, gin.H{
		//		"message": fmt.Sprintf("something bad happened: %v", err),
		//	})
		//	return
		//}

		db.Connection.Commit()

		c.JSON(http.StatusOK, gin.H{
			"message": "check your inbox",
		})
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
				c.JSON(http.StatusOK, gin.H{
					"message": "welcome",
				})

				return
			}
		}

		var l Login
		err := c.BindJSON(&l)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "something bad happened",
			})
			return
		}

		link := db.GetMagicLoginLinkByLinkHash(l.MagicLoginLinkHash)
		if link == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "no magic link found by that hash",
			})

			return
		}

		if link.MagicLoginLinkUsedAt != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "magic link already used",
			})

			return
		}

		account, err := db.GetAccountById(link.MagicLoginLinkAccountId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		db.Connection.Begin()

		err = db.SetMagicLoginLinkUsedAt(l.MagicLoginLinkHash)
		if err != nil {
			db.Connection.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		sessionId := uuid.New().String()

		err = db.CreateSession(sessionId, account, link)
		if err != nil {
			db.Connection.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		db.Connection.Commit()

		c.SetCookie("session_id", sessionId, 60*60*24*365, "/", "localhost", false, true)

		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("hello account id: %d", account.AccountId),
		})
	}
}
