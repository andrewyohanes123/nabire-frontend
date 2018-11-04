import React, { Component, Fragment } from 'react'
import ItemForm from '../components/ItemForm';
import ItemTable from '../components/ItemTable';
import FormSatuan from '../components/FormSatuan';
import { Switch, Route, NavLink } from 'react-router-dom';
import {Modal, Button, Header, Icon} from 'semantic-ui-react';
import Req from '../modules/Req';
import Token from '../modules/Token';
import FormRekening from '../components/FormRekening';
import FormTipeRekening from '../components/FormTipeRekening';

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
      current_page: 1,
      edit_mode: false,
      item: {name : ''},
      confirmModal : false
    }

    this._submitItem = this._submitItem.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.limitChange = this.limitChange.bind(this);
    this._deleteItem = this._deleteItem.bind(this);
    this._updateItem = this._updateItem.bind(this);
  }

  componentDidMount = () => {
    this._getUnits();
    this._getItems();
  }

  _getUnits = () => {
    Req.get('/api/units', Token.params({ attributes: 'root:id,name', limit: 999 })).then(resp => {
      Token.setToken(resp);
      this.setState({ units: resp.data.data.rows });
    }).catch(err => alert(err));
  }

  _getItems = () => {
    if (this.state.items === 0) this.setState({ loading: true });
    Req.get('/api/items', Token.params({
      attributes: "root:id,name,price,quantity;units:id,name",
      limit: this.state.limit,
      offset: this.state.offset,
      include : 'units'
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

  _editItem = (item) => {
    this.setState({
      item, edit_mode: true
    })
  }

  _deleteItem = ({ id }) => {
    Req.delete(`/api/items/${id}`).then(resp => {
      Token.setToken(resp);
      this.setState({ item: {}, edit_mode: false, confirmModal : false });
      this._getItems();
    })
  }

  _updateItem = ({ unit_id, name, id, price }) => {
    Req.put(`/api/items/${id}`, { unit_id, name, price }).then(resp => {
      Token.setToken(resp);
      this._getItems();
    }).catch(err => alert(err));
  }

  confirmModal = (item) => {
    this.setState({ item, confirmModal : true });
  }

  render() {
    document.title = "Data Master | Item"
    const { match } = this.props;
    return (
      <div className="ui card inverted fluid">
        <Modal dimmer="blurring" basic size="small" open={this.state.confirmModal}>
          <Header icon="trash alternate" content={`Apakah Anda yakin ingin menghapus ${this.state.item.name}?`} />
          <Modal.Actions>
            <Button basic inverted onClick={() => this.setState({ item : {name : ''}, confirmModal : false })}>
              <Icon name="remove" />&nbsp;Tidak
            </Button>
            <Button basic color="red" onClick={() => this._deleteItem(this.state.item)}>
              <Icon name="checkmark" />&nbsp;Ya
            </Button>
          </Modal.Actions>
        </Modal>
        <div className="content">
          <h1 className="header"><i className="tasks icon"></i>&nbsp;Item</h1>
          <div className="ui divider" />
          <div className="ui grid">
            <div className="three wide column">
              <div className="ui fluid vertical menu">
                <NavLink to={`${match.path}`} exact className="item"><i className="archive icon"></i>Item</NavLink>
                <NavLink to={`${match.path}/units`} exact className="item"><i className="weight icon"></i>Satuan</NavLink>
                <NavLink to={`${match.path}/accounts`} className="item"><i className="credit card icon"></i>&nbsp;Rekening</NavLink>
                <NavLink to={`${match.path}/account_types`} className="item"><i className="credit card icon"></i>&nbsp;Tipe Rekening</NavLink>
              </div>
            </div>
            <Switch>
              <Route path={`${match.path}`} exact render={() => {
                return (
                  <Fragment>
                    <div className="four wide column"><ItemForm item={this.state.item} edit={this.state.edit_mode} save={(item) => this._updateItem(item)} cancel={() => this.setState({ item: {}, edit_mode: false })} submit={(data) => this._submitItem(data)} units={this.state.units} /></div>
                    <div className="nine wide column">
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
                        offset={this.state.offset}
                        update={this._editItem}
                        delete={this.confirmModal}
                      />
                    </div>
                  </Fragment>
                )
              }} />
              <Route path={`${match.path}/units`} component={FormSatuan} />
              <Route path={`${match.path}/accounts`} exact component={FormRekening} />
              <Route path={`${match.path}/account_types`} exact component={FormTipeRekening} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
