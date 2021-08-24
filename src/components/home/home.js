import { redirectTo } from "@reach/router";
import cookie from 'react-cookies';
import axios from "axios";
import React from "react";
import PostList from "../post_utils/post_list";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postFeed: [],
            postFeedOffset: 10
        }
    }

    fetchFeed = () => {
        axios.get(`http://localhost:3001/feed/${this.state.postFeedOffset}`)
            .then(res => {
                if (res.data) {
                    this.setState((prevState) => {
                        return { postFeed: prevState.postFeed.concat(res.data), postFeedOffset: prevState.postFeedOffset + 10 };
                    });
                }
            })
    }

    render() {
        return (
            <>
                <PostList postFeedData={this.state.postFeed} />
                <button onClick={this.fetchFeed}>load more</button>
            </>
        );
    }

    componentDidMount() {
        if (cookie.load('userId')) this.fetchFeed();
        else redirectTo('http://localhost:3001/login');
    }
}