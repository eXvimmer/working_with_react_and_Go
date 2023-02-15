import { Component } from "react";
import Input from "../components/Input";
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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {}

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
    const { movie /*,isLoading, error*/ } = this.state;

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
          <div className="mb-3">
            <label htmlFor="mpaa_rating" className="form-label">
              MPAA Rating
            </label>
            <select
              id="mpaa_rating"
              name="mpaa_rating"
              value={movie.mpaa_rating}
              onChange={this.handleChange}
              className="form-select"
              required
            >
              <option className="form-select">Choose...</option>
              <option className="form-select" value="G">
                G
              </option>
              <option className="form-select" value="PG">
                PG
              </option>
              <option className="form-select" value="PG13">
                PG13
              </option>
              <option className="form-select" value="R">
                R
              </option>
              <option className="form-select" value="NC17">
                NC17
              </option>
            </select>
          </div>
          <Input
            title="Rating"
            name="rating"
            value={movie.rating}
            handleChange={this.handleChange}
            type="number"
          />
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={movie.description}
              onChange={this.handleChange}
            />
          </div>
          <hr />
          <button className="btn btn-primary">Save</button>
        </form>
        <div className="mb-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div>
      </>
    );
  }
}

export default EditMovie;
