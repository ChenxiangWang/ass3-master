import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import { ajaxGet } from '../util/ajax';
import { useParams } from 'react-router';
import { advanceQuizSession } from '../store/GameReducer/action';
import { Stack } from '@mui/material';

HostGame.propTypes = {
  token: PropTypes.string,
  advanceQuiz: PropTypes.func,
  currentSessions: PropTypes.object,
}

function HostGame (props) {
  const sessionId = useParams().id;
  const quizId = props.currentSessions.get(sessionId);
  const [position, setPosition] = useState(-1);
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(0);
  const [isoTimeLastQuestionStarted, setIsoTimeLastQuestionStarted] = useState('');
  const [players, setPlayers] = useState([]);
  const fetchStatus = () => {
    ajaxGet(`admin/session/${sessionId}/status`, {}, props.token).then(response => {
      const curStatus = response.results;
      setPosition(curStatus.position);
      if (numQuestions === 0) {
        setNumQuestions(() => curStatus.questions.length);
        setQuestions(() => curStatus.questions);
      }
      if (isoTimeLastQuestionStarted !== curStatus.isoTimeLastQuestionStarted) {
        setIsoTimeLastQuestionStarted(() => curStatus.isoTimeLastQuestionStarted)
      }
      setPlayers(() => [...curStatus.players]);
    })
  }
  useEffect(() => {
    let timer = setInterval(fetchStatus, 1000);
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, []);

  const handleNext = () => {
    props.advanceQuiz(quizId);
  }

  return (
        <Stack spacing={2}
               justifyContent="center"
               alignItems="center"
               sx={{ marginTop: '30px' }}
        >

            <h3> {players.length} players in this game:</h3>
            <p>{players.join(',')}</p>
            <CircularProgress />

            {position === -1
              ? <Button onClick={handleNext} variant="contained">
                    Start the game
                </Button>
              : <>
                    <p>Question-{position + 1}: {questions[position]?.body}</p>
                  {
                    position === questions.length - 1
                      ? <Button onClick={handleNext} variant="contained">
                          Game End
                        </Button>
                      : <Button onClick={handleNext} variant="contained">
                          Next Question
                        </Button>
                  }
                </>
            }
        </Stack>
  )
}

const mapStateToProps = (state) => {
  return {
    token: state.get('user').get('token'),
    currentSessions: state.get('quiz').get('currentSessions')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    advanceQuiz: (quizId) => dispatch(advanceQuizSession(quizId)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HostGame);
