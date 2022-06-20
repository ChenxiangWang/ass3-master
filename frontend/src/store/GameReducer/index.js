import { fromJS } from 'immutable';
import { UPDATE_SESSION_RESULT } from './constant';

const defaultState = fromJS({
  sessionResult: [],
})

export function gameReducer (state = defaultState, action) {
  const { type, data } = action;
  if (type === UPDATE_SESSION_RESULT) {
    return state.set('sessionResult', data)
  }
  return state;
}
