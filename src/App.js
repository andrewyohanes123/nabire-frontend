import React, { Component } from 'react';
import jQuery from 'jquery';
import 'semantic-ui-css/semantic.css';
// import 'semantic-ui-css/semantic.js';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import HomeForm from './pages/HomeForm';
window.jQuery = jQuery;
window.$ = jQuery;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/dashboard" component={HomeForm} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
