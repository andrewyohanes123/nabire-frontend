import React, { Component, Fragment } from 'react'

export default class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : "",
      price : 0,
      unit_id : "0"
    }
  }

  onChange = (ev) => {
    this.setState({ [ev.target.name] : ev.target.value });
  }

  _submit = (ev) => {
    ev.preventDefault();
    this.setState({
      name : "",
      price : 0,
      unit_id : "0"
    });
    this.props.submit(this.state);
  }

  render() {
    return (
      <Fragment>
        <form action="" className="ui form">
          <div className="field">
            <label htmlFor="">Nama item</label>
            <input type="text" name="name" onChange={this.onChange} value={this.state.name} placeholder="Nama item" />
          </div>
          <div className="field">
            <label htmlFor="">Harga</label>
            <input type="number" name="price" onChange={this.onChange} value={this.state.price} placeholder="Harga item" />
          </div>
          <div className="field">
            <label htmlFor="">Satuan</label>
            <select name="unit_id" onChange={this.onChange} value={this.state.unit_id} id="">
              <option value="0">Pilih satuan</option>
              {this.props.units.map((unit, index) => {
                return <option value={unit.id} key={index} id="">{unit.name}</option>
              })}
            </select>
          </div>
          <div className="ui divider"></div>
          <button className="ui green button" onClick={this._submit} ><i className="send icon"></i>&nbsp;Tambah</button>
        </form>
      </Fragment>
    )
  }
}
