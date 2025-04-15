import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Box,
  ListItemIcon,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = {
    role: "Admin",
    companyName: "Cart Speed Test",
    logo: "/logo.jpg",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
    { text: "Users", link: "/users", icon: <PeopleIcon /> },
    { text: "Videos", link: "/videos", icon: <VideoLibraryIcon /> },
    { text: "Tests", link: "/tests", icon: <AssignmentIcon /> },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <Box>
        <Box sx={{ padding: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt="Company Logo"
              src={user.logo}
              sx={{ width: 56, height: 56, marginRight: "12px" }}
            />
            <Box>
              <Typography variant="h7">{user.companyName}</Typography>
              <Typography>{user.role}</Typography>
            </Box>
            <Box className="ms-auto d-lg-none">
              <ClearIcon
                onClick={() => setSidebarOpen(false)}
                className="text-light"
              />
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
                  backgroundColor: isSelected
                    ? "rgba(0, 0, 0, 0.2)"
                    : "transparent",
                  color: isSelected ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                  "& .MuiListItemIcon-root": {
                    color: isSelected ? "#fff" : "inherit",
                  },
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
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#600b0b",
              color: "#fff",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
