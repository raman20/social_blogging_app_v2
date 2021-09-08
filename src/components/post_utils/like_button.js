import axios from "axios";
import cookie from "react-cookies";
import React from "react";

export default class Like extends React.Component {
  handleLike = () => {
    if (cookie.load("userId")) {
      document.body.style.cursor = "wait";
      axios.post(`/like/${this.props.pid}`).then((res) => {
        if (res.data === "success") {
          document.body.style.cursor = "";
          this.props.handleLikeCount();
        }
      });
    } else alert("Login first to Like the post !!!");
  };

  render() {
    return (
      <img
        src={this.props.likeBtn}
        onClick={this.handleLike}
        style={{
          cursor: "pointer",
        }}
        alt="like button"
      />
    );
  }
}
