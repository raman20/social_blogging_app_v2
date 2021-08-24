import { redirectTo } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from 'react-cookies';

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
    }

    postComment = (e) => {
        e.preventDefault();
        if (cookie.load('userId')) {
            axios.post(`http://localhost:3001/comment/${this.props.pid}`, {
                comment: this.state.newComment
            }).this(res => {
                this.setState((prevState) => {
                    return { newComment: prevState.newComment.unshift(res.data) };
                })
            });
        }
        else redirectTo('http://localhost:3001/login');
    }

    fetchComments = () => {
        axios.get(`http://localhost:3001/comment/${this.props.pid}`).then(res => {
            this.state({ comments: res.data });
        });
    }


    render() {
        return (
            <div>
                <div>
                    {this.state.comments.map((item, index) => {
                        return (
                            <div key={index} index={item.cid}>
                                <img src={item.dp} alt="user" /> <b>{item.uname}</b><sup>({item.created})</sup>
                                <p>{item.comment}</p>
                            </div>
                        );
                    })}
                </div>
                <form onSubmit={this.postComment}>
                    <input type="text" placeholder=" write your comment..." value={this.state.newComment} onChange={this.handleChange} />
                    <input type="submit" value="post" />
                </form>
            </div>
        );
    }

    componentDidMount() {
        if (this.props.isMainPost) this.fetchComments();
    }
}