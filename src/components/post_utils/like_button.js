import axios from "axios";
import cookie from 'react-cookies';
import React from "react";
import { redirectTo } from "@reach/router";

export default class Like extends React.Component {

    handleLike = () => {
        if (cookie.load('userId')) {
            axios.post(`http://localhost:3001/like/${this.props.pid}`)
                .then(res => {
                    if (res.data === 'success') {
                        this.props.handleLikeCount();
                    }
                })
        }

        else redirectTo('http://localhost:3001/login');
    }

    render() {
        return (
            <button onClick={this.handleLike}>Like</button>
        );
    }
}