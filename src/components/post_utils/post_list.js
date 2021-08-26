import React from "react";
import Post from "./post";

export default class PostList extends React.Component {
  render() {
    if (this.props.postFeedData.posts) {
      let postList = this.props.postFeedData.map((item, index) => {
        return <Post key={index} postData={item} isMainPost={false} />;
      });
      return <div>{postList}</div>;
    }
    return null;
  }
}
