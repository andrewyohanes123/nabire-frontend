import React, { Component, Fragment } from 'react';
import Req from '../modules/Req';
import Token from '../modules/Token';

export default class FormTipeRekening extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: [],
      name: "",
      limit: 10,
      offset: 0,
      total_page: 1,
      current_page: 1,
      loading: false
    }

    this._postType = this._postType.bind(this);
  }

  componentDidMount = () => {
    this._getTypes();
  };

  _getTypes = () => {
    this.setState({ loading: true });
    Req.get('/api/types/', Token.sentHeader(null, null, {
      params: {
        attributes: "id,name,created_at",
        limit: this.state.limit,
        offset: this.state.offset
      }
    })).then(resp => {
      Token.setToken(resp);
      this.setState({ types: resp.data.data.rows, loading: false });
    });
  }

  _postType = (ev) => {
    ev.preventDefault();
    const { name } = this.state;
    Req.post('/api/types/', { name }).then(resp => {
      Token.setToken(resp);
      this.setState({ name: "" })
      this._getTypes();
    }).catch(err => alert(err));
  }

  render() {
    return (
      <Fragment>
        <div className="three wide column">
          <div className="ui card">
            <div className="content">
              <h1 className="header">Rekening</h1>
              <form action="" className="ui form">
                <div className="field"><label htmlFor="">Tipe Rekening</label>
                  <input type="text" value={this.state.name} onChange={ev => this.setState({ name: ev.target.value })} placeholder="Tipe Rekening" />
                </div>
                <div className="ui divider" />
                <button onClick={this._postType} className="ui button green"><i className="send icon"></i>&nbsp;Tambah</button>
              </form>
            </div>
          </div>
        </div>
        <div className="nine wide column">
          <table className="ui table inverted blue celled">
            <thead>
              <tr>
                <th>No.</th>
                <th>Tipe Rekening</th>
                <th>Edit/Hapus</th>
              </tr>
            </thead>
            <tbody>
              {this.state.loading &&
                <tr>
                  <td colSpan="3" className="center aligned">Loading</td>
                </tr>
              }
              {!this.state.loading &&
                <Fragment>
                  {this.state.types.length > 0 ? this.state.types.map((type, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{type.name}</td>
                      <td>
                        <div className="ui buttons">
                          <button className="ui button yellow">Edit</button>
                          <button className="ui button red">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  )) : <tr>
                      <td colSpan="3" className="center aligned" >Tidak ada tipe rekening</td>
                    </tr>}
                </Fragment>
              }</tbody>
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
