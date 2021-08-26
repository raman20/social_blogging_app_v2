import cookie from "react-cookies";
import React from "react";
import axios from "react";
import { navigate } from "@reach/router";

export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: null,
      newBio: null,
      newImage: null,
      newImageType: null,
      deleteDp: false
    };
  }

  handleChange = (e) => {
    if (e.target.id === "deleteDp") {
      this.setState((prevState, prevProps) => {
        return {
          newImageType: null,
          deleteDp: !prevState.deleteDp
        };
      });
    } else this.setState({ [e.target.id]: e.target.value });
  };

  handleNewImage = (e) => {
    if (!this.state.dpDeleteFlag) {
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
      .put("/user/edit", {
        image: this.state.image,
        imageType: this.state.imageType,
        bio: this.state.postText,
        deleteDp: this.state.deleteDp
      })
      .then((res) => {
        if (res.data === "success") alert("Profile edited Successfully!!!");
      });
  };

  render() {
    return (
      <div className="user_edit">
        <form onSubmit={this.handleSubmit}>
          <input type="file" accept="image/*" onChange={this.handleNewImage} />
          <input
            type="text"
            value={this.state.newName}
            placeholder=" new name"
            onChange={this.handleChange}
            id="newName"
          />
          <input
            type="checkbox"
            value=" delete dp"
            onChange={this.handleChange}
            id="deleteDp"
          />
          <textarea
            value={this.state.newBio}
            onChange={this.handleChange}
            id="newBio"
          ></textarea>
          <input type="submit" value="apply" />
        </form>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) {
      navigate(`${document.location.origin}/login`);
    }
  }
}
