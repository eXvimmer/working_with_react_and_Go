import { Component } from "react";
import { Link } from "react-router-dom";

export default class Genres extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: [],
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    fetch("http://localhost:4000/v1/genres")
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`invalid response code: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        this.setState({
          genres: json.genres,
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
    const { genres, isLoading, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <>
          <h2>Genres</h2>

          <div className="list-group">
            {genres.map((g) => (
              <Link
                key={g.id}
                to={{
                  pathname: `/genre/${g.id}`,
                  genreName: g.genre_name,
                }}
                className="list-group-item list-group-item-action"
              >
                {g.genre_name}
              </Link>
            ))}
          </div>
        </>
      );
    }
  }
}
