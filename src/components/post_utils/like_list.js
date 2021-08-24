import axios from "axios";
import React from "react";

export default class LikeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            likes: []
        }

        this.LikeListRef = React.createRef();
    }

    showLikeList = () => {
        this.LikeListRef.current.style.display = '';
    }

    closeLikeList = () => {
        this.LikeListRef.current.style.display = 'none';
    }

    fetchLikes = () => {
        axios.get(`http://localhost:3001/like/${this.props.pid}`).then(res => this.setState({ likes: res.data }));
    }

    render() {
        return (
            <>
                <div style={{ 'display': 'none', "opacity": 0.8, 'zIndex': 2, "position": "absolute" }} ref={this.LikeListRef}>
                    <div style={{ 'overflow': 'scroll' }}>
                        {
                            this.state.likes.map((item, index) => {
                                return <LikeListItem likeData={item} key={index} />
                            })
                        }
                    </div>
                    <b style={{ 'color': 'red' }} onClick={this.closeLikeList}> X </b>
                </div>
                <div>
                    <u onClick={this.showLikeList}><b>{this.props.likeCount}</b></u>
                </div>
            </>
        );
    }
}

class LikeListItem extends React.Component {
    redirectToUser = () => { }
    render() {
        return (
            <span onClick={this.redirectToUser}>
                <img src={this.props.likeData.dp} alt="user" /> <b>{this.props.likeData.uname}</b>
            </span>
        );
    }
}