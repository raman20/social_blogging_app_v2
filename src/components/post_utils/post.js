import React from "react";
import Like from "./like_button";
import LikeList from "./like_list";
import CommentSection from "./comment_section";
import cookie from "react-cookies";
import { navigate } from "@reach/router";
import postStyle from "../../component_style/post_utils/post";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likeCount: 0,
      commentCount: 0,
      likeFlag: false,
      likeBtn: "/like_0.png",
    };
  }

  handleLikeCount = () => {
    if (this.state.likeFlag) {
      this.setState((prevState) => {
        return {
          likeCount: prevState.likeCount - 1,
          likeFlag: !prevState.likeFlag,
          likeBtn: "/like_0.png",
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          likeCount: prevState.likeCount + 1,
          likeFlag: !prevState.likeFlag,
          likeBtn: "/like_1.png",
        };
      });
    }
  };

  setCommentCount = () => {
    this.setState((prevState) => {
      return { commentCount: prevState.commentCount + 1 };
    });
  };

  navigatePost = () => {
    navigate(`${document.location.origin}/p/${this.props.postData.pid}`);
  };

  render() {
    return (
      <div style={postStyle.all}>
        <PostHeader
          userData={{
            dp: this.props.postData.dp,
            uname: this.props.postData.uname,
            id: this.props.postData.id,
          }}
          pid={this.props.postData.pid}
        />
        <PostBody
          media_url={this.props.postData.media_url}
          content={this.props.postData.content}
        />
        <div style={postStyle.postButtons}>
          <div style={postStyle.likeSection}>
            <Like
              handleLikeCount={this.handleLikeCount}
              pid={this.props.postData.pid}
              likeBtn={this.state.likeBtn}
            />
            <LikeList
              likeCount={this.state.likeCount}
              pid={this.props.postData.pid}
            />
          </div>
          <div>
            <b onClick={this.navigatePost} style={postStyle.commentCount}>
              View all {this.state.commentCount} comments
            </b>
          </div>
        </div>
        <CommentSection
          commentCount={this.state.commentCount}
          pid={this.props.postData.pid}
          setCommentCount={this.setCommentCount}
          isMainPost={this.props.isMainPost}
        />
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.postData.likecount !== this.props.postData.likecount ||
      prevProps.postData.commentcount !== this.props.postData.commentcount ||
      prevProps.postData.likeflag !== this.props.postData.likeflag
    ) {
      this.setState({
        likeCount: this.props.postData.likecount,
        commentCount: this.props.postData.commentcount,
        likeFlag: this.props.postData.likeflag ? true : false,
        likeBtn: this.props.postData.likeflag ? "/like_1.png" : "/like_0.png",
      });
    }
  }

  componentDidMount() {
    this.setState({
      likeCount: this.props.postData.likecount,
      commentCount: this.props.postData.commentcount,
      likeFlag: this.props.postData.likeflag ? true : false,
      likeBtn: this.props.postData.likeflag ? "/like_1.png" : "/like_0.png",
    });
  }
}

class PostHeader extends React.Component {
  navigateUser = () => {
    navigate(`${document.location.origin}/u/${this.props.userData.id}`);
  };
  render() {
    return (
      <div style={postStyle.postHeader}>
        <div style={postStyle.postHeaderMeta}>
          <img
            src={this.props.userData.dp}
            alt="user"
            style={postStyle.postHeaderImg}
            onClick={this.navigateUser}
          />
          <h4 onClick={this.navigateUser} style={postStyle.postHeaderUname}>
            {this.props.userData.uname}
          </h4>
        </div>
        <PostOptions userId={this.props.userData.id} pid={this.props.pid} />
      </div>
    );
  }
}

class PostBody extends React.Component {
  render() {
    return (
      <div>
        {this.props.media_url ? (
          <img
            src={this.props.media_url}
            alt="post"
            style={postStyle.postBodyImg}
          />
        ) : null}
        <p style={postStyle.postBodyText}>{this.props.content}</p>
      </div>
    );
  }
}

class PostOptions extends React.Component {
  postEdit = () => {
    navigate(`/p/${this.props.pid}/edit`);
  };

  render() {
    let options =
      cookie.load("userId") == this.props.userId ? (
        <button onClick={this.postEdit}>Edit</button>
      ) : null;
    return <div>{options}</div>;
  }
}
