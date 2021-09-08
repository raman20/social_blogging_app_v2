import { navigate } from "@reach/router";
import axios from "axios";
import React from "react";
import cookie from "react-cookies";
import ImageKit from "imagekit-javascript";
import Header from "../header/header";
import postEditStyle from "../../component_style/edit/post_edit_style";

export default class PostEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPost: "",
      newImage: null,
      newImageName: "",
      newImagePreviewUrl: "",
      deleteImage: false,
    };
    this.imagekit = new ImageKit({
      publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
      urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/",
      authenticationEndpoint: `${document.location.origin}/imagekit_auth`,
    });
  }

  handleChange = (e) => {
    if (e.target.id === "deleteImage") {
      this.setState((prevState) => {
        return {
          newImage: null,
          newImageName: "",
          newImagePreviewUrl: "",
          deleteImage: !prevState.deleteImage,
        };
      });
    } else this.setState({ [e.target.id]: e.target.value });
  };

  handleNewImage = (e) => {
    if (!this.state.deleteImage) {
      let file = e.target.files[0];
      let fileType = file.name.split(".").pop();
      let fileName = `${cookie.load("userName")}_${this.props.pip}.${fileType}`;
      this.setState({ newImage: file, newImageName: fileName });
    } else alert("UnCheck the 'delete image' option !!!");
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.newImage) {
      document.body.style.cursor = "wait";
      this.imagekit.upload(
        {
          file: this.state.newImage,
          fileName: this.state.newImageName,
        },
        (err, result) => {
          axios
            .put(`/post/${this.props.pid}/edit`, {
              newImageUrl: result.url,
              newImageId: result.fileId,
              newPost: this.state.newPost,
            })
            .then((res) => {
              document.body.style.cursor = "";
              if (res.data === "success") alert("Post Edited successfully");
            });
        }
      );
    } else {
      document.body.style.cursor = "wait";
      axios
        .put(`/post/${this.props.pid}/edit`, {
          newPost: this.state.newPost,
          deleteImage: this.state.deleteImage,
        })
        .then((res) => {
          document.body.style.cursor = "";
          if (res.data === "success") alert("Post Edited successfully");
        });
    }
  };

  fetchPostContent = () => {
    axios.get(`/post/content/${this.props.pid}`).then((res) => {
      this.setState({ newPost: res.data });
    });
  };

  deletePost = () => {
    let consent = window.confirm("are you sure to delete post");
    if (consent) {
      document.body.style.cursor = "wait";
      axios.delete(`/post/delete/${this.props.pid}`).then((res) => {
        if (res.data === "success") {
          document.body.style.cursor = "";
          alert("post deleted successfully");
          navigate("/home");
        }
      });
    }
  };

  render() {
    let previewImage = this.state.newImagePreviewUrl ? (
      <img
        src={this.state.newImagePreviewUrl}
        alt="post"
        style={postEditStyle.newImage}
      />
    ) : null;

    return (
      <div className="post_edit_page">
        <Header />
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={postEditStyle.postEdit}>
            <div style={postEditStyle.newImagePreviewDiv}>{previewImage}</div>
            <form onSubmit={this.handleSubmit} style={postEditStyle.form}>
              <label for="newImage" style={postEditStyle.label}>
                new image
              </label>
              <input
                type="file"
                accept="image/*"
                id="newImage"
                style={postEditStyle.imageSelector}
                onChange={this.handleNewImage}
              />
              <label style={postEditStyle.label}>
                <input
                  type="checkbox"
                  id="deleteImage"
                  value={this.state.deleteImage}
                  onClick={this.handleChange}
                />{" "}
                delete Image
              </label>
              <textarea
                id="newPost"
                value={this.state.newPost}
                onChange={this.handleChange}
                style={postEditStyle.textarea}
                placeholder="edit post text..."
              ></textarea>
              <input
                type="submit"
                value="save"
                style={postEditStyle.submitBtn}
              />
            </form>
            <button onClick={this.deletePost}> DELETE POST </button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) navigate("/login");
    this.fetchPostContent();
  }
}
