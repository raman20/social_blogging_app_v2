import React from "react";

export default class CommentSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newComment: null,
            comments: []
        };
    }

    handleChange = (e) => {
        this.setState({ newComment: e.target.value });
    }

    postComment = () => {
        //api.comment(pid,comment)
    }

    fetchComments = () => {
        //api.getComments(pid)
    }


    render() {
        return (
            <div>
                <div>
                    {this.state.comments.map((item, index) => {
                        return (
                            <div key={index} index={item.cid}>
                                <img src={item.dp} alt="user" /> <b>{item.uname}</b><sup>({item.created})</sup>
                                <p>{item.comment}</p>
                            </div>
                        );
                    })}
                </div>
                <form onSubmit={this.postComment}>
                    <input type="text" placeholder=" write your comment..." value={this.state.newComment} onChange={this.handleChange} />
                    <input type="submit" value="post" />
                </form>
            </div>
        );
    }
}