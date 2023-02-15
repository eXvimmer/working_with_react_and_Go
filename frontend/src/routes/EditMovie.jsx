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
    this.setState((prev) => {
      return {
        movie: {
          ...prev.movie,
          [e.target.name]: e.target.value,
        },
      };
    });
  }

  handleSubmit(e) {
    e.preventDefault();
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
            />
            <Input
              title="Release Date"
              name="release_date"
              value={movie.release_date}
              handleChange={this.handleChange}
              type="date"
            />
            <Input
              type="number"
              name="runtime"
              value={movie.runtime}
              handleChange={this.handleChange}
              title="Runtime"
            />
            <Select
              handleChange={this.handleChange}
              placeholder="Choose..."
              title="MPAA Rating"
              value={movie.mpaa_rating}
              name="mpaa_rating"
              required={true}
              options={this.state.mpaaOptions}
            />
            <Input
              title="Rating"
              name="rating"
              value={movie.rating}
              handleChange={this.handleChange}
              type="number"
            />
            <TextArea
              title="Description"
              name="description"
              value={movie.description}
              handleChange={this.handleChange}
              rows={3}
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
