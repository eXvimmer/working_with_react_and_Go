import { Route, Switch, Link } from "react-router-dom";
import Home from "./routes/Home";
import Movies from "./routes/Movies";
import Admin from "./routes/Admin";
import CategoryPage from "./routes/CategoryPage";
import Categories from "./components/Categories";
import Movie from "./components/Movie";

function App() {
  return (
    <div className="container">
      <div className="row">
        <h1 className="mt-3">Go Watch a Movie!</h1>
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
                <Link to="/categories">Categories</Link>
              </li>
              <li className="list-group-item">
                <Link to="/admin">Admin</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-md-10">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/movies/:id" component={Movie} />
            <Route exact path="/movies">
              <Movies />
            </Route>
            <Route exact path="/categories">
              <CategoryPage />
            </Route>
            <Route
              exact
              path="/categories/drama"
              render={(props) => <Categories {...props} title="Drama" />}
            />
            <Route
              exact
              path="/categories/comedy"
              render={(props) => <Categories {...props} title="Comedy" />}
            />
            <Route exact path="/admin">
              <Admin />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
