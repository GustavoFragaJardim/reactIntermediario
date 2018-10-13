import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import lsbridge from 'lsbridge';

class Header extends Component {
    render() {
        return (
            <header className="foto-header">
                <figure className="foto-usuario">
                    <img key={this.props.foto.urlPerfil} src={this.props.foto.urlPerfil} alt="foto do usuario" />
                    <figcaption className="foto-usuario">
                        <Link to={`/timeline/${this.props.foto.loginUsuario}`}>{this.props.foto.loginUsuario}</Link>
                    </figcaption>
                </figure>
                <time key={this.props.foto.horario} className="foto-data">{this.props.foto.horario}</time>
            </header>
        );
    }
}


class FotoInfo extends Component {

    constructor(props) {
        super(props);
        this.state = { likers: this.props.foto.likers, comment: this.props.foto.comentarios }
    }

    componentWillMount() {
        lsbridge.subscribe('updateLiker', (param) => {
            if (this.props.foto.id === param.idFoto) {
                const hasliker = this.state.likers.find(liker => liker.login === param.liker.login)
                if (hasliker === undefined) {
                    const newLiker = this.state.likers.concat(param.liker)
                    this.setState({ likers: newLiker })
                } else {
                    const newLiker = this.state.likers.filter(liker => liker.login !== param.liker.login)
                    this.setState({ likers: newLiker })
                }
            }
        })


        lsbridge.subscribe('updateComment', (param) => {
            if (this.props.foto.id === param.idFoto) {
                const newComment = this.state.comment.concat(param.comment)
                this.setState({
                    comment: newComment
                })
            }
        })

    }
    render() {
        return (
            <div className="foto-info">
                <div className="foto-info-likes">
                    {
                        this.state.likers.map(liker => {
                            return <Link key={liker.login} to={`/timeline/${liker.login}`}>{liker.login},</Link>
                        })
                    }
                    curtiram
                   </div>
                <p className="foto-info-legenda">
                    <a className="foto-info-autor" key={this.props.foto.comentario} >{this.props.foto.loginUsuario} </a>
                    {this.props.foto.comentario}
                </p>
                <ul className="foto-info-comentarios">
                    {
                        this.state.comment.map(comentario => {
                            return (
                                <li key={comentario.id} className="comentario">
                                    <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login} </Link>
                                    {comentario.texto}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

class FotoUpdate extends Component {

    constructor(props) {
        super(props)
        this.state = { likeada: this.props.foto.likeada }
    }

    liker(event) {
        event.preventDefault();
        fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Não foi possível likar')
                }
            }).then((liker) => {
                this.setState({ likeada: !this.state.likeada })

                lsbridge.send('updateLiker', { liker: liker, idFoto: this.props.foto.id })
            })
    }

    commentFunction(event) {
        event.preventDefault()
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: this.comment.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }
        fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Impossível comentar")
                }
            }).then(comment => {
                lsbridge.send('updateComment', { comment, idFoto: this.props.foto.id })
            })
    }

    render() {
        return (
            <section className="fotoAtualizacoes">
                <a onClick={this.liker.bind(this)} href="#" className={this.state.likeada ? 'fotoAtualizacoes-like fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
                <form onSubmit={this.commentFunction.bind(this)} className="fotoAtualizacoes-form">
                    <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comment = input} />
                    <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
                </form>
            </section>
        )
    }
}


export default class Foto extends Component {

    render() {
        return (
            <div className="foto">
                <Header foto={this.props.foto} />
                <img alt="foto" key={this.props.foto.id} className="foto-src" src={this.props.foto.urlFoto} />
                <FotoInfo foto={this.props.foto} />
                <FotoUpdate foto={this.props.foto} />
            </div>
        )
    }
}