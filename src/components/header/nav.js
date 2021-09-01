import { Link, navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";

export default class Nav extends React.Component {
  render() {
    return cookie.load("userId") ? (
      <nav>
        <Link to="/home">Home</Link>
        <Link to={`/u/${cookie.load("userName")}`}>Profile</Link>
        <Logout />
      </nav>
    ) : null;
  }
}

class Logout extends React.Component {
  logout = () => {
    axios
      .get("/user/logout")
      .then((res) => {
        if (res.data === "success") {
          navigate("/login");
        }
      });
  };

  render() {
    return <button onClick={this.logout}>Logout</button>;
  }
}
