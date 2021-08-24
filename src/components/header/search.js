import React from "react";
import axios from "axios";
import { redirectTo } from "@reach/router";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: null
        }
    }

    handleSubmit = () => {
        axios.get(`http://localhost:3001/user/search/${this.state.searchVal}`)
            .then(res => {
                if (res.data === 'not_found') alert('user not found!!!');
                else {
                    redirectTo(`/u/${res.data.id}`);
                }
            })
    }

    handleChange = (e) => {
        this.setState({ searchVal: e.target.value });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder=" search user" value={this.state.searchVal} onChange={this.handleChange} />
                    <input type="submit" value="#" />
                </form>
            </div>
        );
    }
}