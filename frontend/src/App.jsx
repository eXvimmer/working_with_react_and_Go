import { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Home from "./routes/Home";
import Movies from "./routes/Movies";
import Admin from "./routes/Admin";
import Genres from "./routes/Genres";
import EditMovie from "./routes/EditMovie";
import Movie from "./components/Movie";
import Genre from "./components/Genre";
import Login from "./routes/Login";
import GraphQL from "./routes/GraphQL";
import MovieGraphQL from "./components/MovieGraphQL";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: "",
    };

    this.handleJWTChange = this.handleJWTChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    if (!this.state.jwt) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        this.setState({ jwt });
      }
    }
  }

  handleJWTChange(jwt) {
    this.setState({ jwt });
    localStorage.setItem("jwt", jwt);
  }

  logout() {
    this.setState({
      jwt: "",
    });
    localStorage.removeItem("jwt");
  }

  render() {
    let loginLink;
    if (!this.state.jwt) {
      loginLink = <Link to="/login">Login</Link>;
    } else {
      loginLink = (
        <Link to="/logout" onClick={this.logout}>
          Logout
        </Link>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">Go Watch a Movie!</h1>
          </div>
          <div className="col mt-3 text-end">{loginLink}</div>
          <hr className="mb-3" />
        </div>

        <div className="row">
          <div className="col-md-2">
            <nav>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/movies">Movies</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/genres">Genres</Link>
                </li>
                {this.state.jwt && (
                  <>
                    <li className="list-group-item">
                      <Link to="/admin/movie/0">Add movie</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/admin">Admin</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/graphql">GraphQL</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>

          <div className="col-md-10">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route
                exact
                path="/login"
                component={(props) => (
                  <Login {...props} handleJWTChange={this.handleJWTChange} />
                )}
              />
              <Route exact path="/movies/:id" component={Movie} />
              <Route exact path="/moviesgraphql/:id" component={MovieGraphQL} />
              <Route exact path="/movies">
                <Movies />
              </Route>
              <Route exact path="/genres">
                <Genres />
              </Route>
              <Route exact path="/genre/:id" component={Genre} />
              <Route
                exact
                path="/admin/movie/:id"
                component={(props) => (
                  <EditMovie {...props} jwt={this.state.jwt} />
                )}
              />
              <Route
                exact
                path="/admin"
                component={(props) => <Admin {...props} jwt={this.state.jwt} />}
              />
              <Route exact path="/graphql" component={GraphQL} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
