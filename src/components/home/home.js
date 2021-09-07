import { navigate } from "@reach/router";
import cookie from "react-cookies";
import axios from "axios";
import React from "react";
import PostList from "../post_utils/post_list";
import Header from "../header/header";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postFeed: [],
      postFeedOffset: 0,
      loadingIndicator: 1,
    };
  }

  fetchFeed = () => {
    axios.get(`/feed/${this.state.postFeedOffset}`).then((res) => {
      if (res.data.length > 0) {
        this.setState((prevState, prevProps) => {
          return {
            postFeed: prevState.postFeed.concat(res.data),
            loadingIndicator: 0,
          };
        });
      } else {
        this.setState({ loadingIndicator: 0 });
      }
    });
  };

  loadMoreFeed = () => {
    this.setState((prevState) => {
      return { postFeedOffset: prevState.postFeedOffset + 10 };
    });
    this.fetchFeed();
  };

  render() {
    return (
      <div className="home">
        <Header />
        {this.state.loadingIndicator ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <img src="/loading.gif" alt="loading indicator" />
          </div>
        ) : (
          <>
            <PostList postFeedData={this.state.postFeed} />
            {this.postFeed.length > 0 ? (
              <button onClick={this.loadMoreFeed}>load more</button>
            ) : null}
          </>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (cookie.load("userId")) this.fetchFeed();
    else navigate(`${document.location.origin}/login`);
  }
}
