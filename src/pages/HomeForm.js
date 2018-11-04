import React, { Component } from 'react';
import TabNav from '../components/TabNav';
import CardForm from '../components/CardForm';
import User from './User';
import Item from './Item';
import {Switch, Route, Redirect } from 'react-router-dom';
import StokTable from '../components/StokTable';

export default class HomeForm extends Component {
  state = {
    login : true
  }

  constructor(props) {
    super(props);

    this._forceLogout = this._forceLogout.bind(this);
  }

  _check = () => {
    if (!localStorage.getItem('x-access-token') && !localStorage.getItem('x-refresh-token')) this.setState({ login : false });
  }

  _forceLogout = () => {
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    this._check();
  }

  render() {
    document.title = "Home";
    const { match } = this.props;
    if (!this.state.login) return (<Redirect to="/" />)
    return (
      <div className="pt">
        <div className="ui container home-container">
          <TabNav forceLogout={() => this._forceLogout()} match={match} />
          <Switch>
            <Route path={`${match.path}`} exact render={() => {
              return (
                <div className="ui card fluid blue">
                  <div className="content">
                    <h1 className="header"><i className="dashboard icon"></i>&nbsp;Dashboard</h1>
                  </div>
                </div>
              )
            }} />
            <Route path={`${match.path}/form`} component={CardForm} />
            <Route path={`${match.path}/user`} exact component={User} />
            <Route path={`${match.path}/item`} component={Item} />
            <Route path={`${match.path}/stocks`} exact component={StokTable} />
          </Switch>
        </div>
      </div>
    )
  }
}
