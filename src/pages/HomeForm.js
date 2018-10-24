import React, { Component } from 'react';
import TabNav from '../components/TabNav';
import CardForm from '../components/CardForm';
import User from './User';
import Item from './Item';
import {Switch, Route } from 'react-router-dom';

export default class HomeForm extends Component {
  render() {
    document.title = "Home";
    const { match } = this.props;
    return (
      <div className="pt">
        <div className="ui container home-container">
          <TabNav match={match} />
          <Switch>
            <Route path={`${match.path}`} component={CardForm} />
            <Route path={`${match.path}/user`} exact component={User} />
            <Route path={`${match.path}/item`} component={Item} />
          </Switch>
        </div>
      </div>
    )
  }
}
