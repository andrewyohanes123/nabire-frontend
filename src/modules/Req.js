import axios from 'axios';
const Req = axios.create({
  baseURL: "http://192.168.1.19:8080",
  headers: {
    'x-access-token': localStorage.getItem('x-access-token'),
    'x-refresh-token': localStorage.getItem('x-refresh-token')
  }
})
export default Req;