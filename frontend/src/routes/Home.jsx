import { Component } from "react";
import ticketImage from "../images/movie_tickets.jpg";
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="text-center">
        <h2>Home</h2>
        <hr />
        <img src={ticketImage} alt="ticket" />
      </div>
    );
  }
}
