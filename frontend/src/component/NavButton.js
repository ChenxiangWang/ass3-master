import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import React from 'react';

NavButton.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

function NavButton (props) {
  return (
      <NavLink style={{ textDecoration: 'none' }} to={props.to}> <Button size={'large'}>{props.text}</Button></NavLink>
  )
}

export default NavButton;
