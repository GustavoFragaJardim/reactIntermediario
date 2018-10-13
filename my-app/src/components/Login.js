import React, { Component } from 'react';
import { withRouter } from "react-router-dom";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { msg: (this.props.location && this.props.location.state && this.props.location.state.detail) ? this.props.location.state.detail : null };
    }

    send(event) {
        event.preventDefault();
        const request = {
            method: 'POST',
            body: JSON.stringify({ login: this.login.value, senha: this.password.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };
        fetch('http://localhost:8080/api/public/login', request)
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error('Não foi possível logar!')
                }
            })
            .then((token) => {
                localStorage.setItem('auth-token', token);
                this.props.history.push("/timeline");
            }).catch((error) => {
                this.setState({ msg: error.message })
            })
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instagram</h1>
                <span>{this.state.msg}</span>
                <form onSubmit={this.send.bind(this)}>
                    <input type="text" ref={(input) => this.login = input} />
                    <input type="password" ref={(input) => this.password = input} />
                    <input type="submit" value="login" />
                </form>
            </div>
        );
    }
}
export default withRouter(Login);
