package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() *httprouter.Router {
	r := httprouter.New()

	r.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	r.HandlerFunc(http.MethodGet, "/v1/movie/:id", app.getOneMovie)
	r.HandlerFunc(http.MethodGet, "/v1/movies", app.getAllMovies)

	return r
}
