import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { register } from '../store/userReduer/action';
import PropTypes from 'prop-types';
import { alertMsg } from '../util/alertMsg';
import { Navigate } from 'react-router';

Register.propTypes = {
  register: PropTypes.func,
  token: PropTypes.string
}

function Register (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegisterButton = () => {
    if (!email || !password || !confirmPassword || !name) {
      alertMsg('Error', 'You must enter all required information');
    } else if (password !== confirmPassword) {
      alertMsg('Error', 'Password and confirm password do not match!');
    } else {
      props.register(email, password, name);
    }
  }
  return (
      <>
          {
              props.token
                ? <Navigate to={'/dashboard'}/>
                : <div>

                      <h1>Register</h1>
                      <form
                          style={{
                            width: 500,
                            maxWidth: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                          }}
                      >
                          <TextField fullWidth required label="Name" onChange={(event) => { setName(event.target.value) }}/>
                          <TextField fullWidth type="email" required label="Email" onChange={(event) => { setEmail(event.target.value) }}/>
                          <TextField fullWidth type="password" autoComplete= {'off'} required label="Password" onChange={(event) => { setPassword(event.target.value) }}/>
                          <TextField fullWidth type="password" autoComplete= {'off'} required label="Confirm Password" onChange={(event) => { setConfirmPassword(event.target.value) }}/>
                          <Box>
                              <Button variant="contained" onClick={handleRegisterButton}>Register</Button>
                          </Box>
                      </form>
                  </div>

          }
      </>
  )
}
const mapStateToProps = (state) => {
  return {
    token: state.get('user').get('token')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    register: (name, username, password) => dispatch(register(name, username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
