import { navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";
import postStyle from "../../component_style/post/post_style";

export default class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: "",
      comments: [],
    };
  }

  handleChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  postComment = (e) => {
    e.preventDefault();
    if (this.state.newComment.trim().length < 0) {
      alert("please write some comment to post!!!");
      return;
    }
    if (cookie.load("userId")) {
      document.body.style.cursor = "wait";
      axios
        .post(`/comment/${this.props.pid}`, {
          comment: this.state.newComment,
        })
        .then((res) => {
          document.body.style.cursor = "";
          this.props.setCommentCount();
          this.setState((prevState) => {
            return {
              comments: [res.data, ...prevState.comments],
              newComment: "",
            };
          });
        });
    } else alert("Login first to comment !!!");
  };

  fetchComments = () => {
    axios.get(`/comment/${this.props.pid}`).then((res) => {
      this.setState({ comments: res.data });
    });
  };

  navigateUser = (e) => {
    navigate(`/u/${e.target.innerText}`);
  };

  render() {
    return (
      <div style={postStyle.commentSection}>
        <div>
          {this.state.comments.map((item, index) => {
            return (
              <div key={index} index={item.cid}>
                <b onClick={this.navigateUser}>{item.uname}</b> {item.comment}
              </div>
            );
          })}
        </div>
        <hr />
        <form onSubmit={this.postComment} style={postStyle.commentSectionForm}>
          <input
            type="text"
            placeholder=" Add a comment..."
            id="comment_input"
            style={postStyle.commentInput}
            value={this.state.newComment}
            onChange={this.handleChange}
          />
          <input
            type="image"
            src="/send.png"
            style={postStyle.commentButton}
            alt="post"
          />
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pid !== prevProps.pid && this.props.isMainPost) {
      this.fetchComments();
    }
  }

  componentDidMount() {
    if (this.props.isMainPost && this.props.pid) this.fetchComments();
  }
}
