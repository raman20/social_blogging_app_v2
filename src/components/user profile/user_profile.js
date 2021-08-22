import React from "react";
import cookie from 'react-cookies';
import axios from "axios";
import PostList from "../post utils/post_list";

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            followers: [],
            following: []
        };
    }

    fetchUserData = () => {
        axios.get(`/user/:id`).then(res => {
            this.setState({ userData: res });
        })
    }

    fetchFollowers = () => {
        axios.get(`/user/:id/followers`).then(res => {
            this.setState({ followers: res.data });
        })
    }
    fetchFollowing = () => {
        axios.get(`/user/:id/followings`).then(res => {
            this.setState({ following: res.data });
        })
    }

    render() {
        let editButton = cookie.load('userId') !== this.props.userId ? <button onClick={this.editProfile}>Edit</button> : null;
        return (
            <div>
                <div>
                    <div>
                        <img src={this.userData.dp} alt="user profile" />
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
        axios.post(`/follow/${this.props.userId}`).then(res => {
            if (res === 'success') {
                if (this.state.followFlag === 'Follow') this.setState({ followFlag: 'Unfollow' });
                else this.setState({ followFlag: 'Follow' });
                alert(`${this.state.followFlag}ed successfully`)
            }
        })
    }

    render() {
        let followButton = cookie.load('userId') !== this.props.userId ? <button onClick={this.handleFollow}>{this.state.followFlag}</button> : null;
        return <div>{followButton}</div>
    }

    componentDidMount() {
        if (this.props.followed) this.setState({ followFlag: 'Unfollow' });
        else this.setState({ followFlag: 'Follow' });
    }
}