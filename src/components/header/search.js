import React from "react";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: null
        }
    }

    handleSubmit = () => {
        // api.search(this.state.searchVal)
    }

    handleChange = (e) => {
        this.setState({ searchVal: e.target.value });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder=" search user" value={this.state.searchVal} onChange={this.handleChange} />
                    <input type="submit" value="@" />
                </form>
            </div>
        );
    }
}