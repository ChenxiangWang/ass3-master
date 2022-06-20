import { ajaxGet, ajaxRestFul } from '../../util/ajax';
import { alertMsg } from '../../util/alertMsg';
import { createExprLogger } from '../../util/logger';
import { fetchQuizzes } from '../QuizReducer/action';
import { UPDATE_SESSION_RESULT } from './constant';
import { getUser, } from '../../util/userControl';

const logger = createExprLogger('GameReducer @ ')

export function updateSessionResult (sessionResult) {
  return {
    type: UPDATE_SESSION_RESULT,
    data: sessionResult
  }
}

export function startQuizSession (quizid) {
  logger('startQuizSession')
  return function (dispatch, getState) {
    ajaxRestFul('POST', `admin/quiz/${quizid}/start`, { quizid }, getState().get('user').get('token')).then(response => {
      logger('response --> ' + JSON.stringify(response))
      if (response.error) {
        console.log(response.error);
      } else {
        alertMsg('Success', 'Start a new game for a BigBrain quiz! ', () => dispatch(fetchQuizzes(quizid)))
      }
    })
  }
}

export function advanceQuizSession (quizid) {
  return function (dispatch, getState) {
    ajaxRestFul('POST', `admin/quiz/${quizid}/advance`, { quizid }, getState().get('user').get('token')).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        alertMsg('Success', 'Advanced Successfully', () => dispatch(fetchQuizzes(quizid)))
      }
    })
  }
}

export function endQuizSession (quizid, successCB) {
  return function (dispatch, getState) {
    ajaxRestFul('POST', `admin/quiz/${quizid}/end`, { quizid }, getState().get('user').get('token')).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        // alertMsg('Success', 'End the active game for a BigBrain quiz! ', () => dispatch(fetchQuizzes(quizid)))
        dispatch(fetchQuizzes(quizid));
        successCB && successCB()
      }
    })
  }
}

export function getSessionResult (sessionid, successCB) {
  return function (dispatch, getState) {
    ajaxGet(`admin/session/${sessionid}/results`, {}, getUser()).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        dispatch(updateSessionResult(response));
        successCB && successCB(response)
      }
    })
  }
}
