package main

import (
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"github.com/frederikhs/eat-score/email"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"log"
	"net/http"
)

type LoginRequest struct {
	Email string `json:"email"`
}

type Login struct {
	MagicLoginLinkHash string `json:"magic_login_link_hash"`
}

func main() {
	err := godotenv.Load(".env.development")
	if err != nil {
		panic(err)
	}

	db := database.Connect()

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	r.GET("/items", func(c *gin.Context) {
		items, err := db.GetItems()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		c.JSON(http.StatusOK, items)
	})

	r.GET("/me", func(c *gin.Context) {
		sessionId, err := c.Cookie("session_id")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "i dont know who you are",
			})

			return
		}

		session := db.GetSessionById(sessionId)
		if session == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "i dont know who you are",
			})

			return
		}

		account, err := db.GetAccountById(session.SessionAccountId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		c.JSON(http.StatusOK, account)
	})

	r.POST("/logout", func(c *gin.Context) {
		c.SetCookie("session_id", "", -1, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{
			"message": "you are now logged out",
		})
	})

	r.POST("/login/request", func(c *gin.Context) {
		var lr LoginRequest
		err = c.BindJSON(&lr)
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

		err = email.SendMail(db, account)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": fmt.Sprintf("something bad happened: %v", err),
			})
			return
		}

		db.Connection.Commit()

		c.JSON(http.StatusOK, gin.H{
			"message": "check your inbox",
		})
	})

	r.POST("/login", func(c *gin.Context) {
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
		err = c.BindJSON(&l)
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
	})

	log.Fatal(r.Run(":8080"))
}
