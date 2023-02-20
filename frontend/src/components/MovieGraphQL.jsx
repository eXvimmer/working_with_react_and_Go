import { Component } from "react";

class MovieGraphQL extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {},
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    const body = `
    {
      movie(id: ${this.props.match.params.id}) {
        id
        title
        runtime
        year
        description
        release_date
        rating
        mpaa_rating
        poster
      }
    }
    `;
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    fetch("http://localhost:4000/graphql", {
      method: "post",
      body,
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.movie) {
          this.setState({
            movie: data.data.movie,
            isLoading: false,
            error: null,
          });
        } else {
          throw new Error("movie not found");
        }
      })
      .catch((error) => {
        this.setState({
          movie: {},
          error,
          isLoading: false,
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
          {movie.poster && (
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                alt={movie.title}
              />
            </div>
          )}
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

export default MovieGraphQL;
