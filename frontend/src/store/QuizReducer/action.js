import {
  REMOVE_QUESTION,
  REMOVE_QUIZ_ITEM,
  UPDATE_QUESTION,
  UPDATE_QUESTION_LIST,
  UPDATE_QUIZ_ITEM,
  UPDATE_QUIZ_LIST
} from './constant';
import { ajaxGet, ajaxRestFul } from '../../util/ajax';
import { alertMsg } from '../../util/alertMsg';
import { saveSessionQuizMap } from '../../util/userControl';

export function updateQuizList (list) {
  return {
    type: UPDATE_QUIZ_LIST,
    data: list
  }
}

export function updateQuizItem (quizId, name, image) {
  return {
    type: UPDATE_QUIZ_ITEM,
    data: {
      quizId,
      name,
      image
    }
  }
}

export function removeQuiz (quizId) {
  return {
    type: REMOVE_QUIZ_ITEM,
    data: quizId
  }
}

export function updateQuestion (quizId, questionIndex, question) {
  return {
    type: UPDATE_QUESTION,
    data: { quizId, questionIndex, question }
  }
}

export function updateQuestionList (quizId, questionList) {
  return {
    type: UPDATE_QUESTION_LIST,
    data: { quizId, questionList }
  }
}

export function removeQuestion (quizId, questionIndex) {
  return {
    type: REMOVE_QUESTION,
    data: { quizId, questionIndex }
  }
}

export function updateSessionQuizMap (quizzes) {
  const map = {};
  quizzes.forEach((item) => {
    if (item.active !== null) {
      map[item.active] = item.id;
    }
    item.oldSessions.forEach((oldSessionId) => {
      map[oldSessionId] = item.id;
    });
  });
  saveSessionQuizMap(map);
}

export function fetchQuizzes (successCB) {
  return function (dispatch, getState) {
    ajaxGet('admin/quiz', {}, getState().get('user').get('token')).then(response => {
      if (response.quizzes) {
        updateSessionQuizMap(response.quizzes)
        dispatch(updateQuizList(response.quizzes));
        successCB && successCB()
      } else {
        console.log('error',)
      }
    }).catch(error => {
      console.log(error);
    })
  }
}

export function postQuiz (name) {
  return function (dispatch, getState) {
    ajaxRestFul('POST', 'admin/quiz/new', { name }, getState().get('user').get('token')).then(response => {
      if (response.error) {
        alertMsg('error', 'Failed to create new quiz');
      } else {
        dispatch(fetchQuizzes())
      }
    })
  }
}

export function fetchQuestions (quizId) {
  return function (dispatch, getState) {
    ajaxGet(`admin/quiz/${quizId}`, {}, getState().get('user').get('token')).then(response => {
      dispatch(updateQuestionList(quizId, response.questions));
    })
  }
}

export function postUpdateAll (quizId) {
  return function (dispatch, getState) {
    const state = getState().get('quiz');
    const questions = state.get('questions').get(quizId);
    const quiz = state.get('quizzes').find((q) => q.get('id') + '' === quizId);
    const name = quiz.get('name');
    const thumbnail = quiz.get('thumbnail');
    ajaxRestFul('PUT', `admin/quiz/${quizId}`, {
      questions,
      name,
      thumbnail
    }, getState().get('user').get('token')).then(r => {
    }).then(() => {
      alertMsg('Success!', 'All updates effect successfully')
    })
  }
}

export function postDeleteQuiz (quizId) {
  return function (dispatch, getState) {
    ajaxRestFul('DELETE', `admin/quiz/${quizId}`, {}, getState().get('user').get('token')).then(response => {
      if (response.error) {
        console.log(response.error);
      } else {
        alertMsg('Success', 'This quiz has been deleted.', () => dispatch(removeQuiz(quizId)))
      }
    })
  }
}
