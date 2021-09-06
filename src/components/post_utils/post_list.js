import React from "react";
import postStyle from "../../component_style/post_utils/post";
import Post from "./post";

export default class PostList extends React.Component {
  render() {
    if (this.props.postFeedData.length > 0) {
      let postList = this.props.postFeedData.map((item, index) => {
        return <Post key={index} postData={item} isMainPost={false} />;
      });
      return <div style={postStyle.postList}>{postList}</div>;
    } else
      return (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h3>No post available!</h3>
          <br />
          <h3>Follow some people</h3>
        </div>
      );
  }
}
