import { Link, navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";
import navStyle from "../../component_style/header/nav_style";

export default class Nav extends React.Component {
    render() {
        return getNavBar.call(this);
    }
}

class Logout extends React.Component {
    logout = () => {
        axios.get("/user/logout").then((res) => {
            if (res.data === "success") {
                this.props.setAuth(0);
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

function getNavBar() {
    let links = (
        <>
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
            <Logout setAuth={this.props.setAuth}/>
        </>
    );
    if (window.screen.width <= 600) {
        return <nav style={navStyle.mobile}>{links}</nav>;
    } else {
        return <nav style={navStyle.all}>{links}</nav>;
    }
};
