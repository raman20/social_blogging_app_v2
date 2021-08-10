import React from "react";
import PostList from "../post utils/post_list";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postFeed: [],
            postFeedLimit: 10
        }
    }

    fetchFeed = () => {
        //api.feed()
    }

    loadMoreFeed = () => {
        this.setState((prevState)=>{
            return {postFeedLimit: prevState.postFeedLimit + 10}
        });
        this.fetchFeed();
    }

    render() {
        return (
            <>
                <PostList postFeedData={this.state.postFeed} />
                <button onClick={this.loadMoreFeed}>load more</button>
            </>
        );
    }

    componentDidMount() {
        this.fetchFeed();
    }
}