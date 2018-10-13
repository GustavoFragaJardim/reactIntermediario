import React, { Component } from 'react';
import lsbridge from 'lsbridge';

export default class Header extends Component {

    search(event) {
        event.preventDefault()
        fetch(`http://localhost:8080/api/public/fotos/${this.searchedLogin.value}`)
            .then(res => res.json())
            .then(pics => {
                lsbridge.send('search', { pics })
            })
    }



    render() {
        return (
            <header className="header container">
                <h1 className="header-logo">Instagram</h1>
                <form className="header-busca" onSubmit={this.search.bind(this)}>
                    <input type="text" name="search" placeholder="Pesquisa" ref={input => this.searchedLogin = input} className="header-busca-campo" />
                    <input type="submit" value="Buscar" className="header-busca-submit" />
                </form>
                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <a href="#">♡</a>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }
}