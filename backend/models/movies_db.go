package models

import (
	"context"
	"database/sql"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

// Get returns one move and error, if any
func (m *DBModel) Get(id int) (*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
    SELECT id, title, description, year, release_date, rating, runtime,
           mpaa_rating, created_at, updated_at
    FROM movies
    WHERE id = $1
  `
	row := m.DB.QueryRowContext(ctx, query, id)
	var movie Movie
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.Year,
		&movie.ReleaseDate,
		&movie.Rating,
		&movie.Runtime,
		&movie.MPAARating,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	query = `
    SELECT mg.id, mg.movie_id, mg.genre_id, g.genre_name
    FROM movies_genres mg
    LEFT JOIN genres g
    ON (g.id = mg.genre_id)
    WHERE mg.movie_id = $1;
  `
	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []MovieGenre
	for rows.Next() {
		var mg MovieGenre
		err := rows.Scan(
			&mg.ID,
			&mg.MovieID,
			&mg.GenreID,
			&mg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, mg)
	}
	movie.MovieGenre = genres

	return &movie, nil
}

// All returns all movies and error, if any
func (m *DBModel) All() ([]*Movie, error) {
	return nil, nil
}
