import React from 'react';
import PropTypes from 'prop-types';

Error.propTypes = {
  message: PropTypes.string.isRequired,
}

function Error (props) {
  return (
      <>
        <h1>Ops, some error happened!</h1>
        <p>{props.message}</p>
      </>
  )
}
export default Error;
