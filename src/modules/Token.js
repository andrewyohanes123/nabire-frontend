import Req from './Req';

export default {
  setToken: (arg) => {
    if (arg.headers['x-access-token'] && arg.headers['x-refresh-token']) {
      localStorage.setItem('x-access-token', arg.headers['x-access-token']);
      localStorage.setItem('x-refresh-token', arg.headers['x-refresh-token']);
    }
    Req.defaults.headers = {
      'x-access-token': localStorage.getItem('x-access-token'),
      'x-refresh-token': localStorage.getItem('x-refresh-token')
    }
  },
  sentHeader: (token, refreshtoken, params = {}) => {
    return {
      headers: {
        'x-access-token': token,
        'x-refresh-token': refreshtoken,
      },
      ...params
    }
  },
  setLoginToken: ({ token, refreshToken }) => {
    localStorage.setItem('x-access-token', token);
    localStorage.setItem('x-refresh-token', refreshToken);
    Req.defaults.headers = {
      'x-access-token': localStorage.getItem('x-access-token'),
      'x-refresh-token': localStorage.getItem('x-refresh-token')
    }
  }

}