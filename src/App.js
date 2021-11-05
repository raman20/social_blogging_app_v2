import React from "react";
import cookie from "react-cookies";
import { navigate, Router } from "@reach/router";
import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import Home from "./components/home/home.js";
import MainPost from "./components/post_utils/main_post";
import UserProfile from "./components/user_profile/user_profile";
import PostEdit from "./components/edits/post_edit";
import UserEdit from "./components/edits/user_edit";
import NewPost from "./components/new_post/new_post";
import Nav from "./components/header/nav";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: 0,
        };
        this.context = React.createContext();
    }

    setAuth = (val) => this.setState({ auth: val });

    render() {
        return (
            <div className="app">
                <Router>
                    <Login setAuth={this.setAuth} path="/login" />
                    <Register path="/register" />
                    <Home setAuth={this.setAuth} path="/home" />
                    <MainPost setAuth={this.setAuth} path="/p/:pid" />
                    <UserProfile setAuth={this.setAuth} path="/u/:uname" />
                    <UserEdit setAuth={this.setAuth} path="/u/:id/edit" />
                    <PostEdit setAuth={this.setAuth} path="/p/:pid/edit" />
                    <NewPost setAuth={this.setAuth} path="/new_post" />
                </Router>
                {window.screen.width <= 600 ? (
                    <Nav auth={this.state.auth} setAuth={this.setAuth} />
                ) : null}
            </div>
        );
    }

    componentDidMount() {
        if (cookie.load("userId")) {
            if (document.location.pathname === "/") {
                navigate("/home");
            } else {
                navigate(`${document.location}`);
            }
        } else {
            navigate("/login");
        }
    }
}
