import React from "react";

export default class Nav extends React.Component {
    render() {
        return (
            <nav>
                <a href='/home'>Home</a>
                <a href='/profile'>Profile</a>
                <Logout />
            </nav>
        );
    }
}

class Logout extends React.Component {

    logout = () => {
        // api.logout()
    }

    render() {
        return (
            <button onClick={this.logout}>Logout</button>
        );
    }
}