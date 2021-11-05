import { navigate } from "@reach/router";
import axios from "axios";
import cookie from "react-cookies";
import React from "react";
import Header from "../header/header";
import Post from "./post";

export default class MainPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {},
    };
  }

  fetchPostData = () => {
    axios.get(`/post/${this.props.pid}`).then((res) => {
      this.setState({ postData: res.data });
    });
  };

  render() {
    if (this.state.postData === "not_found") {
      return <h1>Post Not Found!!!</h1>;
    }
    return (
      <div className="main_post_page">
        <Header setAuth={this.props.setAuth} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "70px",
          }}
        >
          <Post postData={this.state.postData} isMainPost={true} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) {
      navigate("/login");
    } else {
      this.fetchPostData();
    }
  }
}
