import axios from "axios";
import React from "react";
import cookie from "react-cookies";
import postStyle from "../../component_style/post/post_style";

export default class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: null,
      comments: [],
    };
  }

  handleChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  postComment = (e) => {
    e.preventDefault();
    if (cookie.load("userId")) {
      axios
        .post(`/comment/${this.props.pid}`, {
          comment: this.state.newComment,
        })
        .then((res) => {
          this.setState((prevState) => {
            return { comments: [res.data, ...prevState.comments] };
          });
        });
    } else alert("Login first to comment !!!");
  };

  fetchComments = () => {
    axios.get(`/comment/${this.props.pid}`).then((res) => {
      this.setState({ comments: res.data });
    });
  };

  render() {
    return (
      <div style={postStyle.commentSection}>
        <div>
          {this.state.comments.map((item, index) => {
            return (
              <div key={index} index={item.cid}>
                <b>{item.uname}</b> {item.comment}
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
