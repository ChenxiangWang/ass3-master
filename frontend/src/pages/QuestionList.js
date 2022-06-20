import React, { useState } from 'react';
// import Question from '../component/Question';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import Question from '../component/Question';
import { postUpdateAll, updateQuizItem } from '../store/QuizReducer/action';
import { Box, Button, TextField } from '@material-ui/core';
import { AccountCircle } from '@mui/icons-material';
import { Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fileToDataUrl } from '../util/imageHelper';
import { alertMsg } from '../util/alertMsg';
QuestionList.propTypes = {
  questions: PropTypes.object.isRequired,
  postUpdateAll: PropTypes.func,
  updateQuizItem: PropTypes.func,
}
const Input = styled('input')({
  display: 'none',
});

function QuestionList (props) {
  const quizId = useParams().id;
  const questionList = props.questions.get(quizId);
  const [name, setName] = useState('');
  let image = '';
  const handleUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    fileToDataUrl(file).then(result => {
      image = result;
      props.updateQuizItem(quizId, '', image)
      alertMsg('Image upload successfully, do not forget to save!')
    });
  }

  const handleNameChange = () => {
    props.updateQuizItem(quizId, name, image)
  }

  return (
      <Stack
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
          width={'80%'}
          sx={{
            margin: '0 auto'
          }}
      >
          <Stack
              direction="column"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
          >
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-end',
              }}>
                  <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  <TextField size="medium"
                             onBlur={handleNameChange}
                             value={name}
                             onChange={(event) => { setName(event.target.value) }} fullWidth label="Update the quiz's name" variant="standard" />
              </Box>
              <label htmlFor="contained-button-file" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  <Input accept="image/*" id="contained-button-file" onChange={handleUpload} multiple type="file" />
                  <Button variant="contained" component="span">
                      <AddIcon />
                      Upload a new image
                  </Button>
              </label>

          </Stack>
        <h2>Question List:</h2>
        <Question index={-1} quizId={quizId}/>
          {questionList?.map((q, index) =>
              <Question key={quizId + index}
                        index={index}
                        question={q}
                        quizId={quizId}
              />)
          }
          <Button onClick={() => props.postUpdateAll(quizId)} variant="contained">
                Save All Updates
          </Button>
      </Stack>
  )
}

const mapStateToProps = (state) => {
  return {
    questions: state.get('quiz').get('questions'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postUpdateAll: (quizId) => dispatch(postUpdateAll(quizId)),
    updateQuizItem: (quizId, name, image) => dispatch(updateQuizItem(quizId, name, image))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
