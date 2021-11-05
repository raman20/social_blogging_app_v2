import React from "react";
import cookie from "react-cookies";
import axios from "axios";
import PostList from "../post_utils/post_list";
import { navigate } from "@reach/router";
import Header from "../header/header";
import userProfileStyle from "../../component_style/user_profile/user_profile_style";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        posts: [],
      },
      followers: [],
      following: [],
    };
  }

  fetchUserData = () => {
    axios.get(`/user/${this.props.uname}`).then((res) => {
      if (res.data === "not found") {
        alert("User not found!!!");
        navigate("/home");
      } else {
        this.setState({ userData: res.data });
      }
    });
  };

  fetchFollowers = () => {
    axios.get(`/user/${this.state.userData.id}/followers`).then((res) => {
      this.setState({ followers: res.data });
    });
  };

  fetchFollowing = () => {
    axios.get(`/user/${this.state.userData.id}/followings`).then((res) => {
      this.setState({ following: res.data });
    });
  };

  editProfile = () => {
    navigate(`/u/${this.state.userData.id}/edit`);
  };

  setBio = (e) => {
    e.target.innerText = this.state.userData.bio;
  };

  render() {
    let editButton =
      cookie.load("userName") === this.props.uname ? (
        <button className="edit_btn" onClick={this.editProfile}>
          Edit
        </button>
      ) : null;

    return (
      <div>
        <Header setAuth={this.props.setAuth} />
        {this.state.userData.uname === undefined ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <img src="/loading.gif" alt="loading indicator" />
          </div>
        ) : (
          <div style={userProfileStyle.userProfile}>
            <div style={userProfileStyle.userProfileInfo}>
              <div style={userProfileStyle.profilePicDiv}>
                <img
                  src={this.state.userData.dp}
                  alt="user profile"
                  style={userProfileStyle.profilePic}
                />
                <div></div>
              </div>
              <div style={userProfileStyle.userProfileMeta}>
                <div style={userProfileStyle.uname}>
                  <h2>@{this.state.userData.uname}</h2>
                  <div>
                    <FollowButton userData={this.state.userData} />
                    {editButton}
                  </div>
                </div>
                <div style={userProfileStyle.userProfileMetrics}>
                  <div style={userProfileStyle.userProfileMetricsItem}>
                    <b>{this.state.userData.posts.length}</b> posts
                  </div>
                  <div style={userProfileStyle.userProfileMetricsItem}>
                    <b>{this.state.userData.followercount}</b> followers
                  </div>
                  <div style={userProfileStyle.userProfileMetricsItem}>
                    <b>{this.state.userData.followingcount}</b> followings
                  </div>
                </div>
                <div>
                  <h4>{this.state.userData.fname}</h4>
                  <pre>{this.state.userData.bio}</pre>
                </div>
              </div>
            </div>
            <hr style={userProfileStyle.hr} />
            <PostList postFeedData={this.state.userData.posts} isUserProfile />
          </div>
        )}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.uname !== this.props.uname) {
      this.fetchUserData();
    }
  }

  componentDidMount() {
    if (!cookie.load("userId")) {
      navigate("/login");
    } else {
      this.fetchUserData();
    }
  }
}

class FollowButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      followFlag: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.followFlag === "" && props.userData.followed !== undefined) {
      if (props.userData.followed) {
        return { followFlag: "Unfollow" };
      } else {
        return { followFlag: "Follow" };
      }
    }
  }

  handleFollow = () => {
    if (cookie.load("userId")) {
      axios.post(`/follow/${this.props.userData.id}`).then((res) => {
        if (res.data === "success") {
          alert(`${this.state.followFlag}ed successfully`);
          if (this.state.followFlag === "Follow") {
            this.setState({ followFlag: "Unfollow" });
          } else {
            this.setState({ followFlag: "Follow" });
          }
        }
      });
    } else {
      alert("please login to follow!!!");
      navigate("/login");
    }
  };

  render() {
    let followButton =
      cookie.load("userName") === this.props.userData.uname ? null : (
        <button className="follow_btn" onClick={this.handleFollow}>
          {this.state.followFlag}
        </button>
      );
    return <div>{followButton}</div>;
  }
}
