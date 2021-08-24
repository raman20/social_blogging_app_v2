import React from "react";
import cookie from 'react-cookies';
import axios from "axios";
import PostList from "../post_utils/post_list";
import { redirectTo } from "@reach/router";

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            followers: [],
            following: []
        };
    }

    fetchUserData = () => {
        axios.get(`http://localhost:3001/user/${this.props.id}`).then(res => {
            this.setState({ userData: res.data });
        })
    }

    fetchFollowers = () => {
        axios.get(`http://localhost:3001/user/${this.props.id}/followers`).then(res => {
            this.setState({ followers: res.data });
        })
    }
    fetchFollowing = () => {
        axios.get(`http://localhost:3001/user/${this.props.id}/followings`).then(res => {
            this.setState({ following: res.data });
        })
    }

    editProfile = () => { redirectTo(`http://localhost:3001/u/${this.props.id}/edit`); }

    render() {
        let editButton = cookie.load('userId') === this.props.id ? <button onClick={this.editProfile}>Edit</button> : null;
        return (
            <div>
                <div>
                    <div>
                        <img src={this.state.userData.dp} alt="user profile" />
                    </div>
                    <div>
                        <h3>@{this.state.userData.uname}</h3>
                        <div>
                            <b>{this.state.userData.posts.length} posts</b>
                            <b>{this.state.followers.length} followers</b>
                            <b>{this.state.following.length} followings</b>
                        </div>
                        <div>
                            <b>{this.state.userData.fname}</b>
                            <p>{this.state.userData.bio}</p>
                        </div>
                        <FollowButton userId={this.state.userData.id} followed={this.state.userData.followed} />
                        <div>{editButton}</div>
                    </div>
                </div>
                <hr></hr>
                <PostList postFeedData={this.state.userData.posts} />
            </div>
        );
    }

    componentDidMount() {
        this.fetchUserData();
        this.fetchFollowers();
        this.fetchFollowing();
    }
}

class FollowButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            followFlag: null
        }
    }

    handleFollow = () => {
        if (cookie.load('userId')) {
            axios.post(`http://localhost:3001/follow/${this.props.userId}`).then(res => {
                if (res === 'success') {
                    if (this.state.followFlag === 'Follow') this.setState({ followFlag: 'Unfollow' });
                    else this.setState({ followFlag: 'Follow' });
                    alert(`${this.state.followFlag}ed successfully`)
                }
            })
        }
        else {
            alert('please login to follow');
            redirectTo('http://localhost:3001/login');
        }
    }

    render() {
        let followButton = cookie.load('userId') === this.props.userId ? null : <button onClick={this.handleFollow}>{this.state.followFlag}</button>;
        return <div>{followButton}</div>
    }

    componentDidMount() {
        if (this.props.followed) this.setState({ followFlag: 'Unfollow' });
        else this.setState({ followFlag: 'Follow' });
    }
}