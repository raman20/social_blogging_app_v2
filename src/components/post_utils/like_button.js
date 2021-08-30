import axios from "axios";
import cookie from "react-cookies";
import React from "react";

export default class Like extends React.Component {
  handleLike = () => {
    if (cookie.load("userId")) {
      axios
        .post(`/like/${this.props.pid}`)
        .then((res) => {
          if (res.data === "success") {
            this.props.handleLikeCount();
          }
        });
    } else alert('Login first to Like the post !!!')
  };

  render() {
    return <button onClick={this.handleLike}>Like</button>;
  }
}
