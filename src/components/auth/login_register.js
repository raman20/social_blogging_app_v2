import React from "react"

export default class Auth extends React.Component {
    render() {
        return (
            <div>
                <h4>REGISTER</h4>
                <form>
                    <input type="text" placeholder=" username" />
                    <input type="password" placeholder=" password" />
                    <input type="text" placeholder=" re-type password" />
                    <input type="submit" value="register" />
                </form>

                <br /><br />

                <h4>LOGIN</h4>
                <form>
                    <input type="text" placeholder=" username" />
                    <input type="password" placeholder=" password" />
                    <input type="submit" value="login" />
                </form>
            </div>
        );
    }
}