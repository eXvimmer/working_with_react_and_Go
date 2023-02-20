package main

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/exvimmer/working_with_react_and_go/backend/models"
	"github.com/julienschmidt/httprouter"
)

type MoviePayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ReleaseDate string `json:"release_date"`
	Runtime     string `json:"runtime"`
	Rating      string `json:"rating"`
	MPAARating  string `json:"mpaa_rating"`
	Year        string `json:"year"`
}

type jsonResp struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Print(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}
	movie, err := app.models.DB.Get(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, movie, "movie")
	if err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.All()
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, movies, "movies")
	if err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {
	// params := httprouter.ParamsFromContext(r.Context())
	// HACK: this is a workaround to make the code work; the instructor's
	// implementation is faulty
	params, ok := r.Context().Value(RouterParams("params")).(httprouter.Params)
	if !ok {
		app.errorJSON(w, errors.New(http.StatusText(http.StatusInternalServerError)), http.StatusInternalServerError)
		return
	}
	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	err = app.models.DB.DeleteMovie(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	res := jsonResp{
		OK:      true,
		Message: "deleted",
	}
	err = app.writeJSON(w, http.StatusOK, res, "response")
	if err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) editMovie(w http.ResponseWriter, r *http.Request) {
	var payload MoviePayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	id, err := strconv.Atoi(payload.ID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	runtime, err := strconv.Atoi(payload.Runtime)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	rating, err := strconv.Atoi(payload.Rating)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	releaseDate, err := time.Parse("2006-01-02", payload.ReleaseDate)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	year := releaseDate.Year()

	var movie models.Movie

	// TODO: this code is messy and duplicated, refactor it.
	if id != 0 { // this means we're updating an existing movie, not creating a new one
		m, err := app.models.DB.Get(id)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
		movie = *m
		movie.Title = payload.Title
		movie.Description = payload.Description
		movie.Runtime = runtime
		movie.Rating = rating
		movie.ReleaseDate = releaseDate
		movie.Year = year
		movie.MPAARating = payload.MPAARating
		movie.UpdatedAt = time.Now()
		if movie.Poster == "" {
			movie = getPoster(movie)
		}
		err = app.models.DB.UpdateMovie(&movie)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		movie.Title = payload.Title
		movie.Description = payload.Description
		movie.Runtime = runtime
		movie.Rating = rating
		movie.ReleaseDate = releaseDate
		movie.Year = year
		movie.MPAARating = payload.MPAARating
		movie.CreatedAt = time.Now()
		movie.UpdatedAt = time.Now()
		err = app.models.DB.InsertMovie(&movie)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	var message string

	if id == 0 {
		message = "created the new movie"
	} else {
		message = "changed saved!"
	}

	ok := jsonResp{
		OK:      true,
		Message: message,
	}
	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GenresAll()
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, genres, "genres")
	if err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) getAllMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	genreID, err := strconv.Atoi(params.ByName("genre_id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	movies, err := app.models.DB.All(genreID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, movies, "movies")
	if err != nil {
		app.errorJSON(w, err)
	}
}

func getPoster(movie models.Movie) models.Movie {
	type TheMovieDB struct {
		Page    int `json:"page"`
		Results []struct {
			Adult            bool    `json:"adult"`
			BackdropPath     string  `json:"backdrop_path"`
			GenreIds         []int   `json:"genre_ids"`
			ID               int     `json:"id"`
			OriginalLanguage string  `json:"original_language"`
			OriginalTitle    string  `json:"original_title"`
			Overview         string  `json:"overview"`
			Popularity       float64 `json:"popularity"`
			PosterPath       string  `json:"poster_path"`
			ReleaseDate      string  `json:"release_date"`
			Title            string  `json:"title"`
			Video            bool    `json:"video"`
			VoteAverage      float64 `json:"vote_average"`
			VoteCount        int     `json:"vote_count"`
		} `json:"results"`
		TotalPages   int `json:"total_pages"`
		TotalResults int `json:"total_results"`
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	apiKey := os.Getenv("TMDB_API_KEY")
	theUrl := "https://api.themoviedb.org/3/search/movie?api_key="
	query := "&query=" + url.QueryEscape(movie.Title)
	req, err := http.NewRequest("GET", theUrl+apiKey+query, nil)
	if err != nil {
		log.Println(err)
		return movie
	}
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return movie
	}
	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
		return movie
	}

	var responseObject TheMovieDB
	err = json.Unmarshal(bodyBytes, &responseObject)
	if err != nil {
		log.Println(err)
		return movie
	}
	if len(responseObject.Results) > 0 {
		movie.Poster = responseObject.Results[0].PosterPath
	}
	return movie
}
