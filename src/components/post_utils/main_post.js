import axios from "axios";
import React from "react";
import Post from "./post";

export default class MainPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {}
    };
  }

  fetchPostData = () => {
    axios
      .get(`/post/${this.props.pid}`)
      .then((res) => {
        this.setState({ postData: res.data });
      });
  };

  render() {
    if (this.state.postData === "not_found") {
      return <h1>Post Not Found!!!</h1>;
    }
    return <Post postData={this.state.postData} isMainPost={true} />;
  }

  componentDidMount() {
    this.fetchPostData();
  }
}
