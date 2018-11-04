import React, { Component } from 'react';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class FormPenjualan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      price_per_unit: 1000,
      total_price: 1000,
      exact_total_price: 1000,
      price : 0,
      description: "",
      item_id: 0,
      items: [],
      item: {
        id: 0,
        price: 1000,
        quantity : 1,
        unit: {
          name: "Buah",
        }
      }
    }
  }

  componentDidMount = () => {
    this._getItems();
  };

  _getItems = () => {
    Req.get('/api/items/', Token.params({ attributes: 'root:id,name,price;units:id,name', limit: 999 })).then(resp => {
      Token.setToken(resp);
      this.setState({ items: resp.data.data.rows });
    }).catch(err => alert(err));
  }

  _getItem = () => {
    const { item_id } = this.state;
    Req.get(`/api/items/${item_id}`, Token.params({ attributes: 'root:id,price,quantity;units:id,name' })).then(resp => {
      Token.setToken(resp);
      console.log(resp.data);
      this.setState({
        price_per_unit: resp.data.data.price,
        total_price: parseInt(resp.data.data.price * this.state.quantity),
        exact_total_price: parseFloat(resp.data.data.price * this.state.quantity),
        item: resp.data.data
      })
      // this.setState({ item : resp.data.data });
    }).catch(err => alert(err));
  }

  onPriceChange = (ev) => {
    this.setState({
      quantity: ev.target.value,
      total_price: parseInt(this.state.price_per_unit * Math.round(ev.target.value)),
      exact_total_price: parseFloat(this.state.price_per_unit * parseFloat(ev.target.value))
    })
  }

  _submit = (ev) => {
    ev.preventDefault();
    const { item_id, quantity, description, price } = this.state;
    Req.post('/api/sales', { item_id, quantity, description, price }).then(resp => {
      Token.setToken(resp);
      this.setState({
        quantity: 1,
        price_per_unit: 1000,
        total_price: 1000,
        exact_total_price: 1000,
        description: "",
        item_id: 0,
        item: {
          id: 0,
          price: 1000,
          unit: {
            name: "Buah"
          }
        }
      });
    }).catch(err => alert(err))
  }

  render() {
    document.title = "Form | Penjualan"
    return (
      <form className="ui form">
        <div className="field">
          <label htmlFor="">Item</label>
          <select name="item_id" onChange={ev => this.setState({ item_id: ev.target.value }, () => this._getItem())} value={this.state.item_id} id="">
            <option value="">Pilih item</option>
            {this.state.items.map(item => {
              return <option value={item.id} key={item.id}>{item.name}</option>
            })}
          </select>
        </div>
        <div className="field">
          <label htmlFor="">Jumlah item (yang akan dijual)</label>
          <div className="ui right labeled input">
            <input value={this.state.quantity} className="text-right" onChange={this.onPriceChange} name='quantity' type="number" placeholder="Jumlah item" />
            <div className="ui basic label">{this.state.item.unit.name}</div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Jumlah item (sekarang)</label>
          <div className="ui right labeled input">
            <input value={this.state.item.quantity} className="text-right" readOnly onChange={this.onPriceChange} name='quantity' type="number" placeholder="Jumlah item" />
            <div className="ui basic label">{this.state.item.unit.name}</div>
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
          <label htmlFor="">Harga sekarang</label>
          <div className="ui left labeled input">
            <div className="ui basic label">Rp.</div>
            <input type="number" onChange={(ev) => {this.setState({ price : ev.target.value })}} value={this.state.price} placeholder="Harga per item" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Total harga</label>
          <div className="ui left labeled input">
            <div className="ui basic label">Rp.</div>
            <input type="number" readOnly value={this.state.total_price} placeholder="Total Harga" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Label</label>
          <div className="ui left labeled input">
            <div className="ui basic label">Rp.</div>
            <input type="number" readOnly value={this.state.exact_total_price} placeholder="Total harga " />
          </div>
        </div>
        <div className="field">
          <label htmlFor="">Deskripsi</label>
          <textarea value={this.state.description} onChange={ev => this.setState({ description: ev.target.value })} name="" id="" cols="30" rows="5" />
        </div>
        <div className="ui divider" />
        <button onClick={this._submit} className="ui button basic green"><i className="send icon"></i>&nbsp;Tambah</button>
      </form>
    )
  }
}
