import React from "react";
import postStyle from "../../component_style/post/post_style";
import Post from "./post";

export default class PostList extends React.Component {
  render() {
    let loadMoreButton = (
      <button
        style={{
          marginTop: "10px",
        }}
        onClick={this.loadMoreFeed}
      >
        load more
      </button>
    );

    if (this.props.postFeedData.length > 0) {
      let postList = this.props.postFeedData.map((item, index) => {
        return <Post key={index} postData={item} isMainPost={false} />;
      });
      return (
        <div style={postStyle.postList}>
          {postList}
          {this.props.loadMoreFeed ? loadMoreButton : null}
        </div>
      );
    } else
      return (
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <h3>No post available!</h3>
          <br />
          {this.props.isUserProfile ? (
            <h3>You haven't posted anything</h3>
          ) : (
            <h3>Please Follow some people</h3>
          )}
        </div>
      );
  }
}
