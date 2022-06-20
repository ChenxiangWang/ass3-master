import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { postQuiz } from '../store/QuizReducer/action';
import { alertMsg } from '../util/alertMsg';
import PropTypes from 'prop-types';

EmptyQuizBox.propTypes = {
  postQuiz: PropTypes.func,
  testHook: PropTypes.func,
}

function EmptyQuizBox (props) {
  const [name, setName] = useState('');
  const handleCreate = () => {
    if (!name) {
      alertMsg('Error', 'Please enter a name!')
    } else {
      props.postQuiz(name);
      props.testHook && props.testHook(name)
    }
  }
  return (
            <Box sx={{
              width: '240px',
              height: '300px',
              backgroundColor: '#ced4da',
              borderRadius: '1rem',
              border: '1px dashed ',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '1rem'
            }}>
                <Box sx={{
                  width: 'maxWidth',
                  marginBottom: '1rem',
                }}>
                    <TextField fullWidth
                               id="createTextField"
                               label="Creat a new quiz ..."
                               value={name}
                               onChange={(event) => setName(event.target.value)}

                    />
                </Box>
                <Button variant="contained" onClick={handleCreate}>CREATE</Button>
            </Box>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    postQuiz: (name) => dispatch(postQuiz(name)),
  }
}

export default connect(null, mapDispatchToProps)(EmptyQuizBox);
