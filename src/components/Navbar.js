import React, {  } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const routeNames = {
  '/dashboard': 'Dashboard',
  '/users': 'Users',
  '/videos': 'Videos',
  '/tests': 'Tests',
};

const Navbar = () => {
  const location = useLocation();
  // const navigate = useNavigate();

  // const [anchorEl, setAnchorEl] = useState(null);

  // const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  // const handleMenuClose = () => setAnchorEl(null);

  // const handleProfile = () => {
  //   handleMenuClose();
  //   navigate('/profile');
  // };

  // const handleLogout = () => {
  //   localStorage.clear();
  //   navigate('/login');
  // };

  const currentRouteName = routeNames[location.pathname] || 'Welcome';

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: `240px`,
        background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {currentRouteName}
        </Typography>

        {/* <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar src="/profile.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
