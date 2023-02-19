import { Component } from "react";

class GraphQL extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      // TODO: rmeove these states, if you're not using them
      isLoading: true,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      },
    };
  }

  componentDidMount() {
    const body = `
    {
      list {
        id
        title
        runtime
        year
        description
      }
    }
    `;
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    fetch("http://localhost:4000/graphql/list", {
      method: "post",
      body,
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          movies: data.data.list,
          isLoading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          error,
          isLoading: false,
        });
      });
  }

  render() {
    const { movies } = this.state;
    return (
      <>
        <h2>GraphQL</h2>
        <hr />
        <div className="list-group">
          {movies.map((m) => (
            <a
              href="#"
              key={m.id}
              className="list-group-item list-group-item-action"
            >
              <strong>{m.title}</strong>
              <br />
              <small>
                ({m.year}) - {m.runtime} minutes
              </small>
              <br />
              {m.description.slice(0, 100)}...
            </a>
          ))}
        </div>
      </>
    );
  }
}

export default GraphQL;
