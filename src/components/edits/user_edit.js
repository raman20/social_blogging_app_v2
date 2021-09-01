import cookie from "react-cookies";
import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import ImageKit from "imagekit-javascript";
import Header from "../header/header";

export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: '',
      newBio: '',
      newImage: null,
      newImageName: '',
      deleteDp: false
    };

    this.imagekit = new ImageKit({
      publicKey: "public_BA4Pcimv5MNjuSgVgorpdDADpyc=",
      urlEndpoint: "https://ik.imagekit.io/2bb11e1dc25c4278b3c4/",
      authenticationEndpoint: `${document.location.origin}/imagekit_auth`
    });
  }

  fetchUserDetails = () => {
    axios.get('/user/details').then(res => {
      this.setState({
        newName: res.data.fname,
        newBio: res.data.bio
      })
      console.log('fetch done')
    });
  }

  handleChange = (e) => {
    if (e.target.id === "deleteDp") {
      this.setState((prevState, prevProps) => {
        return {
          newImage: null,
          newImageName: '',
          deleteDp: !prevState.deleteDp
        };
      });
    } else this.setState({ [e.target.id]: e.target.value });
  };

  handleNewImage = (e) => {
    if (!this.state.deleteDp) {
      let file = e.target.files[0];
      let fileType = file.name.split(".").pop();
      let fileName = `${cookie.load('userName')}_dp.${fileType}`;
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
        axios.put('/user/edit', {
          newDpUrl: result.url,
          newDpId: result.fileId,
          newBio: this.state.newBio,
          newName: this.state.newName
        }).then((res) => {
          if (res.data === 'success') {
            alert("User Profile Edited successfully")
            navigate(`/u/${cookie.load('userName')}`);
          }
        });
      })

    }
    else {
      axios.put('/user/edit', {
        newName: this.state.newName,
        newBio: this.state.newBio,
        deleteDp: this.state.deleteDp
      }
      ).then((res) => {
        if (res.data === 'success') {
          alert("User Profile Edited successfully")
          navigate(`/u/${cookie.load('userName')}`);
        }
      });
    }
  };

  render() {
    return (
      <div className='user_edit_page'>
        <Header />
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
            <label>
              <input
                type="checkbox"
                value={this.state.deleteDp}
                onChange={this.handleChange}
                id="deleteDp"
              /> delete Dp
            </label>
            <textarea
              value={this.state.newBio}
              onChange={this.handleChange}
              id="newBio"
              placeholder=' Bio...'
            ></textarea>
            <input type="submit" value="apply" />
          </form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (!cookie.load("userId")) {
      navigate('/login');
    }
    else if (cookie.load('userId') !== this.props.id) {
      alert('You Cannot edit this user!!!')
      navigate('/home');
    }
    else {
      this.fetchUserDetails();
    }
  }
}
