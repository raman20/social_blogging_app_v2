import React from "react";
import cookie from 'react-cookies';
import { redirectTo, Router } from '@reach/router';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import PasswordReset from './components/Auth/passwd_reset';
import Home from './components/home/home.js';
import MainPost from './components/post_utils/main_post';
import UserProfile from "./components/user_profile/user_profile";
import PostEdit from "./components/edits/post_edit";
import UserEdit from "./components/edits/user_edit";

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<AuthCheck path='/' />
				<Login path='/login' />
				<Register path='/register' />
				<PasswordReset path='/password-reset' />
				<Home path='/home' />
				<MainPost path='/p/:pid' />
				<UserProfile path='/u/:id' />
				<UserEdit path='/u/:id/edit' />
				<PostEdit path='/p/:pid/edit' />
			</Router>
		);
	}
}

class AuthCheck extends React.Component {
	render() {
		return null;
	}
	componentDidMount() {
		if (cookie.load('userId')) {
			redirectTo('/home');
		}

		else redirectTo('/login');
	}
}