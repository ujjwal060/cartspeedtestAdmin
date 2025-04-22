import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const routeNames = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/videos": "Videos",
  "/assessment": "Assessments",
};

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const currentRouteName = routeNames[location.pathname] || "Welcome";

  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          xs: "100%",
          md: sidebarOpen ? "calc(100% - 240px)" : "100%",
        },
        ml: {
          xs: 0,
          md: sidebarOpen ? "240px" : 0,
        },
        transition: "all 0.3s",
        background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <div className="d-flex flex-row gap-3 align-items-center">
          <MenuIcon
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ cursor: "pointer" }}
          />
          <Typography variant="h6" noWrap component="div">
            {currentRouteName}
          </Typography>
        </div>

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
