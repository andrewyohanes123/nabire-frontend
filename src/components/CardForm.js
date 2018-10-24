import React, { Component } from 'react'
import {Switch, Route, NavLink} from 'react-router-dom';
import FormPenjualan from './FormPenjualan';
import FormPembelian from './FormPembelian';

export default class CardForm extends Component {
  render() {
    const {match} = this.props;
    return (
      <div className="ui grid mt">
        <div className="three wide column">
          <div className="ui vertical fluid menu">
            <NavLink to={`${match.path}/purchases`} className="item"><i className="money icon"></i>&nbsp;Pembelian</NavLink>
            <NavLink to={`${match.path}/sales`} className="item"><i className="box icon"></i>&nbsp;Penjualan</NavLink>
            <NavLink to={`${match.path}/accounts`} className="item"><i className="credit card icon"></i>&nbsp;Rekening</NavLink>
          </div>
        </div>
        <div className="thirteen wide column">
          <div className="ui card fluid blue">
            <div className="content">
              <Switch>
                <Route path={`${match.path}/purchases`} exact component={FormPembelian} />
                <Route path={`${match.path}/sales`} exact component={FormPenjualan} />
                <Route path={`${match.path}/accounts`} exact render={() => {return (<div className="ui card fluid">
                  <div className="content">
                    <h1 className="header">Rekening</h1>
                  </div> 
                </div>)}} />
              </Switch>
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}
