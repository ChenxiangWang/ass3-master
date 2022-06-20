import { ADD_PLAYER, UPDATE_PLAYER_QUESTION, UPDATE_PLAYER_ANSWER, UPDATE_CORRECT_ANSWER, UPDATE_PLAYER_RESULTS } from './constant';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  player: {},
  playingQuestion: {},
  playerAnswers: [],
  correctAnswers: [],
  playerResults: []
})

export function playReducer (state = defaultState, action) {
  const { type, data } = action;
  if (type === ADD_PLAYER) {
    // const { playerName, playerId } = data;
    return state.set('player', data);
  }
  if (type === UPDATE_PLAYER_QUESTION) {
    // const { playerName, playerId } = data;
    return state.set('playingQuestion', data);
  }
  if (type === UPDATE_PLAYER_ANSWER) {
    // const { playerName, playerId } = data;
    return state.set('playerAnswers', data);
  }
  if (type === UPDATE_CORRECT_ANSWER) {
    // const { playerName, playerId } = data;
    return state.set('correctAnswers', data);
  }
  if (type === UPDATE_PLAYER_RESULTS) {
    // const { playerName, playerId } = data;
    return state.set('playerResults', data);
  }
  return state;
}
