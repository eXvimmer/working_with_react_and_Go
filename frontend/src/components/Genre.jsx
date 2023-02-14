import { Component } from "react";
import { Link } from "react-router-dom";

class Genre extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      isLoading: true,
      error: null,
      genreName: "",
    };
  }

  componentDidMount() {
    fetch(`http://localhost:4000/v1/movies/${this.props.match.params.id}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`invalid response code: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        this.setState({
          movies: json.movies,
          isLoading: false,
          error: null,
          genreName: this.props.location.genreName,
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
    let { movies, isLoading, error, genreName } = this.state;
    if (!movies || !movies.length) {
      movies = [];
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <>
          <h2>Genre: {genreName}</h2>
          <div className="list-group">
            {movies.map((m) => (
              <Link
                key={m.id}
                className="list-group-item list-group-item-action"
                to={`/movies/${m.id}`}
              >
                {m.title}
              </Link>
            ))}
          </div>
        </>
      );
    }
  }
}

export default Genre;
