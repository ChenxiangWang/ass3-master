import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

AuthValidation.propTypes = {
  token: PropTypes.string,
}
function AuthValidation (props) {
  return (
    props.token
      ? <Outlet/>
      : <Navigate to={'/login'}/>
  )
}
const mapStateToProps = (state) => {
  return {
    token: state.get('user').get('token'),
  }
}
export default connect(mapStateToProps,)(AuthValidation);
