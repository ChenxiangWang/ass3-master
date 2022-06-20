import { React } from 'react-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Accordion, AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { Button, Checkbox, FormGroup, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import { useRef, useState } from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PropTypes from 'prop-types';
import { postUpdateAll, removeQuestion, updateQuestion } from '../store/QuizReducer/action';
import { connect } from 'react-redux';
import { alertMsg } from '../util/alertMsg';

/**
 *  question {
 *    body: ""
 *    options: ["option-1, option-2, option-3, option-4]
 *    type: 0 or 1
 *    answer: [1,2,3]
 *    points: 1
 *    time: 120
 *    video: ""
 *    image: ""
 *  }
 * */
Question.propTypes = {
  question: PropTypes.object,
  index: PropTypes.number.isRequired,
  quizId: PropTypes.string.isRequired,
  updateQuestion: PropTypes.func.isRequired,
  postUpdateAll: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func,
}

function Question (props) {
  let question = {};
  if (props.question) {
    question = props.question.toJS();
  }
  const [body, setBody] = useState(question.body || '');
  const [single, setSingle] = useState(props.question ? question.single : true);
  const [points, setPoints] = useState(question.points || '');
  const [time, setTime] = useState(question.time || '');
  const [reference, setReference] = useState(question.reference || '');
  const [options, setOptions] = useState(question.options || []);
  const [answers, setAnswers] = useState(question.answers || []);
  const [newOption, setNewOption] = useState('');
  const closeRef = useRef();
  const onSelectHandler = (index, selected) => {
    if (!selected) {
      setAnswers((prvState) => prvState.filter((a) => a !== index))
    } else {
      if (!single || answers.length === 0) {
        setAnswers((prvState) => {
          return [...prvState, index];
        });
      } else {
        setAnswers((prvState) => [index])
      }
    }
  }
  const removeOption = (index) => {
    setOptions(prevState => prevState.filter((_, i) => i !== index))
    setAnswers(prevState => {
      const newAnswers = [];
      for (const a of prevState) {
        if (a < index) {
          newAnswers.push(a);
        } else if (a > index) {
          newAnswers.push(a - 1);
        }
      }
      return newAnswers;
    })
  }
  const addOption = () => {
    if (newOption) {
      setOptions(prevState => [...prevState, newOption]);
      setNewOption('');
    }
  }

  const onSave = () => {
    if (!body || !points || !time || !options || !answers) {
      alertMsg('Error', 'You have enter all the required fields!')
    } else if (options?.length < 2) {
      alertMsg('Error', 'You have to have at least two options');
    } else if (answers?.length <= 0) {
      alertMsg('Error', 'You have to have at least one answer');
    } else {
      props.updateQuestion(props.quizId, props.index, { body, single, options, answers, points: Number(points), time: Number(time), reference });
      if (props.index === -1) {
        setBody('');
        setSingle(true);
        setOptions([]);
        setAnswers([]);
        setPoints('');
        setReference('');
        setTime('');
      }
      alertMsg('Success', 'Update successfully, Dot forget to save', () => closeRef.current.click());
    }
  }

  const handleDelete = () => {
    props.removeQuestion(props.quizId, props.index);
    alertMsg('Success', 'Quiz deleted successfully, Do not forget to save your updates!')
  }

  return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                ref={closeRef}
            >
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {props.index !== -1
                          ? <DeleteForeverRoundedIcon onClick={handleDelete}/>
                          : <AddCircleIcon/>
                        }
                        {props.index !== -1
                          ? (props.index + 1) + '. ' + body
                          : 'Add a new question'
                        }
                    </div>

            </AccordionSummary>
            <AccordionDetails>
                    <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} autoComplete="off">
                        <TextField
                            required
                            multiline
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            variant="standard"
                            label={'Question body'}
                        />
                        <div>
                            <FormLabel id="demo-row-radio-buttons-group-label">Question type:</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={single}
                            >
                                <FormControlLabel value={true} control={<Radio onChange={() => { setSingle(true); setAnswers([]) }}/>}
                                                  label="Single answer"/>
                                <FormControlLabel value={false} control={<Radio onChange={() => { setAnswers([]); setSingle(false) }}/>}
                                                  label="Multiple answers"/>
                            </RadioGroup>
                        </div>

                        <div>
                            <FormLabel id="demo-row-radio-buttons-group-label">Selections: </FormLabel>
                            <FormGroup>
                                {options.map((item, index) =>
                                    <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                onClick={(event) => onSelectHandler(index, event.target.checked)}/>}
                                            label={item }
                                            checked={answers.includes(index)}
                                        />
                                        <RemoveCircleIcon style={{ cursor: 'pointer' }}
                                            onClick={(event) => { removeOption(index); event.stopPropagation(); }}/>
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <TextField required variant="standard" value={newOption} label={'add option'}
                                               onChange={(event) => setNewOption(event.target.value)}/>
                                    <AddBoxIcon style={{ cursor: 'pointer' }} onClick={addOption}/>
                                </div>
                            </FormGroup>
                        </div>

                        <TextField required variant="standard"
                                   value={points}
                                   label={'Points'}
                                   type="number"
                                   onChange={(event) => setPoints(event.target.value)}/>

                        <TextField required variant="standard"
                                   value={time}
                                   label={'Time limit in seconds'}
                                   type="number"
                                   onChange={(event) => setTime(event.target.value)}/>

                        <TextField value={reference} variant="standard"
                                   label={'Reference for a youtube video or a photo'}
                                   onChange={(event) => setReference(event.target.value)}/>
                    </FormControl>
                    <br/>
                    <Button onClick={() => onSave()} variant="contained">
                        {props.index === -1
                          ? 'Add'
                          : 'Update'
                        }
                    </Button>
            </AccordionDetails>
        </Accordion>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateQuestion: (quizId, index, question) => dispatch(updateQuestion(quizId, index, question)),
    postUpdateAll: (quizId) => dispatch(postUpdateAll(quizId)),
    removeQuestion: (quizId, questionIndex) => dispatch(removeQuestion(quizId, questionIndex))
  }
}

export default connect(null, mapDispatchToProps)(Question);
