import cookie from "react-cookies";
import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import ImageKit from "imagekit-javascript";
import Header from "../header/header";
import userEditStyle from "../../component_style/edit/user_edit_style";

export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: "",
      newBio: "",
      newImage: null,
      newImageName: "",
      newImagePreviewUrl: "",
      deleteDp: false,
    };

    this.imagekit = new ImageKit({
      publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
      urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/",
      authenticationEndpoint: `${document.location.origin}/imagekit_auth`,
    });
  }

  fetchUserDetails = () => {
    axios.get("/user/details").then((res) => {
      this.setState({
        newName: res.data.fname,
        newBio: res.data.bio,
      });
      console.log("fetch done");
    });
  };

  handleChange = (e) => {
    if (e.target.id === "deleteDp") {
      this.setState((prevState, prevProps) => {
        return {
          newImage: null,
          newImageName: "",
          newImagePreviewUrl: "",
          deleteDp: !prevState.deleteDp,
        };
      });
    } else this.setState({ [e.target.id]: e.target.value });
  };

  handleNewImage = (e) => {
    if (!this.state.deleteDp) {
      let file = e.target.files[0];
      let fileType = file.name.split(".").pop();
      let fileName = `${cookie.load("userName")}_dp.${fileType}`;
      let fileBlobUrl = URL.createObjectURL(file);
      this.setState({
        newImage: file,
        newImageName: fileName,
        newImagePreviewUrl: fileBlobUrl,
      });
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
            .put("/user/edit", {
              newDpUrl: result.url,
              newDpId: result.fileId,
              newBio: this.state.newBio,
              newName: this.state.newName,
            })
            .then((res) => {
              document.body.style.cursor = "";
              if (res.data === "success") {
                alert("User Profile Edited successfully");
                navigate(`/u/${cookie.load("userName")}`);
              }
            });
        }
      );
    } else {
      document.body.style.cursor = "wait";
      axios
        .put("/user/edit", {
          newName: this.state.newName,
          newBio: this.state.newBio,
          deleteDp: this.state.deleteDp,
        })
        .then((res) => {
          document.body.style.cursor = "";
          if (res.data === "success") {
            alert("User Profile Edited successfully");
            navigate(`/u/${cookie.load("userName")}`);
          }
        });
    }
  };

  render() {
    let previewImage = this.state.newImagePreviewUrl ? (
      <img
        src={this.state.newImagePreviewUrl}
        alt="post"
        style={userEditStyle.newImage}
      />
    ) : (
      "image preview"
    );

    return (
      <div className="user_edit_page">
        <Header setAuth={this.props.setAuth} />
        <div
          style={{
            marginTop: "70px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={userEditStyle.userEdit}>
            <div style={userEditStyle.newImagePreviewDiv}>{previewImage}</div>
            <form onSubmit={this.handleSubmit} style={userEditStyle.form}>
              <label for="newImage" style={userEditStyle.label}>
                add new profile pic
              </label>
              <input
                type="file"
                accept="image/*"
                id="newImage"
                style={userEditStyle.imageSelector}
                onChange={this.handleNewImage}
              />
              <label for="deleteDp" style={userEditStyle.label}>
                <input
                  type="checkbox"
                  value={this.state.deleteDp}
                  onChange={this.handleChange}
                  id="deleteDp"
                />{" "}
                delete profile pic
              </label>
              <input
                type="text"
                value={this.state.newName}
                placeholder=" new name"
                onChange={this.handleChange}
                id="newName"
                style={userEditStyle.nameInput}
              />
              <textarea
                value={this.state.newBio}
                onChange={this.handleChange}
                id="newBio"
                placeholder=" new Bio..."
                style={userEditStyle.textarea}
              ></textarea>
              <input
                type="submit"
                value="update"
                style={userEditStyle.submitBtn}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) {
      navigate("/login");
    } else if (cookie.load("userId") !== this.props.id) {
      alert("You Cannot edit this user!!!");
      navigate("/home");
    } else {
      this.fetchUserDetails();
    }
  }
}
