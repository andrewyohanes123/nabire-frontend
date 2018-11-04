import React, { Component } from 'react';
import moment from 'moment/min/moment-with-locales';

export default class ModalForm extends Component {
  state = {
    date : moment().format('YYYY-MM-DD'),
    amount : 0,
    description : ""
  }
  render() {
    document.title = "Form | Modal"
    return (
      <form className="ui form">
        <div className="field">
          <label htmlFor="">Tanggal</label>
          <input type="text" placeholder="Tanggal" />
        </div>
        <div className="field">
          <label htmlFor="">Nominal</label>
          <input type="text" placeholder="Nominal uang" />
        </div>
        <div className="field">
          <label htmlFor="">Keterangan</label>
          <textarea name="description" placeholder="Keterangan" id="" rows="5"/>
        </div>
      </form>
    )
  }
}
