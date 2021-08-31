import React from "react";
import cookie from "react-cookies";
import axios from "axios";
import PostList from "../post_utils/post_list";
import { navigate } from "@reach/router";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        posts: [],
      },
      followers: [],
      following: []
    };
  }

  fetchUserData = () => {
    axios
      .get(`/user/${this.props.uname}`)
      .then((res) => {
        if (res.data === 'not found') navigate('/home');
        else this.setState({ userData: res.data });
      });
  };

  fetchFollowers = () => {
    axios
      .get(
        `/user/${this.state.userData.id}/followers`
      )
      .then((res) => {
        this.setState({ followers: res.data });
      });
  };

  fetchFollowing = () => {
    axios
      .get(
        `/user/${this.state.userData.id}/followings`
      )
      .then((res) => {
        this.setState({ following: res.data });
      });
  };

  editProfile = () => {
    navigate(`/u/${this.state.userData.id}/edit`);
  };

  render() {
    let editButton =
      cookie.load("userName") === this.props.uname ? (
        <button onClick={this.editProfile}>Edit</button>
      ) : null;
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
            <FollowButton
              userData={this.state.userData}
            />
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
  }
}

class FollowButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followFlag: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.followFlag === '' && props.userData.followed !== undefined) {
      if (props.userData.followed) {
        return { followFlag: 'Unfollow' };
      } else {
        return { followFlag: 'Follow' };
      }
    }
  }

  handleFollow = () => {
    if (cookie.load("userId")) {
      axios
        .post(
          `/follow/${this.props.userData.id}`
        )
        .then((res) => {
          if (res.data === "success") {
            alert(`${this.state.followFlag}ed successfully`)
            if (this.state.followFlag === "Follow") {
              this.setState({ followFlag: "Unfollow" });
            } else {
              this.setState({ followFlag: "Follow" });
            }
          }
        });
    } else {
      alert("please login to follow!!!");
      navigate('/login');
    }
  };

  render() {
    let followButton =
      cookie.load("userName") === this.props.userData.uname ? null : (
        <button onClick={this.handleFollow}>{this.state.followFlag}</button>
      );
    return <div>{followButton}</div>;
  }
}
