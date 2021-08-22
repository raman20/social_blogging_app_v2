import axios from "axios";
import React from "react";
import PostList from "../post utils/post_list";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postFeed: [],
            postFeedOffset: 10
        }
    }

    fetchFeed = () => {
        axios.get(`/feed/${this.state.postFeedOffset}`)
            .then(res => {
                this.setState((prevState) => {
                    return { postFeed: prevState.postFeed.concate(res.data), postFeedOffset: prevState.postFeedOffset + 10 };
                });
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
        this.fetchFeed();
    }
}