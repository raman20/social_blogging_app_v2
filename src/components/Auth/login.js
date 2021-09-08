import { Link, navigate } from "@reach/router";
import axios from "axios";
import cookie from "react-cookies";
import React from "react";
import loginStyle from "../../component_style/auth/login_style";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    axios
      .post("/user/login", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        document.body.style.cursor = "";
        if (res.data === "success") {
          navigate("/home");
        } else if (res.data === "auth_error")
          alert("User not exist!!! \ncheck your username or password");
      });
  };

  render() {
    return (
      <div style={loginStyle.mainStyle}>
        <h1>
          <span style={{ color: "#ff4400" }}>Simply</span>
          <span style={{ backgroundColor: "#ff4400", color: "white" }}>
            Social
          </span>
        </h1>
        <h5>Login</h5>
        <form style={loginStyle.loginForm} onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.username}
            id="username"
            style={loginStyle.userID_password}
            onChange={this.handleChange}
            placeholder=" username"
          />
          <input
            type="password"
            value={this.state.password}
            id="password"
            style={loginStyle.userID_password}
            onChange={this.handleChange}
            placeholder=" password"
          />
          <input type="submit" value="login" style={loginStyle.submitBtn} />
        </form>
        <span style={loginStyle.register}>
          New user?{" "}
          <Link to="/register" style={loginStyle.registerLink}>
            Click here to register
          </Link>
        </span>
      </div>
    );
  }

  componentDidMount() {
    if (cookie.load("userId")) navigate("/home");
  }
}
