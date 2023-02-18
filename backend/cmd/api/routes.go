package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

type RouterParams string // to avoid name collisions

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		ctx := context.WithValue(r.Context(), RouterParams("params"), p)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (app *application) routes() http.Handler {
	r := httprouter.New()
	secure := alice.New(app.checkToken)

	r.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	r.HandlerFunc(http.MethodPost, "/v1/signin", app.signin)
	r.HandlerFunc(http.MethodGet, "/v1/movie/:id", app.getOneMovie)
	r.HandlerFunc(http.MethodGet, "/v1/movies", app.getAllMovies)
	r.HandlerFunc(http.MethodGet, "/v1/movies/:genre_id", app.getAllMoviesByGenre)
	r.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres)
	r.POST("/v1/admin/editmovie", app.wrap(secure.ThenFunc(app.editMovie)))
	r.GET("/v1/admin/deletemovie/:id", app.wrap(secure.ThenFunc(app.deleteMovie)))

	return app.enableCORS(r)
}
