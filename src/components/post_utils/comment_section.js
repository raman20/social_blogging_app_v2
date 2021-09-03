import axios from "axios";
import React from "react";
import cookie from "react-cookies";

export default class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: null,
      comments: []
    };
  }

  handleChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  postComment = (e) => {
    e.preventDefault();
    if (cookie.load("userId")) {
      axios
        .post(
          `/comment/${this.props.pid}`,
          {
            comment: this.state.newComment
          }
        )
        .this((res) => {
          this.setState((prevState) => {
            return { newComment: prevState.newComment.unshift(res.data) };
          });
        });
    }
    else alert('Login first to comment !!!');
  };

  fetchComments = () => {
    axios
      .get(`/comment/${this.props.pid}`)
      .then((res) => {
        this.state({ comments: res.data });
      });
  };

  render() {
    return (
      <div style={{ border: '1px solid red' }}>
        <div>
          {this.state.comments.map((item, index) => {
            return (
              <div key={index} index={item.cid}>
                <img src={item.dp} alt="user" /> <b>{item.uname}</b>
                <sup>({item.created})</sup>
                <p>{item.comment}</p>
              </div>
            );
          })}
        </div>
        <form onSubmit={this.postComment}>
          <input
            type="text"
            placeholder=" write your comment..."
            value={this.state.newComment}
            onChange={this.handleChange}
          />
          <input type="submit" value="post" />
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id && this.props.isMainPost) {
      this.fetchComments();
    }
  }

  componentDidMount() {
    if (this.props.isMainPost) this.fetchComments();
  }
}
