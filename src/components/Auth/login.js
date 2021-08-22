import axios from "axios";
import React from "react";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/user/login', {
            username: this.state.username,
            password: this.state.password
        }).then(res => {
            if (res.data === 'success') {
                //redirect to home
            }
            else if (res.data === 'auth_error') alert('User not exist!!! \ncheck your username or password');
        })
    }

    render() {
        return (
            <div className='login'>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' value={this.state.username} id='username' onChange={this.handleChange} />
                    <input type='password' value={this.state.password} id='password' onChange={this.handleChange} />
                    <input type='submit' />
                </form>
                <span>forgote password?</span>
                <span>register</span>
            </div>
        );
    }
}