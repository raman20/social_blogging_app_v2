import React from "react";
import Header from "../header/header";
import ImageKit from "imagekit-javascript";
import axios from "axios";
import cookie from "react-cookies";
import { navigate } from "@reach/router";
import newPostStyle from "../../component_style/new_post/new_post_style";

export default class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postImage: null,
      postImageName: "",
      postImagePreviewUrl: "",
      postText: "",
    };
    this.imagekit = new ImageKit({
      publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
      urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/",
      authenticationEndpoint: `${document.location.origin}/imagekit_auth`,
    });
  }
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleImage = (e) => {
    let file = e.target.files[0];
    let fileType = file.name.split(".").pop();
    let fileName = `${cookie.load("userName")}_upload.${fileType}`;
    let fileBlobUrl = URL.createObjectURL(file);
    this.setState({
      postImage: file,
      postImageName: fileName,
      postImagePreviewUrl: fileBlobUrl,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.postText.trim().length > 0 || this.state.postImage) {
      document.body.style.cursor = "wait";
      if (this.state.postImage) {
        this.imagekit.upload(
          {
            file: this.state.postImage,
            fileName: this.state.postImageName,
          },
          (err, result) => {
            axios
              .post("/post/new", {
                postImageUrl: result.url,
                postImageMediaId: result.fileId,
                postText: this.state.postText,
              })
              .then((res) => {
                if (res.data === "success") {
                  document.body.style.cursor = "";
                  alert("Yay!!! post created successfully");
                  navigate("/home");
                }
              });
          }
        );
      } else {
        axios
          .post("/post/new", {
            postText: this.state.postText,
          })
          .then((res) => {
            if (res.data === "success") {
              document.body.style.cursor = "";
              alert("Yay!!! post created successfully");
              navigate("/home");
            }
          });
      }
    } else alert("Please enter some text or image to create a post!!!");
  };

  render() {
    let previewImage = this.state.postImagePreviewUrl ? (
      <img
        src={this.state.postImagePreviewUrl}
        alt="post"
        style={newPostStyle.postImage}
      />
    ) : (
      "Image Preview"
    );

    return (
      <div className="new_post_page">
        <Header setAuth={this.props.setAuth}/>
        <div
          style={{
            marginTop: "70px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={newPostStyle.newPost}>
            <div style={newPostStyle.imagePreviewDiv}>{previewImage}</div>
            <form
              className="new_post"
              style={newPostStyle.form}
              onSubmit={this.handleSubmit}
            >
              <label for="postImage" style={newPostStyle.inputLabel}>
                add image
              </label>
              <input
                id="postImage"
                type="file"
                accept="image/*"
                style={newPostStyle.imageSelector}
                onChange={this.handleImage}
              />
              <textarea
                id="postText"
                value={this.state.postText}
                placeholder=" add post text..."
                style={newPostStyle.textarea}
                onChange={this.handleChange}
              ></textarea>
              <input
                type="submit"
                value="create"
                style={newPostStyle.submitBtn}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) {
      alert("Login first to create a new post");
      navigate("/login");
    }
  }
}
