import React from "react";
import axios from "axios";
import { navigate } from "@reach/router";
import searchBarStyle from "../../component_style/header/search_style";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: "",
            searchUserList: [],
            debounceTimer: null,
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

    raw_search = () => {
        if (this.state.searchVal.trim()) {
            axios
                .get(`/user/raw_search/${this.state.searchVal}`)
                .then((res) => {
                    if (res.data.length) {
                        this.setState({ searchUserList: res.data });
                    }
                });
        }
    };

    handleChange = (e) => {
        this.setState({
            searchVal: e.target.value,
            searchUserList: [],
        });

        clearTimeout(this.state.debounceTimer);
        let timer = setTimeout(() => {
            this.raw_search();
        }, 500);
        this.setState({ debounceTimer: timer });
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
                    list="user_list"
                    autoComplete
                />{" "}
                <datalist id="user_list">
                    {this.state.searchUserList.map((elem) =>
                        typeof elem === "object" ? (
                            <option key={elem.id} value={elem.uname} />
                        ) : (
                            <option key="msg" value={elem} />
                        )
                    )}
                </datalist>
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
