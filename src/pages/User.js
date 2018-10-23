import React, { Component } from 'react'
import Req from '../modules/Req';
import Token from '../modules/Token';
import defaultImg from './dummy.jpg';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "...",
      username: '....',
      password: "",
      avatar : "base64",
      loading: false
    }
  }

  componentDidMount = () => {
    this._get_user();
  }

  _get_user = () => {
    this.setState({ loading: true });
    Req.get('/api/public/check').then(resp => {
      Token.setToken(resp);
      this.setState({ ...resp.data.data, loading: false });
    });
  }

  onChange = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value })
  }

  render() {
    const { loading } = this.state;
    document.title = this.state.name;
    return (
      <div className="ui card fluid teal">
        <div className="content">
          <h1 className="header">Pengguna</h1>
          <div className="ui divider" />
          <div className="ui celled grid">
            <div className="row">
              <div className="three wide column">
                { loading &&
                  <div className="ui placeholder">
                    <div className="square image" />
                  </div>
                }
                { !loading &&
                  <img src={ this.state.avatar === 'base64' ? defaultImg : this.state.avatar} className="ui medium circular bordered image fluid" alt=""/>
                }
              </div>
              <div className="thirteen wide column">
                {!loading &&
                  <form action="" className="ui form">
                    <div className="field">
                      <label htmlFor="">Nama lengkap</label>
                      <input type="text" placeholder="Nama Lengkap" onChange={this.onChange} value={this.state.name} />
                    </div>
                    <div className="field">
                      <label htmlFor="">Username</label>
                      <input type="text" placeholder="Username" onChange={this.onChange} value={this.state.username} />
                    </div>
                    <div className="field">
                      <label htmlFor="">Password</label>
                      <input type="password" placeholder="Password" onChange={this.onChange} value={this.state.password} />
                    </div>
                  </form>
                }
                {loading &&
                  <LoadingIndicator />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const LoadingIndicator = () => {
  return (
    <div className="ui placeholder">
      <div className="paragraph">
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
    </div>
  )
}