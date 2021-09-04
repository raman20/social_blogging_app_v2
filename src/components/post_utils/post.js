import React from "react";
import Like from "./like_button";
import LikeList from "./like_list";
import CommentSection from "./comment_section";
import cookie from "react-cookies";
import { navigate } from "@reach/router";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likeCount: 0,
      commentCount: 0,
      likeFlag: false
    };
  }

  handleLikeCount = () => {
    if (this.state.likeFlag) {
      this.setState((prevState) => {
        return {
          likeCount: prevState.likeCount - 1,
          likeFlag: !prevState.likeFlag
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          likeCount: prevState.likeCount + 1,
          likeFlag: !prevState.likeFlag
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
      <div style={{ border: '1px solid black', marginBottom: '10px' }}>
        <PostHeader
          userData={{
            dp: this.props.postData.dp,
            uname: this.props.postData.uname,
            id: this.props.postData.id
          }}
          pid={this.props.postData.pid}
        />
        <PostBody
          media_url={this.props.postData.media_url}
          content={this.props.postData.content}
        />
        <Like
          handleLikeCount={this.handleLikeCount}
          pid={this.props.postData.pid}
        />
        <LikeList
          likeCount={this.state.likeCount}
          pid={this.props.postData.pid}
        />
        <u onClick={this.navigatePost}>{this.state.commentCount} comments</u>
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
    if (prevProps.postData.likecount !== this.props.postData.likecount ||
      prevProps.postData.commentcount !== this.props.postData.commentcount ||
      prevProps.postData.likeflag !== this.props.postData.likeflag) {
      this.setState({
        likeCount: this.props.postData.likecount,
        commentCount: this.props.postData.commentcount,
        likeFlag: this.props.postData.likeflag ? true : false
      });
    }
  }

  componentDidMount() {
    this.setState({
      likeCount: this.props.postData.likecount,
      commentCount: this.props.postData.commentcount,
      likeFlag: this.props.postData.likeflag ? true : false
    });
  }
}

class PostHeader extends React.Component {
  navigateUser = () => {
    navigate(`${document.location.origin}/u/${this.props.userData.id}`);
  };
  render() {
    return (
      <div>
        <img
          src={this.props.userData.dp}
          alt="user"
          onClick={this.navigateUser}
        />
        <b onClick={this.navigateUser}>{this.props.userData.uname}</b>
        <PostOptions userId={this.props.userData.id} pid={this.props.pid} />
      </div>
    );
  }
}

class PostBody extends React.Component {
  render() {
    return (
      <div>
        <img src={this.props.media_url} alt="post" />
        <p>{this.props.content}</p>
      </div>
    );
  }
}

class PostOptions extends React.Component {
  postEdit = () => {
    navigate(`/p/${this.props.pid}/edit`);
  };

  render() {
    let options = cookie.load("userId") == this.props.userId ? <b onClick={this.postEdit}>Edit</b> : null;
    return <div>{options}</div>;
  }
}
