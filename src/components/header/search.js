import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import searchBarStyle from "../../component_style/header/search_style";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`/user/search/${this.state.searchVal}`).then((res) => {
      if (res.data === "not_found") alert("user not found!!!");
      else {
        navigate(`/u/${this.state.searchVal}`);
      }
    });
  };

  handleChange = (e) => {
    this.setState({ searchVal: e.target.value });
  };

  render() {
    return (
      <form style={searchBarStyle.search} onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder=" search user"
          value={this.state.searchVal}
          onChange={this.handleChange}
          style={searchBarStyle.searchBarInput}
        />{' '}
        <input
          type="image"
          src="/search.png"
          style={searchBarStyle.searchIcon}
          alt="search"
        />
      </form>
    );
  }
}
