import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import startImg from '../static/incons/start.png';
import stopImg from '../static/incons/stop.png';
import { useCopyToClipboard } from 'react-use';
import { red } from '@mui/material/colors';
import { NavLink, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'
import { createExprLogger } from '../util/logger';
import { fetchQuestions, postDeleteQuiz, updateQuizItem } from '../store/QuizReducer/action';
import { advanceQuizSession, endQuizSession, startQuizSession } from '../store/GameReducer/action';
import { alertMsg } from '../util/alertMsg';
import { ajaxGet } from '../util/ajax';

const logger = createExprLogger('QuizBox @ ')

function MoreVertIcon () {
  return null;
}

QuizBox.propTypes = {
  quiz: PropTypes.object,
  questions: PropTypes.object,
  fetchQuestions: PropTypes.func,
  updateQuizItem: PropTypes.func,
  postDeleteQuiz: PropTypes.func,
  startQuiz: PropTypes.func,
  advanceQuiz: PropTypes.func,
  endQuiz: PropTypes.func,
  token: PropTypes.string,
}

function QuizBox (props) {
  const navigate = useNavigate();
  const [start, setStart] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const quiz = props.quiz.toJS();
  const questions = props.questions.get(quiz.id + '');
  const size = typeof questions === 'undefined' ? 0 : questions.size;
  let time = typeof questions === 'undefined' ? 0 : [...questions].reduce((prv, curr) => prv + curr.get('time'), 0);
  time = Math.ceil(time / 60);
  time = size === 0 ? 0 : time;
  const [_, copyFunc] = useCopyToClipboard();
  const [running, setRunning] = useState(false);

  /**
   *
   *  Track the session's status
   * */
  const [currentPosition, setCurrentPosition] = useState(-1);
  const [currentNumberOfPlayers, setCurrentNumberOfPlayers] = useState(0);
  useEffect(() => {
    let timer;
    if (start && !running) {
      timer = setInterval(fetchStatus, 1000);
    } else {
      clearInterval(timer);
      timer = null;
    }
    return () => {
      clearInterval(timer);
    }
  }, [start, running])

  const fetchStatus = () => {
    ajaxGet(`admin/session/${sessionId}/status`, {}, props.token).then(response => {
      const curStatus = response.results;
      setCurrentPosition(curStatus.position);
      setCurrentNumberOfPlayers(curStatus.players.length);
    })
  }

  /**
   *   init quiz box
   * */
  useEffect(() => {
    props.fetchQuestions(quiz.id + '');
    logger('updateQuizItem')
    props.updateQuizItem(quiz.id + '');
  }, [])
  useEffect(() => {
    const curActive = (quiz.active !== null)
    logger('setStart-->' + curActive)
    setStart(curActive)
    setSessionId(quiz.active + '')
  }, [quiz]);
  const handleDelete = () => {
    props.postDeleteQuiz(quiz.id);
  }
  /**
   *  handler for advancing the game (from index of -1)
   * */
  const handleAdvance = () => {
    logger('handleAdvance')
    if (currentPosition === size - 1) {
      setCurrentPosition(-1);
      setRunning(false);
      ChangeSessionStatus();
      return;
    }
    setRunning(true);
    setCurrentPosition((prv) => prv + 1);
    props.advanceQuiz(quiz.id);
  }

  const ChangeSessionStatus = () => {
    if (start) {
      logger('endQuiz')
      props.endQuiz(quiz.id, () => {
        alertMsg('Success', 'Would you like to view the results?', () => {
          navigate(`chart/${sessionId}`)
        });
      });
    } else {
      logger('startQuiz')
      props.startQuiz(quiz.id);

      setTimeout(() => {
        alertMsg('Success', `New Game Started ! ID is ${quiz.active}`, () => {
        })
      }, 0);
    }
  }

  const handleCopy = () => {
    logger(_)
    copyFunc(sessionId);
    alertMsg('Success', `Game Session ID : ${sessionId} copied to clipboard !`, () => {
    })
  }

  return (
        <Card sx={{ width: '240px', height: '300px', backgroundColor: '#ced4da', borderRadius: '1rem', }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"
                            src={quiz.thumbnail}>
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={quiz.name}
                subheader={`${size} questions, ${time} mines`}
            />
            <CardActionArea onClick={() => ChangeSessionStatus()} sx={{ textAlign: 'center' }}>
                <img src={start ? startImg : stopImg} width={'100px'} height={'100px'} alt=""/>
            </CardActionArea>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    Session code: {start ? sessionId : 'No game active'}
                </Typography>
              {currentPosition === -1 ? start ? currentNumberOfPlayers === 0 ? 'waiting for players...' : `${currentNumberOfPlayers} players joined!` : null : `current question: ${currentPosition + 1}`}
            </CardContent>
            {start
              ? <CardActions>
                    <Button onClick={handleCopy} size="small">Copy Code</Button>{' | '}
                    <Button size="small" onClick={handleAdvance}>{currentPosition !== -1 ? currentPosition === size - 1 ? 'Stop Game' : 'next question' : 'start to run'}</Button>
                </CardActions>
              : <CardActions>
                    <Button size="small"><NavLink to={`quiz/${quiz.id}`}>Update</NavLink></Button>{' | '}
                    <Button onClick={handleDelete} size="small" color={'error'}>Delete</Button>
                </CardActions>
            }
        </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    questions: state.get('quiz').get('questions'),
    token: state.get('user').get('token'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuestions: (quizId) => dispatch(fetchQuestions(quizId)),
    updateQuizItem: (quizId) => dispatch(updateQuizItem(quizId)),
    postDeleteQuiz: (quizId) => dispatch(postDeleteQuiz(quizId)),
    startQuiz: (quizId) => dispatch(startQuizSession(quizId)),
    advanceQuiz: (quizId) => dispatch(advanceQuizSession(quizId)),
    endQuiz: (quizId, CB) => dispatch(endQuizSession(quizId, CB)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizBox);
