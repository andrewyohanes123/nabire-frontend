import React, { Component } from 'react'
import {NavLink} from 'react-router-dom';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class TabNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user : {
        name : ""
      },
      loading : false
    }
  }

  componentDidMount = () => {
    this._check();
  }

  _check = () => {
    this.setState({ loading : true })
    Req.get('/api/public/check').then(resp => {
      Token.setToken(resp);
      this.setState({ user : resp.data.data, loading : false });
    }).catch(err => {
      alert(err);
    })
  }

  render() {
    return (
      <div>
        <div className="ui grey inverted menu">
          <NavLink to={`${this.props.match.path}`} exact className="item"><i className="newspaper outline icon"></i>&nbsp;Form</NavLink>
          <NavLink to={`${this.props.match.path}/item`} exact className="item"><i className="tasks icon"></i>&nbsp;Item</NavLink>
          <NavLink to={`${this.props.match.path}/user`} exact className="item"><i className="user icon"></i>&nbsp;{this.state.loading ? <LoadingIndicator /> : this.state.user.name}</NavLink>
        </div>
      </div>
    )
  }
}

const LoadingIndicator = () => {
  return (
    <div className="ui inverted placeholder">
      <div className="paragraph">
        <div className="line"></div>
      </div>
    </div>
  )
}