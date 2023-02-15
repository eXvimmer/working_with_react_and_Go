import { Component } from "react";
import Input from "../components/Input";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import "./EditMovie.css";

export class EditMovie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {
        id: 0,
        title: "",
        description: "",
        release_date: "",
        runtime: "",
        rating: "",
        mpaa_rating: "",
      },
      isLoading: true,
      error: null,
      errors: [], // form errors
      mpaaOptions: [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
      ],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hasError = this.hasError.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id > 0) {
      fetch(`http://localhost:4000/v1/movie/${id}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`invalid response code: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);
          this.setState({
            error: null,
            isLoading: false,
            movie: {
              ...json.movie,
              release_date: releaseDate.toISOString().split("T")[0],
            },
          });
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error,
          });
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  handleChange(e) {
    const errors = [...this.state.errors];
    const index = errors.indexOf(e.target.name);
    if (index !== -1) {
      errors.splice(index, 1);
    }
    this.setState((prev) => {
      return {
        errors,
        movie: {
          ...prev.movie,
          [e.target.name]: e.target.value,
        },
      };
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.errors.length) {
      return false;
    }

    const { title, description, release_date, runtime, rating, mpaa_rating } =
      this.state.movie;
    const errors = [];
    if (!title) {
      errors.push("title");
    }
    if (!description) {
      errors.push("description");
    }
    if (!release_date) {
      errors.push("release_date");
    }
    if (!runtime || +runtime < 0) {
      errors.push("runtime");
    }
    if (!rating || +rating < 1 || +rating > 5) {
      errors.push("rating");
    }
    if (!mpaa_rating) {
      errors.push("mpaa_rating");
    }

    this.setState({ errors });

    if (errors.length) {
      return false; // don't submit
    }

    const payload = Object.fromEntries(new FormData(e.target));
    fetch(`http://localhost:4000/v1/admin/editmovie`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  hasError(key) {
    return this.state.errors.includes(key);
  }

  render() {
    const { movie, isLoading, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <>
          <h2>Add/Edit Movie</h2>
          <hr />
          <form onSubmit={this.handleSubmit}>
            <input type="hidden" name="id" value={movie.id} id="id" />
            <Input
              title="Title"
              name="title"
              value={movie.title}
              handleChange={this.handleChange}
              className={this.hasError("title") ? "is-invalid" : ""}
              errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
              errorMsg="please enter a title"
            />
            <Input
              title="Release Date"
              name="release_date"
              value={movie.release_date}
              handleChange={this.handleChange}
              type="date"
              className={this.hasError("release_date") ? "is-invalid" : ""}
              errorDiv={
                this.hasError("release_date") ? "text-danger" : "d-none"
              }
              errorMsg="please enter a release date"
            />
            <Input
              type="number"
              name="runtime"
              value={movie.runtime}
              handleChange={this.handleChange}
              title="Runtime"
              className={this.hasError("runtime") ? "is-invalid" : ""}
              errorDiv={this.hasError("runtime") ? "text-danger" : "d-none"}
              errorMsg="please enter a runtime greater than zero"
            />
            <Select
              handleChange={this.handleChange}
              placeholder="Choose..."
              title="MPAA Rating"
              value={movie.mpaa_rating}
              name="mpaa_rating"
              options={this.state.mpaaOptions}
              className={this.hasError("mpaa_rating") ? "is-invalid" : ""}
              errorDiv={this.hasError("mpaa_rating") ? "text-danger" : "d-none"}
              errorMsg="please choose a mpaa_rating"
            />
            <Input
              title="Rating"
              name="rating"
              value={movie.rating}
              handleChange={this.handleChange}
              type="number"
              className={this.hasError("rating") ? "is-invalid" : ""}
              errorDiv={this.hasError("rating") ? "text-danger" : "d-none"}
              errorMsg="please enter a rating between 1 and 5 (exclusive)"
            />
            <TextArea
              title="Description"
              name="description"
              value={movie.description}
              handleChange={this.handleChange}
              rows={3}
              className={this.hasError("description") ? "is-invalid" : ""}
              errorDiv={this.hasError("description") ? "text-danger" : "d-none"}
              errorMsg="please enter a description"
            />
            <hr />
            <button className="btn btn-primary">Save</button>
          </form>
        </>
      );
    }
  }
}

export default EditMovie;
