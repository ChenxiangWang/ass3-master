import { _USER_, _SESSION_QUIZ_ } from './const';

export function saveUser (userSession) {
  localStorage.setItem(_USER_, userSession);
}

export function getUser () {
  const userSession = localStorage.getItem(_USER_);
  return userSession;
}

export function saveSessionQuizMap (userSession) {
  localStorage.setItem(_SESSION_QUIZ_, JSON.stringify(userSession));
}

export function getSessionQuizMap () {
  const userSession = JSON.parse(localStorage.getItem(_SESSION_QUIZ_));
  return userSession;
}
