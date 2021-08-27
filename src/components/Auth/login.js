import { Link, navigate } from "@reach/router";
import axios from "axios";
import cookie from "react-cookies";
import React from "react";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/user/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then((res) => {
        if (res.data === "success") {
          this.props.setAuth(1);
          navigate('/home');
        }
        else if (res.data === "auth_error")
          alert("User not exist!!! \ncheck your username or password");
      });
  };

  render() {
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.username}
            id="username"
            onChange={this.handleChange}
            placeholder=" username"
          />
          <input
            type="password"
            value={this.state.password}
            id="password"
            onChange={this.handleChange}
            placeholder=" password"
          />
          <input type="submit" value="login" />
        </form>
        <Link to="/register">register</Link>
      </div>
    );
  }

  componentDidMount() {
    if (cookie.load("userId")) navigate('/home');
  }
}
