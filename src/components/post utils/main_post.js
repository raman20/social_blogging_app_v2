import axios from "axios";
import React from "react";
import Post from "./post";

export default class MainPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postData: {}
        }
    }

    fetchPostData = () => {
        axios.get(`/post/pid`).then(res => {
            this.setState({ postData: res.data });
        })
    }

    render() {
        return (
            <Post postData={this.state.postData} isMainPost={true} />
        );
    }

    componentDidMount() {
        this.fetchPostData();
    }
}