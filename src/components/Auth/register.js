import { Link, navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      username: "",
      password: "",
      password2: ""
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.password2) {
      axios
        .post("/user/register", {
          name: this.state.fullName,
          username: this.state.username,
          password: this.state.password
        })
        .then((res) => {
          if (res.data === "user_exist") {
            alert("User already exists!!! \nTry again");
          } else {
            alert("registered successfully!!!");
            navigate('/login');
          }
        });
    } else alert("Password not matching!!!");
  };

  render() {
    return (
      <div className="auth">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.fullName}
            id="fullName"
            onChange={this.handleChange}
            placeholder="full name"
          />
          <input
            type="text"
            value={this.state.username}
            id="username"
            onChange={this.handleChange}
            placeholder="username"
          />
          <input
            type="password"
            value={this.state.password}
            id="password"
            onChange={this.handleChange}
            placeholder="password"
          />
          <input
            type="text"
            value={this.state.password2}
            id="password2"
            onChange={this.handleChange}
            placeholder="re-enter password"
          />
          <input type="submit" value='register' />
        </form>
        <Link to="/login">LogIn</Link>
      </div>
    );
  }

  componentDidMount() {
    if (cookie.load("userId")) navigate('/home');
  }
}
