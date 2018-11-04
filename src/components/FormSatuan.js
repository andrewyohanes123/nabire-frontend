import React, { Component, Fragment } from 'react';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class FormSatuan extends Component {
  state = {
    name: "",
    units: [],
    limit: 10,
    offset: 0,
    loading: false,
    total: 1,
    total_pages: 1,
    current_page: 1,
    unit: {},
    edit_mode: false
  }

  constructor(props) {
    super(props);

    this._postUnits = this._postUnits.bind(this);
    this._getUnits = this._getUnits.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this._removeItem = this._removeItem.bind(this);
    this._updateUnit = this._updateUnit.bind(this);
  }

  componentDidMount = () => {
    this._getUnits();
  };

  _postUnits = (ev) => {
    ev.preventDefault();
    const { name } = this.state;
    Req.post('/api/units', { name }).then(resp => {
      Token.setToken(resp);
      this.setState({ name: "" });
      this._getUnits();
    }).catch(err => alert(err));
  }

  _getUnits = () => {
    if (this.state.units.length > 0) this.setState({ loading: true });
    Req.get('/api/units', Token.params({
      attributes: 'root:id,name',
      limit: this.state.limit,
      offset: this.state.offset
    })).then(resp => {
      Token.setToken(resp);
      this.setState({ units: resp.data.data.rows, loading: false, total_pages: Math.ceil(resp.data.data.count / this.state.limit) });
    }).catch(err => alert(err));
  }

  nextPage = () => {
    let { current_page, total_pages, limit } = this.state;
    current_page++;
    if (current_page > total_pages) current_page = total_pages;
    this.setState({ offset: (current_page - 1) * limit, current_page }, () => this._getUnits());
  }

  prevPage = () => {
    let { current_page, limit } = this.state;
    current_page--;
    if (current_page <= 0) current_page = 1;
    this.setState({ offset: (current_page - 1) * limit, current_page }, () => this._getUnits());
  }

  firstPage = () => {
    const { limit } = this.state;
    this.setState({ offset: (1 - 1) * limit, current_page: 1 }, () => this._getUnits());
  }

  lastPage = () => {
    let { total_pages, limit } = this.state;
    this.setState({ offset: (total_pages - 1) * limit, current_page: total_pages }, () => this._getUnits());
  }

  _removeItem = (id) => {
    Req.delete(`/api/units/${id}`).then(resp => {
      Token.setToken(resp);
      this._getUnits();
    }).catch(err => alert(err));
  }

  _updateUnit = (ev) => {
    ev.preventDefault();
    const { id } = this.state.unit;
    const { name } = this.state;
    Req.put(`/api/units/${id}`, { name }).then(resp => {
      Token.setToken(resp);
      this.setState({ name: "", edit_mode: false, unit: {} });
      this._getUnits();
    }).catch(err => alert(err));
  }

  render() {
    return (
      <Fragment>
        <div className="four wide column">
          <form action="" className="ui form">
            <div className="field">
              <label htmlFor="">Satuan</label>
              <input value={this.state.name} onChange={(ev) => this.setState({ name: ev.target.value })} placeholder="Satuan pengukuran" type="text" />
            </div>
            {!this.state.edit_mode && <button onClick={this._postUnits} className="ui button green"><i className="send icon"></i>&nbsp;Tambah</button>}
            {this.state.edit_mode &&
              <Fragment>
                <button onClick={() => this.setState({ edit_mode: false, unit: {}, name: "" })} className="ui button basic dark">Batal</button>
                <button onClick={this._updateUnit} className="ui button basic yellow">Simpan</button>
              </Fragment>}
          </form>
        </div>
        <div className="nine wide column">
          <table className="ui table celled inverted blue">
            <thead>
              <tr>
                <th>No.</th>
                <th>Satuan</th>
                <th>Edit/Hapus</th>
              </tr>
            </thead>
            <tbody>
              {this.state.loading &&
                <tr>
                  <td colSpan={3} className="center aligned">Loading</td>
                </tr>
              }
              {!this.state.loading &&
                this.state.units.map((unit, index) => (<tr key={index}>
                  <td>{index + this.state.offset + 1}</td>
                  <td>{unit.name}</td>
                  <td>
                    <div className="ui buttons">
                      <button onClick={() => this.setState({ name: unit.name, unit, edit_mode: true })} className="ui button yellow">Edit</button>
                      <button onClick={() => this._removeItem(unit.id)} className="ui button red">Hapus</button>
                    </div>
                  </td>
                </tr>))
              }
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3}>
                  <div className="ui pagination floated right menu">
                    <a href="javascript:void(0)" onClick={this.firstPage} className="icon item"><i className="arrow left icon"></i></a>
                    <a href="javascript:void(0)" onClick={this.prevPage} className="icon item"><i className="chevron left icon"></i></a>
                    <a href="javascript:void(0)" className="icon item disabled">{this.state.current_page}/{this.state.total_pages}</a>
                    <a href="javascript:void(0)" onClick={this.nextPage} className="icon item"><i className="chevron right icon"></i></a>
                    <a href="javascript:void(0)" onClick={this.lastPage} className="icon item"><i className="arrow right icon"></i></a>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </Fragment>
    )
  }
}
