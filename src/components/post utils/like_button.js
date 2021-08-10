import React from "react";

export default class Like extends React.Component {
    handleLike = () => {
        //api.like(this.props.pid)
        //this.setLikeCount();
    }

    render() {
        return (
            <button onClick={this.handleLike}>Like</button>
        );
    }
}