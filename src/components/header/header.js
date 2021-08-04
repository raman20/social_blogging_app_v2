import React from "react";

export default class Header extends React.Component {
    render() {
        return (
            <div style={{backgroundColor: "grey"}}>
                <nav>
                    <h4>SOCIAL APP</h4>
                    <form>
                        <input type="text" />
                        <button type="submit">\</button>
                    </form>
                    <ul>
                        <li><button>HOME</button></li>
                        <li><button>profile</button></li>
                        <li><button>logout</button></li>
                    </ul>
                </nav>
            </div>
        );
    }
}