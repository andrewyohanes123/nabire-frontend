import React, { Component } from 'react'
import {Redirect} from 'react-router-dom';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username : "",
      password : "",
      login : false
    }
  }

  onChange = (ev) => {
    this.setState({
      [ev.target.name] : ev.target.value
    });
  }

  componentDidMount = () => {
    this._check();
  };

  login = (ev) => {
    ev.preventDefault();
    const {username, password} = this.state;
    Req.post('/api/public/login',{username, password}).then(resp => {    
      Token.setLoginToken(resp.data.data);    
      this.setState({ login : true });
    }).catch(err => alert(err));
  }

  _check = () => {
    if (localStorage.getItem('x-access-token') && localStorage.getItem('x-refresh-token')) this.setState({ login : true })
  }

  render() {
    document.title = "Login";
    if (this.state.login) return (<Redirect to="/dashboard" />)
    return (
    <div className="ui container login-container aligned">
      <div className="ui card fluid centered">
        <div className="content">
          <h4 className="header">Login</h4>
          <form action="" className="ui form">
            <div className="field">
              <label htmlFor="">Username</label>
              <input type="text" name="username" onChange={this.onChange} value={this.state.username} placeholder="Username" />
            </div>
            <div className="field">
              <label htmlFor="">Password</label>
              <input type="password" name="password" onChange={this.onChange} value={this.state.password} placeholder="Password" />
            </div>
            <div className="ui divider" />
            <button type="submit" onClick={this.login} className="ui fluid button teal">Login</button>
          </form>
        </div>
      </div>
    </div>
    )
  }
}
