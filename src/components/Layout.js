import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Navbar />
        <Box sx={{ marginTop: 8, padding: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
