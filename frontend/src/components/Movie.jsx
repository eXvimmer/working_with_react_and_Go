/* eslint-disable react/prop-types */
import React, { Component } from "react";

export class Movie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: {},
    };
  }

  componentDidMount() {
    this.setState({
      movie: {
        id: this.props.match.params.id,
        title: "some movie",
        runtime: 90,
      },
    });
  }

  render() {
    return (
      <>
        <h2>Movie: {this.state.movie.title}</h2>
        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <strong>Title:</strong>
              </td>
              <td>
                <strong>{this.state.movie.title}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Runtime:</strong>
              </td>
              <td>
                <strong>{this.state.movie.runtime} minutes</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}

export default Movie;
