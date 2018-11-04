import React, { Component } from 'react'
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class FormPembelian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice_number: '',
      quantity: 1,
      transfer: 1,
      description: "",
      item_id : 0,
      items : [],
      item : {},
      price : 0
    }
  }

  componentDidMount = () => {
    this._getItems();
  };
  
  _getItems = () => {
    Req.get('/api/items', Token.params({attributes : 'root:id,name,price;units:id,name', limit : 9999})).then(resp => {
      Token.setToken(resp);
      this.setState({ items : resp.data.data.rows});
    }).catch(err => alert(err));
  }

  _onChange = (ev) => {
    this.setState({ [ev.target.name] : ev.target.value });
  }

  _postItem = (ev) => {
    ev.preventDefault();
    const {invoice_number,quantity,transfer,description,item_id, price} = this.state;
    Req.post('/api/purchases', {invoice_number,quantity,transfer,description,item_id, price}).then(resp => {
      Token.setToken(resp);
      this.setState({invoice_number: 0,quantity: 0,transfer: 0,description: 0,item_id: 0});
    }).catch(err => alert(err));
  }

  render() {
    const {items} = this.state;
    return (
      <form className="ui form">
        <div className="ui field">
          <label htmlFor="">Item</label>
          <select onChange={(ev) => this.setState({ item_id : ev.target.value })} className="ui input" name="" id="">
            <option value="">Pilih item</option>
            { items.map(item => {
              return(
                <option key={item.id} value={item.id}>{item.name}</option>
              )
            })
            }
          </select>
        </div>
        <div className="ui field">
          <label htmlFor="">Nomor Faktur</label>
          <input type="text" onChange={this._onChange} name="invoice_number" placeholder="Nomor Faktur" value={this.state.invoice_number} />
        </div>
        <div className="ui field">
          <label htmlFor="">Jumlah item</label>
          <input type="number" onChange={this._onChange} name="quantity" placeholder="Jumlah item" value={this.state.quantity} />
        </div>
        <div className="ui field">
          <label htmlFor="">Harga</label>
          <input type="number" onChange={this._onChange} name="price" placeholder="Nominal transfer" value={this.state.price} />
        </div>
        <div className="ui field">
          <label htmlFor="">Nominal tranfer</label>
          <input type="number" onChange={this._onChange} name="transfer" placeholder="Nominal transfer" value={this.state.transfer} />
        </div>
        <div className="ui field">
          <label htmlFor="">Deskripsi</label>
          <textarea name="description" onChange={this._onChange} placeholder="Deskripsi pembelian" value={this.state.description} style={{ resize : 'none' }} rows="5" />
        </div>
        <div className="ui divider"></div>
        <button onClick={this._postItem} className="ui button green"><i className="send icon"></i>&nbsp;Tambah</button> 
      </form>
    )
  }
}
