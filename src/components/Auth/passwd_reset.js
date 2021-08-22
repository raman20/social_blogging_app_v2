import React from "react";
import axios from "axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: null,
            password2: null
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.password === this.state.password2) {
            axios.post('/password_rest', {
                password: this.state.password
            }).then(res => {
                //redirect to login
            })
        }
        else alert('Password not matching!!!');
    }

    render() {
        return (
            <div className='login'>
                <form onSubmit={this.handleSubmit}>
                    <input type='password' value={this.state.password} name='password' onChange={this.handleChange} />
                    <input type='password2' value={this.state.password2} name='password2' onChange={this.handleChange} />
                    <input type='submit' />
                </form>
                <span>login</span>
                <span>register</span>
            </div>
        );
    }
}