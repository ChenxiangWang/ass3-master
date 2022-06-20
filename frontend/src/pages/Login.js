import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { login } from '../store/userReduer/action';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router';
import { alertMsg } from '../util/alertMsg';

Login.propTypes = {
  login: PropTypes.func,
  token: PropTypes.string,
}

function Login (props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLoginButton = () => {
    if (!username || !password) {
      alertMsg('Error', 'You have to enter a valid username and password')
    } else {
      props.login(username, password);
    }
  }
  return (<form>
          {props.token
            ? <Navigate to={'/dashboard'}/>
            : <Box>
              <h1>Login</h1>
              <Box
                  sx={{
                    width: 500,
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
              >
                  <TextField required fullWidth value={username} label="Username" onChange={(event) => { setUsername(event.target.value) }}/>
                  <TextField required type="password" autoComplete= {'off'} fullWidth value={password} label="Password" onChange={(event) => { setPassword(event.target.value) }}/>
                  <Box
                      variant="contained"
                      sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
                  >
                      <Button variant="contained" onClick={handleLoginButton}>Login</Button>
                  </Box>
              </Box>
          </Box>}
     </form>
  )
}
const mapStateToProps = (state) => {
  return {
    token: state.get('user').get('token')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => dispatch(login(email, password)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
