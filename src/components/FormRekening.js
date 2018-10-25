import React, { Component, Fragment } from 'react';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class FormRekening extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts : [],
      types : [],
      name : "",
      number : "",
      type_id: 0,
      limit : 10,
      offset : 0,
      total_page : 1,
      current_page : 1
    }

    this._postAccounts = this._postAccounts.bind(this);
  }

  componentDidMount = () => {
    this._getAccounts();
    this._getTypes();
  };
  
  _getTypes = () => {
    Req.get('/api/types/', Token.sentHeader(null, null, {
      params : {
        attributes : "id,name,created_at",
        limit : 999
      }
    })).then(resp => {
      Token.setToken(resp);
      this.setState({ types : resp.data.data.rows });
    });
  }

  _getAccounts = () => {
    Req.get('/api/accounts/', Token.sentHeader(null, null, {
      params : {
        attributes : "id,name,number",
        limit : 10
      }
    })).then(resp => {
      Token.setToken(resp);
      this.setState({ accounts : resp.data.data.rows });
    }).catch(err => alert(err));
  }

  _postAccounts = (ev) => {
    ev.preventDefault();
    const {name, type_id, number} = this.state;
    Req.post('/api/accounts/', {name, type_id, number}).then(resp => {
      Token.setToken(resp);
      this._getAccounts();
      this._getTypes();
    }).catch(err => alert(err));
  }

  _onChange = (ev) => {
    this.setState({ [ev.target.name] : ev.target.value });
  }

  render() {
    return (
      <Fragment>
        <div className="three wide column">
          <div className="ui card">
            <div className="content">
              <h1 className="header">Rekening</h1>
              <form action="" className="ui form">
                <div className="field"><label htmlFor="">Nomor Rekening</label>
                  <input type="text" name="number" onChange={this._onChange} value={this.state.number} placeholder="Nomor Rekening" />
                </div>
                <div className="field"><label htmlFor="">Nama Rekening</label>
                  <input type="text" name="name" onChange={this._onChange} value={this.state.name} placeholder="Nama Rekening" />
                </div>
                <div className="field"><label htmlFor="">Tipe</label>
                  <select name="type_id" onChange={this._onChange} value={this.state.type_id} id="">
                    <option value="0">Pilih tipe rekening</option>
                    { this.state.types.map(type => (<option key={type.id + 2} value={type.id}>{type.name}</option>))}
                  </select>
                </div>
                <div className="ui divider" />
                <button onClick={this._postAccounts} className="ui button green"><i className="send icon"></i>&nbsp;Tambah</button>
              </form>
            </div>
          </div>
        </div>
        <div className="nine wide column">
          <table className="ui table inverted blue celled">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nomor Rekening</th>
                <th>Nama</th>
                <th>Tipe Rekening</th>
                <th>Edit/Hapus</th>
              </tr>
            </thead>
            <tbody>
              { this.state.accounts.length > 0 ? this.state.accounts.map((account, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{account.number}</td>
                  <td>{account.name}</td>
                  <td>{account.type !== null ? account.type.name : "Tipe"}</td>
                  <td>
                    <div className="ui buttons">
                    <button className="ui button yellow">Edit</button>
                    <button className="ui button red">Hapus</button>
                    </div>
                  </td>
                </tr>
              )) : 
                <tr>
                  <td colSpan={5} className="center aligned">Tidak ada rekening</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="5">
                  <div className="ui pagination floated right menu">
                    <a href="javascript:void(0)" className="icon item"><i className="arrow left icon"></i></a>
                    <a href="javascript:void(0)" className="icon item"><i className="chevron left icon"></i></a>
                    <a href="javascript:void(0)" className="icon item disabled">{`${this.state.current_page} / ${this.state.total_page}`}</a>
                    <a href="javascript:void(0)" className="icon item"><i className="chevron right icon"></i></a>
                    <a href="javascript:void(0)" className="icon item"><i className="arrow right icon"></i></a>
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
