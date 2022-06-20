import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { fetchPlayerStatus, joinSession } from '../store/PlayReducer/action';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { ajaxRestFul } from '../util/ajax';
import { alertMsg } from '../util/alertMsg';

JoinGame.propTypes = {
  handleJoinGame: PropTypes.func.isRequired,
};

function JoinGame (props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleJoinGame = () => {
    ajaxRestFul('POST', `play/join/${sessionId}`, { name: username }).then(response => {
      if (response.playerId) {
        alertMsg('Success', 'Join game successfully!', () => {
          navigate(`/play/${response.playerId}`)
        }
        );
      } else {
        alertMsg('Error', response.error);
      }
    })
  }

  return (
    <div>
      <h1>Join A Game !</h1>
      <form
        style={{
          width: 500,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <TextField
          fullWidth
          required
          label="sessionId"
          onChange={(event) => {
            setSessionId(event.target.value);
          }}
        />
        <TextField
          fullWidth
          required
          label="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <Box>
          <Button variant="contained" onClick={handleJoinGame}>
            Join
          </Button>
        </Box>
      </form>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleJoinGame: (username, sessionId) =>
      dispatch(joinSession(username, sessionId)),
    fetchPlayerStatus: (playerId, successCB) =>
      dispatch(fetchPlayerStatus(playerId, successCB)),
  };
};

export default connect(null, mapDispatchToProps)(JoinGame);
