import React, { Component, Fragment } from 'react'
import Req from '../modules/Req';
import Token from '../modules/Token';
import defaultImg from './dummy.jpg';
import FileBase64 from 'react-file-base64';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "...",
      username: '....',
      password: "",
      avatar: "base64",
      loading: false
    }
    this._upload_profile = this._upload_profile.bind(this);
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

  _updateUser = (ev = {}) => {
    if (Object.keys(ev).length !== 0) ev.preventDefault();
    const { name, type, avatar, username, password, id } = this.state;
    Req.put(`/api/users/${id}`, { name, type, avatar, password, username }).then(resp => {
      Token.setToken(resp);
      this.setState({ password: "" });
    }).catch(err => alert(err))
  }

  _upload_profile = (file) => {
    this.setState({ avatar : file.base64 }, () => this._updateUser());
    this._get_user();
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
                {loading &&
                  <div className="ui placeholder">
                    <div className="square image" />
                  </div>
                }
                {!loading &&
                  <Fragment>
                    <img onClick={() => this.avatar.click()} src={this.state.avatar === 'base64' ? defaultImg : this.state.avatar} className="ui medium circular bordered image fluid" alt="" />
                    <FileBase64 onDone={this._upload_profile} style={{ display: 'none' }} ref={ref => this.avatar = ref} name="" id="" />
                  </Fragment>
                }
              </div>
              <div className="thirteen wide column">
                {!loading &&
                  <form action="" className="ui form">
                    <div className="field">
                      <label htmlFor="">Nama lengkap</label>
                      <input type="text" name="name" placeholder="Nama Lengkap" onChange={this.onChange} value={this.state.name} />
                    </div>
                    <div className="field">
                      <label htmlFor="">Username</label>
                      <input type="text" name="username" placeholder="Username" onChange={this.onChange} value={this.state.username} />
                    </div>
                    <div className="field">
                      <label htmlFor="">Password</label>
                      <input type="password" name="password" placeholder="Password" onChange={this.onChange} value={this.state.password} />
                    </div>
                    <div className="ui divider"></div>
                    <button onClick={this._updateUser} className="ui button yellow"><i className="save icon"></i>&nbsp;Simpan</button>
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