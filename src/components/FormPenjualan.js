import React, { Component } from 'react';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class FormPenjualan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      price_per_unit: 1,
      total_price: 1,
      exact_total_price: 1,
      description: "",
      item_id: 0,
      items : [],
      item : {
        id : 0,
        price : "",
      }
    }
  }

  componentDidMount = () => {
    this._getItems();
  };
  
  _getItems = () => {
    Req.get('/api/items/', Token.sentHeader(null, null, {params : { attributes : 'id,name,price', limit : 999 }})).then(resp => {
      Token.setToken(resp);
      this.setState({ items : resp.data.data.rows });
    }).catch(err => alert(err));
  }

  _getItem = () => {
    const {item_id} = this.state;
    Req.get(`/api/items/${item_id}`, Token.sentHeader(null, null, {params : { attributes : 'id,price' }})).then(resp => {
      Token.setToken(resp);
      console.log(resp.data);
      // this.setState({ item : resp.data.data });
    }).catch(err => alert(err));
  }

  onPriceChange = (ev) => {
    this.setState({
      price_per_unit : ev.target.value
    })
  }

  render() {
    return (
      <form className="ui form">
        <div className="field">
          <label htmlFor="">Item</label>
          <select name="item_id" onChange={ev => this.setState({ item_id : ev.target.value }, () => this._getItem())} value={this.state.item_id} id="">
            <option value="">Pilih item</option>
            { this.state.items.map(item => {
              return <option value={item.id} key={item.id}>{item.name}</option>
            }) }
          </select>
        </div>
        <div className="field">
          <label htmlFor="">Jumlah item</label>
          <div className="ui right labeled input">
            <input value={this.state.quantity} name='quantity' type="number" placeholder="Jumlah item" />
            <div className="ui basic label">..</div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Harga per item</label>
          <div className="ui left labeled input">
            <div className="ui basic label">Rp.</div>
            <input type="number" readOnly value={this.state.item.price} placeholder="Harga per item" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Total harga</label>
          <div className="ui left labeled input">
            <div className="ui basic label">Rp.</div>
            <input type="number" value={parseInt(this.state.item.price * Math.round(this.state.quantity))} placeholder="Total Harga" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Label</label>
          <div className="ui left labeled input">
            <div className="ui basic label">Rp.</div>
            <input type="number" value={parseFloat(this.state.item.price * parseFloat(this.state.quantity))} placeholder="Total harga " />
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Deskripsi</label>
          <textarea name="" id="" cols="30" rows="5" />
        </div>
      </form>
    )
  }
}
