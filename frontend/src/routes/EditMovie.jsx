import { Component } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Alert from "../components/Alert";
import Input from "../components/Input";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import "./EditMovie.css";

export class EditMovie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: {
        type: "d-none", // don't show at first (bootstrap class)
        message: "",
      },
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
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  componentDidMount() {
    if (!this.props.jwt) {
      this.props.history.push({
        pathname: "/login",
      });
      return;
    }
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

    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.jwt,
    });
    const payload = Object.fromEntries(new FormData(e.target));
    fetch(`http://localhost:4000/v1/admin/editmovie`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          this.setState({
            alert: {
              type: "alert-danger",
              message: data.error.message,
            },
          });
        } else {
          if (this.state.movie.id === 0) {
            this.setState({
              alert: {
                type: "alert-success",
                message: "created the movie",
              },
            });
          } else {
            this.setState({
              alert: {
                type: "alert-success",
                message: "changes saved!",
              },
            });
          }
          setTimeout(() => {
            this.props.history.push({
              pathname: "/admin",
            });
          }, 1500);
        }
      });
  }

  hasError(key) {
    return this.state.errors.includes(key);
  }

  confirmDelete(e) {
    e.preventDefault();
    const { id } = this.state.movie;
    const { jwt } = this.props;
    confirmAlert({
      title: "Delete Movie?",
      message: "Are you sure to delete this movie?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const headers = new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            });
            fetch("http://localhost:4000/v1/admin/deletemovie/" + id, {
              method: "GET",
              headers,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  this.setState({
                    alert: {
                      type: "alert-danger",
                      message: data.error.message,
                    },
                  });
                } else {
                  this.setState({
                    alert: {
                      type: "alert-success",
                      message: "movie deleted",
                    },
                  });
                  setTimeout(() => {
                    this.props.history.push({
                      pathname: "/admin",
                    });
                  }, 1500);
                }
              })
              .catch((error) => {
                this.setState({
                  alert: {
                    type: "alert-danger",
                    message: error,
                  },
                });
              });
          },
        },
        {
          label: "No",
          onClick: () => false,
        },
      ],
    });
  }

  render() {
    const { movie, isLoading, error, alert } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return (
        <>
          <h2>Add/Edit Movie</h2>
          <Alert type={alert.type} message={alert.message} />
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
              errorMsg="please choose a MPAA rating"
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
            <Link to="/admin" className="btn btn-warning ms-1">
              Cancel
            </Link>
            {movie.id > 0 && (
              <a onClick={this.confirmDelete} className="btn btn-danger ms-1">
                Delete
              </a>
            )}
          </form>
        </>
      );
    }
  }
}

export default EditMovie;
