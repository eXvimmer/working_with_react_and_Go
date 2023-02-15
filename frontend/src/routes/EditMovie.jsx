import { Component } from "react";
import "./EditMovie.css";

export class EditMovie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {},
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    // TODO: replace this placeholder data with real one
    this.setState({
      movie: {
        title: "The Dark Knight",
        mpaa_rating: "R",
      },
    });
  }

  render() {
    const { movie /*,isLoading, error*/ } = this.state;

    return (
      <>
        <h2>Add/Edit Movie</h2>
        <hr />
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={movie.title}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="release_date" className="form-label">
              Release Date
            </label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              className="form-control"
              value={movie.release_date}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="runtime" className="form-label">
              Runtime
            </label>
            <input
              type="number"
              id="runtime"
              name="runtime"
              className="form-control"
              value={movie.runtime}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mpaa_rating" className="form-label">
              MPAA Rating
            </label>
            <select
              id="mpaa_rating"
              name="mpaa_rating"
              value={movie.mpaa_rating}
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
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <input
              type="number"
              min="1"
              max="5"
              id="rating"
              name="rating"
              className="form-control"
              value={movie.rating}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
            >
              {movie.description}
            </textarea>
          </div>
          <hr />
          <button className="btn btn-primary">Save</button>
        </form>
      </>
    );
  }
}

export default EditMovie;
