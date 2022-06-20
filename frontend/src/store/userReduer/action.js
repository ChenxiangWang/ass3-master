import { ADD_USER, REMOVE_USER } from './constant';
import { ajaxRestFul } from '../../util/ajax';
import { alertMsg } from '../../util/alertMsg';
import { saveUser } from '../../util/userControl';

export function addUser (token) {
  return {
    type: ADD_USER,
    data: token,
  }
}

export function removeUser () {
  return {
    type: REMOVE_USER,
  }
}

export function login (email, password) {
  return function (dispatch, getState) {
    ajaxRestFul('POST', 'admin/auth/login', { email, password }).then(response => {
      if (response.token) {
        saveUser(response.token)
        alertMsg('Success', 'You have been logged in successfully!', () => dispatch(addUser(response.token)))
      } else {
        alertMsg('Error', response.error);
      }
    })
  }
}

export function register (email, password, name) {
  return function (dispatch) {
    ajaxRestFul('POST', 'admin/auth/register', { email, password, name }).then(response => {
      if (response.token) {
        alertMsg('Success', 'You have been register in successfully!', () => { dispatch(addUser(response.token)); })
      } else {
        alertMsg('Error', response.error)
      }
    })
  }
}

export function logout () {
  return function (dispatch, getState) {
    ajaxRestFul('POST', 'admin/auth/logout', {}, getState().get('user').get('token')).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        console.log('logout');
        alertMsg('Success', 'You have successfully logged out!', () => { dispatch(removeUser()); })
      }
    })
  }
}
