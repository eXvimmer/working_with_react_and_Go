package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/exvimmer/working_with_react_and_go/backend/models"
	"github.com/graphql-go/graphql"
)

var movies []*models.Movie

// GraphQL schema definition
var fields = graphql.Fields{
	"movie": &graphql.Field{
		Type:        movieType,
		Description: "Get movie by id",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (any, error) {
			id, ok := p.Args["int"].(int)
			if ok {
				for _, m := range movies {
					if m.ID == id {
						return m, nil
					}
				}
			}
			return nil, nil
		},
	},
	"list": &graphql.Field{
		Type:        graphql.NewList(movieType),
		Description: "Get all movies",
		Resolve: func(p graphql.ResolveParams) (any, error) {
			return movies, nil
		},
	},
	"search": &graphql.Field{
		Type:        graphql.NewList(movieType),
		Description: "Search movies by title",
		Args: graphql.FieldConfigArgument{
			"titleContains": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (any, error) {
			var theList []*models.Movie
			search, ok := p.Args["titleContains"].(string)
			if ok {
				for _, m := range movies {
					if strings.Contains(m.Title, search) {
						theList = append(theList, m)
					}
				}
			}
			return theList, nil
		},
	},
}

var movieType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Movie",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.Int,
			},
			"title": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"year": &graphql.Field{
				Type: graphql.Int,
			},
			"release_date": &graphql.Field{
				Type: graphql.DateTime,
			},
			"runtime": &graphql.Field{
				Type: graphql.Int,
			},
			"rating": &graphql.Field{
				Type: graphql.Int,
			},
			"mpaa_rating": &graphql.Field{
				Type: graphql.String,
			},
			"created_at": &graphql.Field{
				Type: graphql.DateTime,
			},
			"updated_at": &graphql.Field{
				Type: graphql.DateTime,
			},
		},
	},
)

func (app *application) moviesGraphql(w http.ResponseWriter, r *http.Request) {
	var err error
	movies, err = app.models.DB.All() // set to the global movies variable
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	q, err := io.ReadAll(r.Body)
	query := string(q)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	rootQuery := graphql.ObjectConfig{
		Name:   "RootQuery",
		Fields: fields,
	}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		app.errorJSON(w, errors.New("failed to create schema"))
		return
	}
	params := graphql.Params{Schema: schema, RequestString: query}
	resp := graphql.Do(params)
	if len(resp.Errors) > 0 {
		app.errorJSON(w, fmt.Errorf("failed: %+v", resp.Errors))
		return
	}
	j, err := json.Marshal(resp)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
