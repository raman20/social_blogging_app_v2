import React from "react";
import CommentSection from "./comment_section";
import Post from "./post";

export default class MainPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: {}
        }
    }

    fetchPostData = () => {
        // api.post(pid)
    }

    render() {
        return (
            <>
                <Post postData={this.state.postData}/>
                <CommentSection pid={this.props.pid}/>
            </>
        );
    }

    componentDidMount() {
        this.fetchPostData();
    }
}