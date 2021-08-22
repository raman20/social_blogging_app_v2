import axios from "axios";
import React from "react";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: null,
            username: null,
            password: null,
            password2: null,
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = () => {
        if (this.state.password === this.state.password2) {
            axios.post('/user/register', {
                name: this.state.fullName,
                username: this.state.username,
                password: this.state.password
            }).then(res => {
                if (res.data === 'user_exist') {
                    //error
                }
                else {
                    //redirect to login
                }
            })
        }
        else alert('Password not matching!!!');
    }

    render() {
        return (
            <div className='login'>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' value={this.state.fullName} name='fullName' onChange={this.handleChange} />
                    <input type='text' value={this.state.username} name='username' onChange={this.handleChange} />
                    <input type='password' value={this.state.password} name='password' onChange={this.handleChange} />
                    <input type="text" value={this.state.password2} name='password2' onChange={this.handleChange} />
                    <input type='submit' />
                </form>
                <span>forgote password?</span>
                <span>register</span>
            </div>
        );
    }
}