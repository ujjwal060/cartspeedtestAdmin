import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Box,
  ListItemIcon
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const location = useLocation();

  const user = {
    role: 'Admin',
    companyName: 'Cart Speed Test',
    logo: '/logo.jpg'
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Dashboard', link: '/dashboard', icon: <DashboardIcon /> },
    { text: 'User', link: '/user', icon: <PeopleIcon /> },
  ];

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box>
        <Box sx={{ padding: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar alt="Company Logo" src={user.logo} sx={{ width: 56, height: 56, marginRight: '12px' }} />
            <Box>
              <Typography variant="h7">{user.companyName}</Typography>
              <Typography>{user.role}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item, index) => {
            const isSelected = location.pathname === item.link;

            return (
              <ListItem
                button
                key={index}
                component={Link}
                to={item.link}
                sx={{
                  backgroundColor: isSelected ? '#1976d2' : 'transparent',
                  color: isSelected ? '#fff' : 'inherit',
                  '&:hover': {
                    backgroundColor: isSelected ? '#1565c0' : '#f0f0f0',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isSelected ? '#fff' : 'inherit',
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <List>
        <Divider />
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#600b0b',
            },
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>

      </List>
    </Drawer>
  );
};

export default Sidebar;
