import { combineReducers } from 'redux-immutable';
import { quizReducer } from './QuizReducer';
import { userReducer } from './userReduer';
import { gameReducer } from './GameReducer';
import { playReducer } from './PlayReducer';

const reducer = combineReducers({
  quiz: quizReducer,
  user: userReducer,
  game: gameReducer,
  play: playReducer,
})

export default reducer;
