import React from "react";

export default class FeedPost extends React.Component {
    render() {
        return (
            <div style={{border:"1px solid black"}}>
                <div>
                    <img src='/asdas/dasd' />
                    <b>username</b>
                </div>
                <div>
                    <img src="/adas/dasd" style={{ width: "20%", height: "20%" }} />
                    <pre>
                        hello this
                        is post
                        content.
                    </pre>    
                </div>
                <div>
                    <button>like <span>21</span></button>
                    <button>cmnt</button>
                    <button>View</button>
                </div>
            </div>
        );
    }
}