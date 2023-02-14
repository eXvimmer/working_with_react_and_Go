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

          <ul>
            {genres.map((g) => (
              <li key={g.id}>
                <Link to={`/genre/${g.id}`}>{g.genre_name}</Link>
              </li>
            ))}
          </ul>
        </>
      );
    }
  }
}
