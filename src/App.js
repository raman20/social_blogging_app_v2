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

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: 0
		}
	}

	setAuth = (val) => this.setState({ auth: val })

	render() {
		return (
			<div className='app'>
				<Router>
					<Login path="/login" />
					<Register path="/register" />
					<Home path="/home" />
					<MainPost path="/p/:pid" />
					<UserProfile path="/u/:uname" />
					<UserEdit path="/u/:id/edit" />
					<PostEdit path="/p/:pid/edit" />
				</Router>
			</div>
		);
	}

	componentDidMount() {
		if (cookie.load("userId")) {
			if (document.location.pathname === '/') {
				navigate('/home');
			} else {
				navigate(`${document.location}`);
			}
		} else {
			navigate('/login');
		}

	}
}

