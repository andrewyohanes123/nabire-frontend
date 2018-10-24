import axios from 'axios';
const Req = axios.create({
  baseURL: "https://nabireapis.herokuapp.com/",
  headers: {
    'x-access-token': localStorage.getItem('x-access-token'),
    'x-refresh-token': localStorage.getItem('x-refresh-token')
  }
})
export default Req;