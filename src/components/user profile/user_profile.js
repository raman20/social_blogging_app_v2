import React from "react";
import Post from "../post utils/post";

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            userPostData: [],
        };
    }

    fetchUserData = () => {
        //api.user(id);
    }

    render() {
        let editButton = <button onClick={this.editProfile}>Edit</button> ? window.id !== this.props.userId : null;
        return (
            <div>
                <div>
                    <div>
                        <img src={this.userData.dp} alt="user profile" />
                    </div>
                    <div>
                        <h3>@{this.state.userData.uname}</h3>
                        <div>
                            <b>{this.state.userPostData.length} posts</b>
                            <b>{this.state.userData.followerCount} followers</b>
                            <b>{this.state.userData.followingCount} followings</b>
                        </div>
                        <div>
                            <b>{this.state.userData.fname}</b>
                            <p>{this.state.userData.bio}</p>
                        </div>
                        <FollowButton userId={this.state.userData.id} />
                        <div>{editButton}</div>
                    </div>
                </div>
                <hr></hr>
                <div>
                    {this.state.userPostData.map((item, index) => {
                        return <Post index={item.pid} key={index} postData={item} />
                    })}
                </div>
            </div>
        );
    }
}

class FollowButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            followFlag: 'Follow'
        }
    }

    handleFollow = () => {
        // api.follow(uid);
    }

    render() {
        let followButton = <button onClick={this.handleFollow}>{this.state.followFlag}</button> ? window.id !== this.props.userId : null;
        return (
            <div>{followButton}</div>
        );
    }
}