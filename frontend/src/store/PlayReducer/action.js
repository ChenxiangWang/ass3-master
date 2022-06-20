import { ajaxGet, ajaxRestFul } from '../../util/ajax';
import { alertMsg } from '../../util/alertMsg';
import { ADD_PLAYER, UPDATE_CORRECT_ANSWER, UPDATE_PLAYER_ANSWER, UPDATE_PLAYER_QUESTION, UPDATE_PLAYER_RESULTS } from './constant';

export function addPlayer (playerName, playerId, started) {
  return {
    type: ADD_PLAYER,
    data: { playerName, playerId, started },
  }
}

export function updatePlayingQuestion (question) {
  return {
    type: UPDATE_PLAYER_QUESTION,
    data: { question },
  };
}

export function updatePlayerAnswers (answerIds) {
  return {
    type: UPDATE_PLAYER_ANSWER,
    data: { answerIds },
  };
}

export function updateCorrectAnswers (answerIds) {
  return {
    type: UPDATE_CORRECT_ANSWER,
    data: { answerIds },
  };
}

export function updatePlayerResults (playerResults) {
  return {
    type: UPDATE_PLAYER_RESULTS,
    data: playerResults,
  };
}

export function joinSession (sessionId, name, successCB) {
  return function (dispatch, getState) {
    ajaxRestFul('POST', `play/join/${sessionId}`, { name }).then(response => {
      if (response.playerId) {
        alertMsg('Success', 'Join game successfully!', () => {
          dispatch(fetchPlayerStatus(response.playerId, name));
          successCB && successCB();
        });
      } else {
        alertMsg('Error', response.error);
      }
    })
  }
}

export function fetchPlayerStatus (playerId, name, successCB) {
  return function (dispatch, getState) {
    ajaxGet(`play/${playerId}/status`, {})
      .then((response) => {
        dispatch(addPlayer(playerId, name, response.started));
        successCB(response.started);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function fetchPlayingQuestion (playerId, successCB) {
  return function (dispatch, getState) {
    ajaxGet(`play/${playerId}/question`, {})
      .then((response) => {
        dispatch(updatePlayingQuestion(response))
        successCB(response.started);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getCorrectAnswer (playerId, successCB) {
  return function (dispatch, getState) {
    ajaxGet(`play/${playerId}/answer`, {})
      .then((response) => {
        dispatch(updateCorrectAnswers(response));
        successCB && successCB(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function submitPlayerAnswer (playerId) {
  return function (dispatch, getState) {
    const state = getState().get('play');
    const answerIds = state.get('userAnswers');
    ajaxRestFul('PUT', `play/${playerId}/answer`, {
      answerIds,
    })
      .then((r) => {})
      .then(() => {
        console.log('updated');
      });
  };
}

export function getPlayerResults (playerId, successCB) {
  return function (dispatch, getState) {
    ajaxGet(`play/${playerId}/results`, {})
      .then((response) => {
        dispatch(updatePlayerResults(response));
        successCB && successCB(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
