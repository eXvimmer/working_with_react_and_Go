import React, { Component } from "react";
import PropTypes from "prop-types";

export class Categories extends Component {
  render() {
    return <h2>Category: {this.props.title}</h2>;
  }
}

Categories.propTypes = {
  title: PropTypes.string,
};

export default Categories;
