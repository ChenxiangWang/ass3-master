import { fromJS } from 'immutable';
import {
  REMOVE_QUESTION,
  REMOVE_QUIZ_ITEM,
  UPDATE_QUESTION,
  UPDATE_QUESTION_LIST,
  UPDATE_QUIZ_ITEM,
  UPDATE_QUIZ_LIST
} from './constant';

const defaultState = fromJS({
  quizzes: [],
  questions: {}, // map,  (quizId, questionList)
  currentSessions: {} // map, (sessionId, quizId)
})

export function quizReducer (state = defaultState, action) {
  const { type, data } = action;
  if (type === UPDATE_QUIZ_LIST) {
    data.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    const currentSessions = {}
    for (const q of data) {
      if (q.active !== null) {
        currentSessions[q.active] = q.id;
      }
    }
    state = state.set('currentSessions', fromJS(currentSessions));
    return state.set('quizzes', fromJS(data));
  }

  if (type === UPDATE_QUIZ_ITEM) {
    const { quizId, name, image } = data;
    const quizzesList = state.get('quizzes').toJS();
    const quiz = quizzesList.find(q => q.id + '' === quizId);
    if (name) {
      quiz.name = name;
    }
    if (image) {
      quiz.thumbnail = image;
    }
    return state.set('quizzes', fromJS(quizzesList));
  }

  if (type === REMOVE_QUIZ_ITEM) {
    const newQuizzes = state.get('quizzes').filter(q => { return q.get('id') !== data; });
    return state.set('quizzes', newQuizzes);
  }

  if (type === UPDATE_QUESTION_LIST) {
    const { quizId, questionList } = data;
    const questions = state.get('questions').set(quizId, fromJS(questionList));
    return state.set('questions', questions);
  }

  if (type === UPDATE_QUESTION) {
    const { quizId, questionIndex, question } = data;
    const questions = state.get('questions').toJS();
    if (questionIndex === -1) {
      questions[quizId].push(question);
    } else {
      questions[quizId][questionIndex] = question;
    }
    return state.set('questions', fromJS(questions));
  }

  if (type === REMOVE_QUESTION) {
    const { quizId, questionIndex } = data;
    const prvQuestionList = state.get('questions').get(quizId);
    const newQuestionList = prvQuestionList.delete(questionIndex);
    const newQuestions = state.get('questions').set(quizId, newQuestionList);
    return state.set('questions', newQuestions);
  }
  return state;
}
