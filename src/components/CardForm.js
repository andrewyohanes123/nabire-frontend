import React, { Component } from 'react'
import FormPenjualan from './FormPenjualan';

export default class CardForm extends Component {
  render() {
    return (
      <div className="ui vertically divided grid mt">
        <div className="three column row">
          <div className="column">
            <div className="ui raised red card fluid">
              <div className="content">
                <h3 className="ui header">Rekening</h3>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui raised teal card fluid">
              <div className="content">
                <h3 className="ui header">Form Penjualan</h3>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui raised blue card fluid">
              <div className="content">
                <h3 className="ui header">Form Pembelian</h3>
                <div className="ui divider" />
                <FormPenjualan />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
