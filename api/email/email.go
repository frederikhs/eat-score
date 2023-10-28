package email

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/frederikhs/eat-score/database"
	"html/template"
	"io"
	"net/http"
	"os"
)

type Send struct {
	ApiKey        string   `json:"api_key"`
	To            []string `json:"to"`
	Sender        string   `json:"sender"`
	Subject       string   `json:"subject"`
	TextBody      string   `json:"text_body"`
	HtmlBody      string   `json:"html_body"`
	CustomHeaders []struct {
		Header string `json:"header"`
		Value  string `json:"value"`
	} `json:"custom_headers"`
	Attachments []struct {
		Filename string `json:"filename"`
		Fileblob string `json:"fileblob"`
		Mimetype string `json:"mimetype"`
	} `json:"attachments"`
}

func GenerateEmail(name string, link string) string {
	var tmplFile = "templates/magic-login-link.html.tpl"
	tmpl, err := template.New("magic-login-link.html.tpl").ParseFiles(tmplFile)
	if err != nil {
		panic(err)
	}

	var out bytes.Buffer
	err = tmpl.Execute(&out, struct {
		Name      string
		MagicLink string
	}{
		Name:      name,
		MagicLink: link,
	})
	if err != nil {
		panic(err)
	}

	return out.String()
}

func SendMail(link string, account *database.Account) error {
	htmlEmail := GenerateEmail(account.AccountName, link)

	url := "https://api.smtp2go.com/v3/email/send"

	email := Send{
		ApiKey:   os.Getenv("SMTP2GO_API_KEY"),
		To:       []string{fmt.Sprintf("%s <%s>", account.AccountName, account.AccountEmail)},
		Sender:   "Eat Score <robot@hrgn.dk>",
		Subject:  "Magic login link",
		HtmlBody: htmlEmail,
	}

	payload, err := json.Marshal(email)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(payload))
	if err != nil {
		return err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return errors.New(string(body))
	}

	return nil
}
