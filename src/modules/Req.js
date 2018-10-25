import axios from 'axios';
const Req = axios.create({
  baseURL: "http://192.168.1.16:8080",
  // baseURL : "https://nabireapis.herokuapp.com/",
  headers: {
    'x-access-token': localStorage.getItem('x-access-token'),
    'x-refresh-token': localStorage.getItem('x-refresh-token')
  }
})
export default Req;