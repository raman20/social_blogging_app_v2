import React from "react";
import Like from "./like_button";
import LikeList from "./like_list";
import CommentSection from "./comment_section";
import cookie from "react-cookies";
import axios from "axios";
import { redirectTo } from "@reach/router";

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
                return { likeCount: prevState.likeCount - 1, likeFlag: !prevState.likeFlag };
            })
        }
        else {
            this.setState((prevState) => {
                return { likeCount: prevState.likeCount + 1, likeFlag: !prevState.likeFlag };
            })
        }
    }

    setCommentCount = () => {
        this.setState((prevState) => {
            return { commentCount: prevState.commentCount + 1 };
        })
    }

    redirectToPost = () => {
        redirectTo(`http://localhost:3001/p/${this.props.postData.pid}`);
    }

    render() {
        return (
            <div>
                <PostHeader userData={{ dp: this.props.postData.dp, uname: this.props.postData.uname, id: this.props.postData.id }} pid={this.props.postData.pid} />
                <PostBody media_url={this.props.postData.media_url} content={this.props.postData.content} />
                <Like handleLikeCount={this.handleLikeCount} pid={this.props.postData.pid} />
                <LikeList likeCount={this.state.likeCount} pid={this.props.postData.pid} />
                <u onClick={this.redirectToPost}>{this.state.commentCount} comments</u>
                <CommentSection commentCount={this.state.commentCount} pid={this.props.postData.pid} setCommentCount={this.setCommentCount} isMainPost={this.props.isMainPost} />
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            likeCount: this.props.postData.likeCount,
            commentCount: this.props.postData.commentCount
        })
    }
}

class PostHeader extends React.Component {
    redirectToUser = () => {
        redirectTo(`http://localhost:3001/u/${this.props.userData.id}`)
    }
    render() {
        return (
            <div>
                <img src={this.props.userData.dp} alt="user" onClick={this.redirectToUser} />
                <b onClick={this.redirectToUser}>{this.props.userData.uname}</b>
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
    postDelete = () => {
        axios.delete(`http://localhost:3001/post/delete/${this.props.pid}`).then(res => {
            if (res.data === 'success') {
                alert('post deleted successfully');
                redirectTo('http://localhost:3001/home');
            }
        })
    }

    postEdit = () => {
        redirectTo(`http://localhost:3001/p/${this.props.userId}/edit`);
    }

    options = cookie.load('userId') === this.props.userId ? <><b onClick={this.postDelete}>delete</b><b onClick={this.postEdit}>Edit</b></> : null;
    render() {
        return (
            <div>
                {this.options}
            </div>
        );
    }
}