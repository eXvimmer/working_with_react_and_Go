import React, { Component } from "react";

export class Movie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {},
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    fetch(`http://localhost:4000/v1/movie/${this.props.match.params.id}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`invalid response code: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        this.setState({
          movie: json.movie,
          isLoading: false,
          error: null,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          error: err,
        });
      });
  }

  render() {
    const { movie, isLoading, error } = this.state;

    if (movie.genres) {
      movie.genres = Object.values(movie.genres);
    } else {
      movie.genres = [];
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <>
          <h2>
            Movie: {movie.title} ({movie.year})
          </h2>
          <div className="float-start">
            <small>Rating: {movie.mpaa_rating}</small>
          </div>
          <div className="float-end">
            {movie.genres.map((g, i) => (
              <span className="badge bg-secondary me-1" key={i}>
                {g}
              </span>
            ))}
          </div>
          <div className="clearfix"></div>
          <hr />
          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              <tr>
                <td>
                  <strong>Title:</strong>
                </td>
                <td>
                  <strong>{movie.title}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Desciption:</strong>
                </td>
                <td>
                  <strong>{movie.description}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Runtime:</strong>
                </td>
                <td>
                  <strong>{movie.runtime} minutes</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
  }
}

export default Movie;
