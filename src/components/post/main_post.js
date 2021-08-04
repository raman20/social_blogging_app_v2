import React from "react";

class MainPost extends React.Component {
    render() {
        return (
            <div>
                <div style={{ border: "1px solid black" }}>
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
                    </div>
                </div>
                <div>
                    <form>
                    <input type="text" placeholder=" enter comment" />
                    <button type="submit">cmnt</button>
                    </form>

                    <span><b>user1</b> this is comment 1</span>
                    <br/>
                    <span><b>user2</b> this is comment 2</span>
                </div>
            </div>
        );
    }
}

export default MainPost;