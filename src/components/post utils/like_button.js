import axios from "axios";
import React from "react";

export default class Like extends React.Component {

    handleLike = () => {

        axios.post(`/like/${this.props.pid}`)
            .then(res => {
                if (res.data === 'success') {
                    this.props.handleLikeCount();
                }
            })
    }

    render() {
        return (
            <button onClick={this.handleLike}>Like</button>
        );
    }
}