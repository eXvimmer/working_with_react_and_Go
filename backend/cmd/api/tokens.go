package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/exvimmer/working_with_react_and_go/backend/models"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
)

// TODO: remove this
var validUser = models.User{
	ID:       1,
	Email:    "me@here.com",
	Password: "$2a$12$08WEEVxnciiQdj4cHFIBBOLiBDSPcWgGbIzFIFD36TpWN4jpJQHg.", // password is password
}

type Credentials struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

func (app *application) signin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		app.errorJSON(w, errors.New("unauthorized"))
		return
	}
	hashedPassword := validUser.Password // TODO: get this from db
	// TODO: check email too
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password))
	if err != nil {
		app.errorJSON(w, errors.New("unauthorized"))
		return
	}
	var claims jwt.Claims
	claims.Subject = fmt.Sprint(validUser.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "mydomain.com"              // TODO: use the right Issuer
	claims.Audiences = []string{"mydomain.com"} // TODO: use the right Audiences

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(app.config.jwt.secret))
	if err != nil {
		app.errorJSON(w, errors.New("error signin"))
		return
	}

	err = app.writeJSON(w, http.StatusOK, string(jwtBytes), "response")
	if err != nil {
		app.errorJSON(w, errors.New("error signin"))
	}
}
