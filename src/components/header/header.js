import React from "react";
import Search from "./search";
import Nav from "./nav";

export default class Header extends React.Component {
    render() {
        return (
            <header style={{ border: "1px solid black" }}>
                <h4>Social App</h4>
                <Search />
                <Nav />
            </header>
        );
    }
}