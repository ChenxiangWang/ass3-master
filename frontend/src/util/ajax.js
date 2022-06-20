import config from '../config.json';
const host = config.BACKEND_URL + ':' + config.BACKEND_PORT + '/';

/**
 *  method: 'POST', 'DELETE', 'PUT', 'PUT'
 *  url: 'admin/login' etc
 *  body: {...}
 *  token: a token
 * */

export function ajaxRestFul (method, url, body, token) {
  return fetch(host + url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(body)
  }).then(response => response.json());
}

export function ajaxGet (url, params, token) {
  const request = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }
  url = host + url;
  let paramsStr;
  if ((paramsStr = new URLSearchParams(params).toString())) {
    url = '?' + paramsStr;
  }

  return fetch(url, request)
    .then(response => {
      return response.json()
    });
}
