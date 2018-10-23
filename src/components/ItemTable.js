import React, { Component, Fragment } from 'react'

export default class ItemTable extends Component {
  render() {
    const { loading, items } = this.props;
    return (
      <Fragment>
        <table className="ui celled blue inverted striped table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Satuan</th>
              <th>Harga</th>
              <th>Edit/Hapus</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr>
              <td colSpan="5">
                <div className="ui fluid placeholder">
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
              </td>
            </tr>}
            {!loading &&
              <Fragment>
                {items.length === 0 ? <tr>
                  <td colSpan="5"><p className="centered">Tidak ada item</p></td>
                </tr> :
                  items.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.unit.name}</td>
                        <td>Rp. {item.price}</td>
                        <td>
                          <div className="ui buttons">
                            <button className="ui button orange">Edit</button>
                            <button className="ui button red">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </Fragment>
            }
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">
                <div className="ui labeled input">
                  <div className="ui label label">Limit</div>
                  <select name="" onChange={this.props.limitChange} value={this.props.limit} id="">
                    {
                      Array.apply(0, Array(5)).map((x, i) => {
                        return <option key={i} value={(i + 1) * 5}>{(i + 1) * 5}</option>
                      })
                    }
                  </select>
                </div>
              </th>
              <th colSpan="3">
                <div className="class ui pagination right floated menu">
                  <a href="javascript:void(0)" onClick={this.props.firstPage} className="icon item"><i className="arrow left icon"></i></a>
                  <a href="javascript:void(0)" onClick={this.props.prevPage} className="icon item"><i className="chevron left icon"></i>&nbsp;Prev</a>
                  <a href="javascript:void(0)" className="icon item disabled">{this.props.current_page}/{this.props.total_pages}</a>
                  <a href="javascript:void(0)" onClick={this.props.nextPage} className="icon item">Next&nbsp;<i className="chevron right icon"></i></a>
                  <a href="javascript:void(0)" onClick={this.props.lastPage} className="icon item"><i className="arrow right icon"></i></a>
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      </Fragment>
    )
  }
}
