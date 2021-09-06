import axios from "axios";
import React from "react";
import { navigate } from "@reach/router";
import postStyle from "../../component_style/post_utils/post";

export default class LikeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: [],
    };

    this.LikeListRef = React.createRef();
  }

  showLikeList = () => {
    this.LikeListRef.current.style.display = "";
  };

  closeLikeList = () => {
    this.LikeListRef.current.style.display = "none";
  };

  fetchLikes = () => {
    axios
      .get(`/like/${this.props.pid}`)
      .then((res) => this.setState({ likes: res.data }));
  };

  render() {
    return (
      <>
        <div
          style={{
            display: "none",
            opacity: 0.8,
            zIndex: 2,
            position: "absolute",
          }}
          ref={this.LikeListRef}
        >
          <div style={{ overflow: "scroll" }}>
            {this.state.likes.map((item, index) => {
              return <LikeListItem likeData={item} key={index} />;
            })}
          </div>
          <b style={{ color: "red" }} onClick={this.closeLikeList}>
            {" "}
            X{" "}
          </b>
        </div>
        <b onClick={this.showLikeList} style={postStyle.likeCount}>
          {this.props.likeCount} likes
        </b>
      </>
    );
  }
}

class LikeListItem extends React.Component {
  navigateUser = () => {
    navigate(`/u/${this.props.likeData.uname}`);
  };
  render() {
    return (
      <span onClick={this.navigateUser}>
        <img src={this.props.likeData.dp} alt="user" />{" "}
        <b>{this.props.likeData.uname}</b>
      </span>
    );
  }
}
