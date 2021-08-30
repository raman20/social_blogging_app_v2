import { navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";
import ImageKit from "imagekit-javascript";

export default class PostEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPost: '',
      newImage: null,
      newImageName: '',
      ImageDeleteFlag: false
    };
    this.imagekit = new ImageKit({
      publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
      urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/",
      authenticationEndpoint: `${document.location.origin}/imagekit_auth`
    });
  }

  handleChange = (e) => {
    if (e.target.id === "deleteImage") {
      this.setState((prevState) => {
        return {
          newImage: null,
          newImageName: '',
          deleteImage: !prevState.deleteImage
        };
      });
    } else this.setState({ [e.target.id]: e.target.value });
  };

  handleNewImage = (e) => {
    if (!this.state.ImageDeleteFlag) {
      let file = e.target.files[0];
      let fileType = file.name.split(".").pop();
      let fileName = `${cookie.load('userName')}_${this.props.pip}.${fileType}`;
      this.setState({ newImage: file, newImageName: fileName });
    } else alert("UnCheck the 'delete image' option !!!");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.newImage) {

      this.imagekit.upload({
        file: this.state.newImage,
        fileName: this.state.newImageName
      }, (err, result) => {
        axios.put(`/post/${this.props.pid}/edit`, {
          newImageUrl: result.url,
          newImageId: result.fileId,
          newPost: this.state.newPost,
        }).then((res) => {
          if (res.data === 'success') alert("Post Edited successfully");
        });
      })

    }
    else {
      axios.put(`/post/${this.props.pid}/edit`, {
        text: this.state.postText,
        deleteImage: this.state.deleteImage
      }
      ).then((res) => {
        if (res.data === 'success') alert("Post Edited successfully");
      });
    }
  };

  fetchPostContent = () => {
    axios
      .get(
        `/post/content/${this.props.pid}`
      )
      .then((res) => {
        this.setState({ newPost: res.data });
      });
  };

  deletePost = () => {
    axios
      .delete(
        `/post/delete/${this.props.pid}`
      )
      .then((res) => {
        if (res.data === "success") {
          alert("post deleted successfully");
          navigate('/home');
        }
      });
  };

  render() {
    return (
      <div className="user_edit">
        <form onSubmit={this.handleSubmit}>
          <input type="file" accept="image/*" onChange={this.handleNewImage} />
          <label>
            <input
              type="checkbox"
              id='deleteImage'
              value={this.state.deleteImage}
              onClick={this.handleImageDelete}
            /> Delete Image
          </label>
          <textarea
            id='newPost'
            value={this.state.newPost}
            onChange={this.handlePost}
          ></textarea>
          <input type="submit" value="save" />
        </form>
        <button onClick={this.deletePost}> DELETE POST </button>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) navigate('/login');
    this.fetchPostContent();
  }
}
