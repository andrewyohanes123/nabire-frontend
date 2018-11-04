import React, { Component, Fragment } from 'react';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class StokTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      current_page: 1,
      offset: 0,
      limit: 10,
      loading: false,
      total: 1,
      total_pages: 1,
      q: ""
    }

    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.limitChange = this.limitChange.bind(this);
    this._search = this._search.bind(this);
  }

  componentDidMount = () => {
    this._getItems();
  }

  _getItems = () => {
    if (this.state.items.length === 0) this.setState({ loading: true });
    Req.get('/api/items', Token.params({
      attributes: "root:id,name,price,quantity;units:id,name",
      limit: this.state.limit,
      offset: this.state.offset,
      filter: `root:name[like]${this.state.q};units:name[or_like]${this.state.q}`,
      include: 'units'
    })).then(resp => {
      Token.setToken(resp);
      const { rows, count } = resp.data.data;
      this.setState({ items: rows, total: count, total_pages: Math.ceil(count / this.state.limit), loading: false });
    }).catch(err => alert(err));
  }

  nextPage = () => {
    let { current_page, total_pages, limit } = this.state;
    current_page++;
    if (current_page > total_pages) current_page = total_pages;
    this.setState({ offset: (current_page - 1) * limit, current_page }, () => this._getItems());
  }

  prevPage = () => {
    let { current_page, limit } = this.state;
    current_page--;
    if (current_page <= 0) current_page = 1;
    this.setState({ offset: (current_page - 1) * limit, current_page }, () => this._getItems());
  }

  firstPage = () => {
    const { limit } = this.state;
    this.setState({ offset: (1 - 1) * limit, current_page: 1 }, () => this._getItems());
  }

  lastPage = () => {
    let { total_pages, limit } = this.state;
    this.setState({ offset: (total_pages - 1) * limit, current_page: total_pages }, () => this._getItems());
  }

  limitChange = (ev) => {
    this.setState({ offset: 0, limit: ev.target.value, current_page: 1 }, () => this._getItems());
  }

  _search = (ev) => {
    this.setState({ q: ev.target.value }, () => this._getItems());
  }

  render() {
    document.title = "Form | Persediaan barang"
    return (
      <div className="ui card fluid">
        <div className="content">
          <div className="ui input right floated mb mt"><input type="text" placeholder="Cari item" value={this.state.q} onChange={this._search} /></div>
          {/* <h1 className="ui small header"><i className="boxes icon"></i>&nbsp;Persediaan Barang</h1> */}
          {/* <div className="ui divider" /> */}
          <table className="ui table celled striped red">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama item</th>
                <th>Jumlah item</th>
                <th>Satuan</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              {this.state.loading &&
                <tr>
                  <td colSpan={5} className="center aligned"><div className="ui active small inline loader" />&nbsp;Loading</td>
                </tr>
              }
              {!this.state.loading &&
                <Fragment>
                  {this.state.items.length > 0 ? this.state.items.map((item, i) => (
                    <tr>
                      <td>{i + this.state.offset + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit.name}</td>
                      <td>Rp. {item.price}</td>
                    </tr>
                  )) : <tr>
                      <td colSpan={5} className="center aligned">Tidak ada stok</td>
                    </tr>}
                </Fragment>
              }
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2}>
                  <div className="ui labeled input">
                    <div className="ui label label">Limit</div>
                    <select name="" onChange={this.limitChange} value={this.state.limit} id="">
                      {
                        Array.apply(0, Array(5)).map((x, i) => {
                          return <option key={i} value={(i + 1) * 5}>{(i + 1) * 5}</option>
                        })
                      }
                    </select>
                  </div>
                </th>
                <th colSpan={3}>
                  <div className="ui pagination right floated menu">
                    <a href="javascript:void(0)" onClick={this.firstPage} className="item"><i className="arrow left icon"></i></a>
                    <a href="javascript:void(0)" onClick={this.prevPage} className="item"><i className="chevron left icon"></i></a>
                    <a href="javascript:void(0)" className="item disabled">{`${this.state.current_page} / ${this.state.total_pages}`}</a>
                    <a href="javascript:void(0)" onClick={this.nextPage} className="item"><i className="chevron right icon"></i></a>
                    <a href="javascript:void(0)" onClick={this.lastPage} className="item"><i className="arrow right icon"></i></a>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }
}
