import { Component } from "react";
import Alert from "../components/Alert";
import Input from "../components/Input";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null,
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hasError = this.hasError.bind(this);
  }

  handleChange(e) {
    const errors = [...this.state.errors];
    const index = errors.indexOf(e.target.name);
    if (index !== -1) {
      errors.splice(index, 1);
    }

    this.setState((prev) => ({
      ...prev,
      errors,
      [e.target.name]: e.target.value,
    }));
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.errors.length) {
      return false;
    }

    const { email, password } = this.state;
    const errors = [];
    if (!email) {
      errors.push("email");
    }
    if (!password || password.length < 8 || password.length > 40) {
      errors.push("password");
    }

    this.setState({ errors });

    if (errors.length) {
      return false; // don't submit
    }

    const payload = Object.fromEntries(new FormData(e.target).entries());
    fetch("http://localhost:4000/v1/signin", {
      method: "POST",
      body: JSON.stringify(payload),
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
          this.props.handleJWTChange(data.response);
          this.props.history.push({
            pathname: "/admin",
          });
        }
      })
      .catch((error) => {
        this.setState({
          error,
        });
      });
  }

  hasError(key) {
    return this.state.errors.includes(key);
  }

  render() {
    const { alert, email, password } = this.state;

    return (
      <>
        <h2>Login</h2>
        <hr />
        <Alert type={alert.type} message={alert.message} />

        <form className="pt-3" onSubmit={this.handleSubmit}>
          <Input
            type="email"
            name="email"
            title="Email"
            value={email}
            handleChange={this.handleChange}
            className={this.hasError("email") ? "is-invalid" : ""}
            errorDiv={this.hasError("email") ? "text-danger" : "d-none"}
            errorMsg={"please enter a valid email address"}
          />

          <Input
            type="password"
            name="password"
            title="Password"
            value={password}
            handleChange={this.handleChange}
            className={this.hasError("password") ? "is-invalid" : ""}
            errorDiv={this.hasError("password") ? "text-danger" : "d-none"}
            errorMsg={
              "please enter a password between 8 and 40 characters long"
            }
          />
          <hr />
          <button className="btn btn-primary">Login</button>
        </form>
      </>
    );
  }
}

export default Login;
