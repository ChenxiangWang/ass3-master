import { Outlet } from 'react-router';
import React from 'react';
import { Box, Button, Container } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavButton from './NavButton';
import { logout } from '../store/userReduer/action';

AppLayout.propTypes = {
  token: PropTypes.string,
  logout: PropTypes.func,
}

function AppLayout (props) {
  const handleLogout = () => {
    props.logout();
  }
  return (
        <Container maxWidth="lg">
            <Box sx={{ backgroundColor: '#e9ecef', borderRadius: '1rem' }}>
                <h1 style={{ textAlign: 'center' }}>Welcome banner</h1>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1%' }}>
                    <NavButton to={'join'} text={'join'}/>
                    {
                        !props.token
                          ? <>
                                <NavButton to={'login'} text={'login'}/>
                                <NavButton to={'register'} text={'register'}/>
                            </>
                          : <>
                                <NavButton to="dashboard" text={'Dashboard'}/>
                                <Button size={'large'} onClick={handleLogout}>Logout</Button>
                            </>
                    }
                </Box>
            </Box>
            <Box sx={{ backgroundColor: '#e9ecef', marginTop: '1rem', padding: '1rem', borderRadius: '1rem', minHeight: '560px' }}>
                <Outlet/>
            </Box>
        </Container>
  )
}
const mapStateToProps = (state) => {
  return {
    token: state.get('user').get('token'),
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);
