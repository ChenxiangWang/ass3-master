import { ADD_USER, REMOVE_USER } from './constant';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  token: ''
})

export function userReducer (state = defaultState, action) {
  const { type, data } = action;
  if (type === ADD_USER) {
    return state.set('token', data);
  }
  if (type === REMOVE_USER) {
    return state.set('token', '')
  }
  return state;
}
