import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { ajaxGet, ajaxRestFul } from '../util/ajax';
import { Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import { alertMsg } from '../util/alertMsg';

function PlayGame (props) {
  const playerId = useParams().id;
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState('');
  const [selected, setSelected] = useState([]);
  const [counter, setCounter] = useState(99999);
  const [answers, setAnswers] = useState([]);
  const [questionRecords, setQuestionRecords] = useState([]);
  const navigate = useNavigate();

  const pollQuestion = () => {
    let timer = setInterval(() =>
      ajaxGet(`play/${playerId}/question`).then(response => {
        // get new question
        if (!response.error) {
          if (question && response.question && question.isoTimeLastQuestionStarted === response.question.isoTimeLastQuestionStarted) {
            return;
          }
          setQuestion(response.question);
          setQuestionRecords((prv) => [...prv, response.question]);
          setAnswers([]);
          setSelected([]);
          // set a counter to count down time.
          const start = new Date(response.question.isoTimeLastQuestionStarted).getTime();
          const now = new Date().getTime();
          const remained = response.question.time - Math.floor((now - start) / 1000);
          setCounter(remained >= 0 ? remained : 0);
          clearInterval(timer);
          timer = null;
          // end the game
        } else if (response.error) {
          clearInterval(timer);
          timer = null;
          // <Navigate to=`/result/${playerId}`  state={{ data }} />
          navigate(`/result/${playerId}`, { state: { questionRecords } })
        }
      })

    , 1000);
  }

  useEffect(() => {
    let timer;
    // when the game has not started, check it every second.
    if (!started) {
      timer = setInterval(() => {
        ajaxGet(`play/${playerId}/status`).then((response) => {
          setStarted(response.started);
        })
      }, 1000);
    } else {
      // once the game started, clean the timer, request the current question.
      timer = null;
      pollQuestion();
    }
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, [started])

  useEffect(() => {
    let timer = null;
    if (counter > 0) {
      timer = setInterval(() => {
        setCounter(counter - 1);
      }, 1000)
    } else {
      ajaxGet(`play/${playerId}/answer`,).then(response => {
        if (response.answerIds) {
          setAnswers(response.answerIds);
        }
      })
      // start to query question
      pollQuestion();
    }
    return () => {
      clearInterval(timer);
      timer = null;
    }
  }, [counter]);

  const onSelectHandler = (index, checked) => {
    let currentAnswer;
    // single choice
    if (question.single) {
      if (checked) {
        currentAnswer = [index];
      } else {
        currentAnswer = [];
      }
      // multiple choices
    } else {
      if (checked) {
        currentAnswer = [...selected, index];
      } else {
        currentAnswer = selected.filter((v) => v !== index);
      }
    }
    // post the selections from user to backend
    ajaxRestFul('PUT', `play/${playerId}/answer`, { answerIds: currentAnswer }).then(response => {
      if (!response.error) {
        setSelected(currentAnswer);
      } else {
        alertMsg('Error', response.error);
      }
    })
  }

  return (
        <Box>
            {!started
              ? <div style={{ margin: 'auto' }}>
                  <CircularProgress sx={{ width: '1000px' }}/>
                  <h3>
                  Please be patient, wait admin to start the game ...
                  </h3>
                </div>
              : <Box sx={{ margin: '2rem 2rem', fontSize: '20px' }}>
                  <Typography component={'div'}>
                    [{counter}s remained] {' - '}
                    {question.single ? 'Single Choice' : 'Multiple Choice'}
                  </Typography>

                  <Typography variant="h5" component="div">
                    {question.body}
                  </Typography>

                  <Typography component={'div'}>
                    <FormGroup>
                        {
                            question.options?.map((option, index) =>
                                <FormControlLabel
                                    key = {index}
                                    control={<Checkbox
                                            onChange={(event) => onSelectHandler(index, event.target.checked)}/>}
                                    label={option}
                                    checked={selected.includes(index)}
                                />
                            )
                        }
                      { answers.length > 0
                        ? <p style={{ color: 'red', }}>correct answers: {answers.map((op, index) => question.options[index]).join(',')}</p>
                        : null
                      }
                    </FormGroup>
                  </Typography>
                </Box>
            }
        </Box>
  )
}

export default connect(null,)(PlayGame);
