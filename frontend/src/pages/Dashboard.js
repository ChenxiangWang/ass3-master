import React from 'react';
import { Outlet } from 'react-router';

function Dashboard (props) {
  return (
      <div>
        <Outlet/>
      </div>
  )
}
export default Dashboard;
