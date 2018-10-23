import React, { Component } from 'react'
import ItemForm from '../components/ItemForm';
import ItemTable from '../components/ItemTable';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
      items: [],
      limit: 10,
      offset: 0,
      loading: false,
      total: 1,
      total_pages: 1,
      current_page: 1
    }

    this._submitItem = this._submitItem.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.limitChange = this.limitChange.bind(this);
  }

  componentDidMount = () => {
    this._getUnits();
    this._getItems();
  }

  _getUnits = () => {
    Req.get('/api/units', Token.sentHeader(null, null, { params: { attributes: 'id,name', limit: 999 } })).then(resp => {
      Token.setToken(resp);
      this.setState({ units: resp.data.data.rows });
    }).catch(err => alert(err));
  }

  _getItems = () => {
    if (this.state.items === 0) this.setState({ loading: true });
    Req.get('/api/items', Token.sentHeader(null, null, {
      params: {
        attributes: "id,name,price",
        limit: this.state.limit,
        offset: this.state.offset
      }
    })).then(resp => {
      Token.setToken(resp);
      const { rows, count } = resp.data.data;
      this.setState({ items: rows, total: count, total_pages: Math.ceil(count / this.state.limit), loading: false });
    }).catch(err => alert(err));
  }

  _submitItem = (data) => {
    Req.post('/api/items', data).then(resp => {
      Token.setToken(resp);
      this._getItems();
    }).catch(err => {
      alert(err);
    })
  }

  nextPage = () => {
    let {current_page, total_pages, limit} = this.state;
    current_page++;
    if (current_page > total_pages) current_page = total_pages;
    this.setState({ offset : (current_page - 1) * limit, current_page}, () => this._getItems());
  }

  prevPage = () => {
    let {current_page, limit} = this.state;
    current_page--;
    if (current_page <= 0) current_page = 1;
    this.setState({ offset : (current_page - 1) * limit, current_page}, () => this._getItems());
  }

  firstPage = () => {
    const { limit } = this.state;
    this.setState({ offset: (1 - 1) * limit, current_page : 1 }, () => this._getItems());
  }

  lastPage = () => {
    let { total_pages, limit } = this.state;
    this.setState({ offset: (total_pages - 1) * limit, current_page : total_pages }, () => this._getItems());
  }

  limitChange = (ev) => {
    this.setState({ offset : 0, limit : ev.target.value, current_page : 1 }, () => this._getItems());
  }

  render() {
    document.title = "Item"
    return (
      <div className="ui card inverted fluid">
        <div className="content">
          <h1 className="header"><i className="tasks icon"></i>&nbsp;Item</h1>
          <div className="ui divider" />
          <div className="ui grid">
            <div className="five wide column"><ItemForm submit={(data) => this._submitItem(data)} units={this.state.units} /></div>
            <div className="eleven wide column">
              <ItemTable
                total_pages={this.state.total_pages}
                current_page={this.state.current_page}
                loading={this.state.loading}
                items={this.state.items}
                nextPage={this.nextPage}
                prevPage={this.prevPage}
                firstPage={this.firstPage}
                lastPage={this.lastPage}
                limitChange={this.limitChange}
                limit={this.state.limit}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
