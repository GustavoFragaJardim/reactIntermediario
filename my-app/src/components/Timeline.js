import React, { Component } from 'react';
import Foto from './Foto';
import { withRouter } from "react-router-dom";
import lsbridge from 'lsbridge';

class Timeline extends Component {

    componentWillMount() {
        lsbridge.subscribe('search', (param) => {
            this.setState({ fotos: param.pics })
        })
    }

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
    }

    searchPhotos(nextProps) {
        if (nextProps && nextProps.match && nextProps.match.params && nextProps.match.params.login !== undefined) {
            this.login = `http://localhost:8080/api/public/fotos/${nextProps.match.params.login}`
        } else if ((localStorage.getItem('auth-token') && this.props && this.props.match && this.props.match.params && !this.props.match.params.login) || (nextProps && nextProps.match && nextProps.match.params && nextProps.match.params.login === undefined)) {
            this.login = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
        } else if (this.props && this.props.match && this.props.match.params && this.props.match.params.login) {
            this.login = `http://localhost:8080/api/public/fotos/${this.props.match.params.login}`
        }
        fetch(this.login)
            .then(response => response.json())
            .then(fotos => {
                this.setState({ fotos: fotos });
            }).catch((err) => {
                this.props.history.push({ pathname: "/", state: { detail: ((localStorage.getItem('auth-token') && this.props && this.props.match && this.props.match.params && !this.props.match.params.login)) ? "Você precisa estar logado para acessar a timeline" : "Algo de errado aconteceu", from: 'timeline' } })
            });
    }

    componentDidMount() {
        this.searchPhotos()
    }

    componentWillReceiveProps(nextProps) {
        this.searchPhotos(nextProps)
    }

    render() {
        return (
            <div className="fotos container">

                {
                    this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} />)
                }
            </div>
        )
    }
}
export default withRouter(Timeline);