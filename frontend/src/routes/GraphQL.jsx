import { Component } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";

// function debounce(fn, timeout = 300) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn.apply(this, args);
//     }, timeout);
//   };
// }

class GraphQL extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      searchTerm: "",
      // TODO: rmeove these states, if you're not using them
      isLoading: true,
      error: null,
      alert: {
        type: "d-none",
        message: "",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.performSearch = this.performSearch.bind(this);
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
    fetch("http://localhost:4000/graphql", {
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

  handleChange(e) {
    this.setState({
      searchTerm: e.target.value,
    });
  }

  performSearch(e) {
    e.preventDefault();

    const body = `
    {
      search(titleContains: "${this.state.searchTerm}") {
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
    fetch("http://localhost:4000/graphql", {
      method: "post",
      body,
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data.search.length) {
          this.setState({
            movies: data.data.search,
            isLoading: false,
            error: null,
          });
        } else {
          this.setState({
            movies: [],
            isLoading: false,
            erorr: null,
          });
        }
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
        <form onSubmit={this.performSearch}>
          <Input
            title="Search"
            type="search"
            name="search"
            value={this.state.searchTerm}
            handleChange={this.handleChange}
            placeholder="Enter the keyword and then press enter"
          />
          {/*<button type="submit" className="btn btn-primary">Search</button>*/}
        </form>
        <div className="list-group">
          {movies.map((m) => (
            <Link
              to={`/moviesgraphql/${m.id}`}
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
            </Link>
          ))}
        </div>
      </>
    );
  }
}

export default GraphQL;
