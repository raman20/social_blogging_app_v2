import { Link, redirectTo } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from 'react-cookies';

export default class Nav extends React.Component {
    render() {
        return cookie.load('userId') ? (
            <nav>
                <Link to='home'>Home</Link>
                <Link to={`u/${cookie.load('userId')}`} >Profile</Link>
                <Logout />
            </nav>
        ) : null;
    }
}

class Logout extends React.Component {

    logout = () => {
        axios.get('http://localhost:3001/user/logout').then(res => {
            if (res.data === 'success') redirectTo('/login');
        })
    }

    render() {
        return (
            <button onClick={this.logout}>Logout</button>
        );
    }
}