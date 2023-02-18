import { Component } from "react";
import { Link } from "react-router-dom";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, // for the first render
      movies: [],
      error: null,
    };
  }

  componentDidMount() {
    if (!this.props.jwt) {
      this.props.history.push({
        pathname: "/login",
      });
      return;
    }

    fetch("http://localhost:4000/v1/movies")
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
    const { movies, isLoading, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <>
          <h2>Manage Catalogue</h2>
          <div className="list-group">
            {movies.map((m) => (
              <Link
                key={m.id}
                to={`/admin/movie/${m.id}`}
                className="list-group-item list-group-item-action"
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
