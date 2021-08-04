import React from "react";
import Header from "../header/header";

export class NewPost extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <div>
                    <form>
                        <input type="file" accept="image/*"/>
                        <textarea placeholder="write post content..."></textarea>
                        <input type="submit" value="create"/>
                    </form>
                </div>
            </div>
        );
    }
}