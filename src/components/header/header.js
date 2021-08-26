import React from "react";
import Search from "./search";
import Nav from "./nav";
import cookie from 'react-cookies';

export default class Header extends React.Component {
  render() {
    if (cookie.load('userId')) {
      return (
        <header style={{ border: "1px solid black" }}>
          <h4>Social App</h4>
          <Search />
          <Nav setAuth={this.props.setAuth}/>
        </header>
      );
    }
    return null;
  }
}
