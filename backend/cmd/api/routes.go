package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	r := httprouter.New()

	r.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	r.HandlerFunc(http.MethodGet, "/v1/movie/:id", app.getOneMovie)
	r.HandlerFunc(http.MethodGet, "/v1/movies", app.getAllMovies)
	r.HandlerFunc(http.MethodGet, "/v1/movies/:genre_id", app.getAllMoviesByGenre)
	r.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres)
	r.HandlerFunc(http.MethodPost, "/v1/admin/editmovie", app.editMovie)
	r.HandlerFunc(http.MethodGet, "/v1/admin/deletemovie/:id", app.deleteMovie)

	return app.enableCORS(r)
}
