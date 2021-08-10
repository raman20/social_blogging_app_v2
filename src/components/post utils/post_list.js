import React from "react";
import FeedPost from "./feed_post";

export default class PostList extends React.Component {
    render() {
        let postList = this.props.postFeedData.map((item, index) => {
            return <FeedPost key={index} postData={item} />
        })
        return (
            <div>
                {postList}
            </div>
        );
    }
}