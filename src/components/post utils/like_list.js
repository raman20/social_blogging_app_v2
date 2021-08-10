import React from "react";

export default class LikeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            likes: []
        }
    }

    handleClick = () => {
        //handle Click
    }

    fetchLikes = () => {
        //fetch likes
    }

    render() {
        return (
            <>
                <div style={{ 'display': 'hidden' }}>
                    {
                        this.state.likes.map((item, index) => {
                            return <LikeListItem likeData={item} key={index} />
                        })
                    }
                </div>
                <div>
                    <u onClick={this.handleClick}><b>this.props.likeCount</b></u>
                </div>
            </>
        );
    }
}

class LikeListItem extends React.Component {
    render() {
        return (
            <span>
                <img src={this.props.likeData.dp} alt="user" /> <b>{this.props.likeData.uname}</b>
            </span>
        );
    }
}