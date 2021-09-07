import { Link, navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";
import navStyle from "../../component_style/header/nav_style";

export default class Nav extends React.Component {
  render() {
    return cookie.load("userId") ? (
      <nav style={navStyle.all}>
        <Link to="/home">
          <img src="/home.png" title="home" alt="home button" />
        </Link>
        <Link to="/new_post">
          <img
            src="/plus.png"
            style={navStyle.logoutBtn_newPostBtn}
            title="new post"
            alt="new post button"
          />
        </Link>
        <Link to={`/u/${cookie.load("userName")}`}>
          <img
            src={cookie.load("userDp")}
            style={navStyle.profileBtn}
            title="profile"
            alt="profile button"
          />
        </Link>
        <Logout />
      </nav>
    ) : null;
  }
}

class Logout extends React.Component {
  logout = () => {
    axios.get("/user/logout").then((res) => {
      if (res.data === "success") {
        navigate("/login");
      }
    });
  };

  render() {
    return (
      <img
        src="/logout.png"
        title="logout"
        alt="logout button"
        onClick={this.logout}
        style={navStyle.logoutBtn_newPostBtn}
      />
    );
  }
}
