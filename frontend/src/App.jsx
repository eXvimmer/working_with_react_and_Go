import { Route, Switch, Link } from "react-router-dom";

function Home() {
  return <h2>Home</h2>;
}

function Movies() {
  return <h2>Movies</h2>;
}

function Admin() {
  return <h2>Manage Catalogue</h2>;
}

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
                <Link to="/admin">Admin</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-md-10">
          <Switch>
            <Route exact path="/movies">
              <Movies />
            </Route>
            <Route exact path="/admin">
              <Admin />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
