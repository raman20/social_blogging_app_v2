import { navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";

export default class PostEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPost: null,
      newImage: null,
      newImageType: null,
      ImageDeleteFlag: false
    };
  }

  handleName = (e) => {
    this.setState({ newName: e.target.value });
  };

  handleBio = (e) => {
    this.setState({ newBio: e.target.value });
  };

  handleImageDelete = () => {
    this.setState((prevState, prevProps) => {
      return {
        newImageType: null,
        ImageDeleteFlag: !prevState.ImageDeleteFlag
      };
    });
  };

  handleNewImage = (e) => {
    if (!this.state.ImageDeleteFlag) {
      let file = e.target.files[0];
      let fileType = file.name.split(".").pop();
      let reader = new FileReader();
      reader.onload = (e) => {
        let image = e.target.result;
        this.setState({ newImage: image, newImageType: fileType });
      };
      reader.readAsDataURL(file);
    } else alert("UnCheck the 'delete image' option !!!");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `/post/${this.props.pid}/edit`,
        {
          image: this.state.image,
          imageType: this.state.imageType,
          text: this.state.postText,
          deleteImage: this.state.deleteImage
        }
      )
      .then((res) => {
        alert("Post Edited successfully");
      });
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
          navigate(`${document.location.origin}/home`);
        }
      });
  };

  render() {
    return (
      <div className="user_edit">
        <form onSubmit={this.handleSubmit}>
          <input type="file" accept="image/*" onChange={this.handleNewImage} />
          <input
            type="checkbox"
            value=" delete image"
            onClick={this.handleImageDelete}
          />
          <textarea
            value={this.state.newPost}
            onChange={this.handlePost}
          ></textarea>
          <input type="submit" value="apply" />
        </form>
        <button onClick={this.deletePost}> DELETE POST </button>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) navigate(`${document.location.origin}/login`);
    this.fetchPostContent();
  }
}
