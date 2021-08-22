import React from "react";
import cookie from 'react-cookies';
import axios from "axios";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: null
        }
    }

    handleSubmit = () => {
        // api.search(this.state.searchVal)
        axios.get(`/user/search/${cookie.load('userName')}`)
            .then(res => {
                if (res.data === 'not_found') alert('user not found!!!');
                else {
                    //redirect to user
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