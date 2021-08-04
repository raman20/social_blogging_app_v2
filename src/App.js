import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authId: null,
      currentComponent: null,
      components: {
        'Login': <Login setCurrentComponent={this.setCurrentComponent} setAuth={this.setAuth} />,
        'Register': <Register setCurrentComponent={this.setCurrentComponent} />,
        'PasswordReset': <PasswordReset setCurrentComponent={this.setCurrentComponent} />,
        'Home': <Home setCurrentComponent={this.setCurrentComponent} />
      }
    };
  }

  setCurrentComponent = (componentName, actualComponent = null) => {
    if (actualComponent) this.setState({ currentComponent: actualComponent });
    else this.setState({ currentComponent: this.state.components[componentName] });
  }

  setAuth = (userId, uname) => {
    this.setState({ authId: userId, authName: uname });
  }

  render() {
    return (
      <div className="App">
        {this.state.currentComponent}
      </div>
    )
  }

  componentDidMount() {
    if (this.state.authId === null) {
      this.setState({ currentComponent: this.state.components.Login });
    }
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null
    };
  }

  handleChange = (e) => {
    this.setState({ searchValue: e.target.value });
  }

  handleSearch = () => {
    if (this.state.searchValue === null) {
      alert('enter any username!!!');
    }
    else {
      fetch(`/user/search/${this.state.searchValue}`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.result === 'sys_error') alert('server error!!!');
          else if (res.result === "not_found") alert('User not exists!!!');
          else this.props.setCurrentComponent('', <User setCurrentComponent={this.props.setCurrentComponent} id={res.id} />)
        })
    }
  }

  redirectToHome = () => {
    this.props.setCurrentComponent('Home');
  }

  redirectToProfile = () => {
    this.props.setCurrentComponent('Profile');
  }
  logout = () => {
    this.props.setAuth(null);
  }

  render() {
    return (
      <div className="app_header" style={{ border: "1px solid black" }}>
        <nav>
          <h4 className="app_title">SOCIAL APP</h4>
          <form className="user_search" onSubmit={this.handleSearch}>
            <input className="search_bar" type="text" value={this.state.searchValue} onChange={this.handleChange} />
            <input className="search_button" type="submit" value="#" />
          </form>
          <ul>
            <li><button onClick={this.redirectToHome}>Home</button></li>
            <li><button onClick={this.redirectToProfile}>Profile</button></li>
            <li><button onClick={this.logout}>Logout</button></li>
          </ul>
        </nav>
      </div>
    );
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      password2: null
    }
  }

  handleClick = () => {
    this.props.setCurrentComponent('Login');
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  }
  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }
  handlePassword2 = (e) => {
    this.setState({ password2: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password === this.state.password2) {
      fetch('www.test.com', {
        method: "POST",
        headers: {
          "Accept": "applicatio/json",
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          passwd: this.state.password,
        })
      }).then(res => res.text()).then((res) => {
        if (res === "sys_error") {
          alert('please try again:- SERVER ERROR');
        }
        else if (res === "success") {
          alert('Registered Successfully please login now');
        }
      })
    }
    else {
      alert('Please Check your password!!');
    }
  }

  render() {
    return (
      <div>
        <h4>REGISTER</h4>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder=" username" value={this.state.username} onChange={this.handleUsername} />
          <input type="password" placeholder=" password" value={this.state.password} onChange={this.handlePassword} />
          <input type="text" placeholder=" re-type password" value={this.state.password2} onChange={this.handlePassword2} />
          <input type="submit" value="register" />
        </form>
        <p><span onClick={this.handleClick}>click</span> to login</p>
      </div>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null
    }
  }

  handleClickReg = () => {
    this.props.setCurrentComponent('Register');
  }

  handleClickPwdReset = () => {
    this.props.setCurrentComponent('PasswordReset');
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    fetch('test.com', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        passwd: this.state.password
      })
    }).then(res => res.json()).then(res => {
      if (res.result === 'success') this.props.setAuth(res.userId, res.uname);
      else if (res.result === "sys_error") alert('please try again:- SERVER ERROR');
      else alert("Please Check Your User Name or Password");
    })
  }

  render() {
    return (
      <div>
        <h4>LOGIN</h4>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder=" username" value={this.state.username} onChange={this.handleUsername} />
          <input type="password" placeholder=" password" value={this.state.password} onChange={this.handlePassword} />
          <input type="submit" value="login" />
        </form>
        <span>forgot password <button onClick={this.handleClickPwdReset}>click here</button></span>
        <span>new user? <button onClick={this.handleClickReg}>click here</button></span>
      </div>
    );
  }
}

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      password2: null
    }
  }

  handleClick = () => {
    this.props.setCurrentComponent('Login');
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handlePassword2 = (e) => {
    this.setState({ password2: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.password2) {
      fetch('www.test.com', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          new_passwd: this.state.password
        })
      }).then(res => res.json()).then(res => {
        if (res.result === 'success') this.props.setCurrentComponent('Login');
        else alert('Server Error!!! please try again');
      })
    }
    else {
      alert('Please check your password again');
    }
  }

  render() {
    return (
      <div>
        <h4>Change password</h4>
        <form onSubmit={this.handleSubmit}>
          <input type="password" placeholder=" enter new password" value={this.state.password} onChange={this.handlePassword} />
          <input type="text" placeholder=" re-enter password" value={this.state.password2} onChange={this.handlePassword2} />
          <input type="submit" value="change" />
        </form>
        <span><button onClick={this.handleClick}>Click</button> to login</span>
      </div>
    );
  }
}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feed: [],
      limit: 0
    }
  }

  fetchFeed = () => {
    fetch('test.com', {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "aplication/json"
      }
    })
      .then(res => { res.json() })
      .then(res => {
        if (res.result === "sys_error") {
          alert('Server Erro!!!');
          this.fetchFeed();
        }

        else {
          let newFeedItems = res.map((res_data, index) => <FeedPost key={index} feedData={res_data} />)
          this.setState((prevState, prevProps) => {
            return { feed: prevState.feed.concat(newFeedItems) }
          })
        }
      })
  }

  loadMoreFeed = () => {
    this.setState({ limit: this.state.limit + 10 });
    this.fetchFeed();
  }

  render() {
    return (
      <>
        <Header />
        <div>
          {this.state.feed}
          <button onClick={this.loadMoreFeed}>more</button>
        </div>
      </>
    );
  }

  componentDidMount() {
    this.fetchFeed();
  }
}

class FeedPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likeFlag: 0,
      likeCount: this.props.likeCount,
      commentCount: this.props.commentCount,
      likes: []
    }
  }

  redirectToPost = () => {
    this.props.setCurrentComponent('', <MainPost setCurrentComponent={this.props.setCurrentComponent} postData={this.props.feedData} likes={this.state.likes} />);
  }

  redirectToUser = () => {
    this.props.setCurrentComponent('', <User setCurrentComponent={this.props.setCurrentComponent} id={this.props.feedData.id} />)
  }

  handleLike = () => {
    if (this.state.likeFlag === 0) {
      this.setState((prevState, prevProps) => {
        return { likeFlag: 1, likeCount: prevState.likeCount + 1 };
      })
    }
    else {
      this.setState((prevState, prevProps) => {
        return { likeFlag: 0, likeCount: prevState.likeCount - 1 };
      })
    }

    fetch(`/like/${this.props.feedData.pid}`, {
      method: "POST",
      headers: {
        "Accept": "applicatio/json"
      }
    })
      .this(res => res.json())
      .this(res => {
        if (res.result === 'sys_error') alert('Server Error!!!');
      });
  }

  handleComment = () => {
    this.redirectToPost();
  }

  fetchLikes = () => {
    fetch(`/like/${this.props.feedData.pid}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.result === 'sys_error') {
          alert('server error!!!')
        }
        else {
          this.setState({ likes: res });
        }
      })
  }

  render() {
    return (
      <div id={this.props.feedData.pid} className="fp" style={{ border: "1px solid black" }}>
        <div className="fp_header">
          <div className="fp_header_user_meta" onClick={this.redirectToUser}>
            <img className="fp_userDp" src={this.props.feedData.dp} alt="user profile" />
            <b className="fp_uname">{this.props.feedData.uname}</b>
          </div>
        </div>
        <div className="fp_body">
          <img className="fp_media" src={this.props.feedData.media_url} style={{ width: "20%", height: "20%" }} alt="user post" />
          <p className="fp_content">{this.props.feedData.content}</p>
        </div>
        <div className="fp_buttons">
          <button className="fp_like" onClick={this.handleLike}>like</button>
          <u>{this.state.likeCount}</u>
          <button className="fp_comment" onClick={this.handleComment}>comment</button>
          <u className="view_post" onClick={this.redirectToPost}>view post</u>
        </div>
      </div>
    );
  }
}

class MainPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentCount: 0,
      likeFlag: 0,
      likeCount: this.props.likes.length,
      likes: this.props.likes,
    }
  }

  redirectToUser = () => {
    this.props.setCurrentComponent('', <User setCurrentComponent={this.props.setCurrentComponent} id={this.props.postData.id} />)
  }

  handleLike = () => {
    if (this.state.likeFlag === 0) {
      this.setState((prevState, prevProps) => {
        return { likeFlag: 1, likeCount: prevState.likeCount + 1 };
      })
    }
    else {
      this.setState((prevState, prevProps) => {
        return { likeFlag: 0, likeCount: prevState.likeCount - 1 };
      })
    }

    fetch(`/like/${this.props.pid}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
      .this(res => res.json())
      .this(res => {
        if (res.result === 'sys_error') alert('Server Error!!!');
      });
  }

  fetchComments = () => {
    fetch(`/comments/${this.props.postData.pid}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.result === 'sys_error') alert("server error!!!");
        else this.setState({
          comments: res,
          commentCount: res.length
        });
      });
  }

  handleChange = (e) => {
    this.setState({ newComment: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.newComment) {
      fetch(`/coment/${this.props.pid}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment: this.state.newComment })
      })
        .then(res => res.json())
        .then(res => {
          if (res.result === "sys_error") alert('Server Error!!!');
          else {
            this.setState({ comments: this.state.comments.concat(res) })
          }
        })
    }
    else alert('Please write any comment');
  }

  render() {
    return (
      <>
        <Header />
        <div className="post">
          <div className="post_header">
            <div onClick={this.redirectToUser}>
              <img src={this.props.postData.dp} alt="user profile" />
              <b>{this.props.postData.uname}</b></div>
          </div>
          <div className="post_body">
            <div className="post_media">
              <img src={this.state.postData.media_url} alt="post" />
            </div>
            <div className="post_text">
              <p>{this.props.postData.content}</p>
            </div>
          </div>
          <div className="post_buttons">
            <button onClick={this.handleLike}>Like</button>
            <u>{this.state.likeCount}</u>
            <button>comment {this.state.commentCount}</button>
          </div>
          <div className="post_comments">
            {
              this.state.comments.map((item, index) => {
                return (
                  <span key={index} id={item.cid} className="comment">
                    <img src={item.dp} alt="comment owner profile" /> <b className="comment_uname" onClick={this.redirectToUser}><u>{item.uname}</u></b> {item.comment}<sup>{'(' + item.created.day + '/' + item.created.month + '/' + item.created.year + ')'}</sup>
                  </span>);
              })
            }
            <form className="comment_input" onSubmit={this.postComment}>
              <input type="text" placeholder="write your comment..." value={this.state.newComment} onChange={this.handleChange} />
              <input type="submit" value="post" />
            </form>
          </div>
        </div>
      </>
    );
  }

  componentDidMount = () => {
    this.fetchComments();
  }

}

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      posts: [],
      followers: [],
      followings: []
    };
  }
  fetchUserData = () => { }

  fetchPosts = () => { }

  fetchFollowers = () => { }

  fetchFollowings = () => { }

  render() {
    return (
      <>
        <Header />
        <img src={this.state.userData.dp} alt="profile" />
        <h3>@{this.state.userData.uname}</h3>
        <b>{this.state.posts.length} posts</b> <b>{this.state.followers.length} followers</b> <b>{this.state.followings.length} followings</b>

        <b>{this.state.userData.fname}</b>
        <p>{this.state.userData.bio}</p>

        <div>
          {this.state.posts.map((elem, index) => {
            return <FeedPost key={index} feedData={elem} />
          })}
        </div>
      </>
    );
  }
}

class PostEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postText: this.props.postData.content,
      image: null,
      imageType: null,
      deleteImage: false
    }
  }

  handleChange = (e) => {
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/post/edit/${this.props.postData.pid}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: this.state.image,
        imageType: this.state.imageType,
        text: this.state.postText,
        deleteImage: this.state.deleteImage
      })
        .this(res => res.json())
        .this(res => {
          if (res.result === "sys_error") alert('server error');
          else {
            alert('Post Edited successfully');
            let postData = this.props.postData;
            postData.media_url = res.media_url;
            postData.content = this.state.postText;
            this.props.setCurrentComponent('', <MainPost postData={postData} />);
          }
        })
    })
  }

  handleFile = (e) => {
    if (!this.state.deleteImage) {
      let file = e.target.files[0];
      let fileType = file.name.split('.').pop();
      let reader = new FileReader();
      reader.onload = (e) => {
        let image = e.target.result;
        this.setState({ image: image, imageType: fileType });
      };
      reader.readAsDataURL(file);
    }
    else alert("UnCheck the 'delete image' option !!!")
  }

  handleToggle = (e) => {
    this.setState((prevState, prevProps) => {
      return {
        image: null,
        deleteImage: !prevState.deleteImage
      };
    })
  }

  render() {
    return (
      <>
        <Header />
        <form onSubmit={this.handleSubmit}>
          <input type='file' accept="image/*" onChange={this.handleFile} />
          <label><u>delete image</u> <input type="checkbox" onChange={this.handleToggle} defaultChecked={this.state.deleteImage} /></label>
          <textarea value={this.state.postText} onChange={this.handleChange}></textarea>
          <input type="submit" value="apply" />
        </form>
      </>
    );
  }
}

class UserEdit extends React.Component {
  render() {
    return;
  }
}

export default App;
