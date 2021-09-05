import React from "react";
import Search from "./search";
import Nav from "./nav";
import headerStyle from "../../component_style/header/header";

export default class Header extends React.Component {
  render() {
    return (
      <header style={headerStyle}>
        <h3>
          <span style={{ color: "#ff4400" }}>Simply</span>
          <span style={{ backgroundColor: "#ff4400", color: "white" }}>
            Social
          </span>
        </h3>
        <Search />
        <Nav />
      </header>
    );
  }
}
