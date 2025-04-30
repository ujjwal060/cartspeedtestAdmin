import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Box,
  ListItemIcon,
  IconButton,
  CssBaseline,
  styled,
  useTheme,
  AppBar as MuiAppBar,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ClearIcon from "@mui/icons-material/Clear";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = {
    role: "Admin",
    companyName: "Cart Speed Test",
    logo: "/logo.jpg",
  };
  const routeNames = {
    "/dashboard": "Dashboard",
    "/users": "Users",
    "/videos": "Videos",
    "/assessment": "Assessments",
    "/test": "Test",
    "/certificate": "Certificate",
    "/test-detail": "Test Detail",
  };
  const currentRouteName = routeNames[location.pathname] || "Welcome";
  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
    { text: "Users", link: "/users", icon: <PeopleIcon /> },
    { text: "Videos", link: "/videos", icon: <VideoLibraryIcon /> },
    { text: "Assessment ", link: "/assessment", icon: <AssignmentIcon /> },
    { text: "Test ", link: "/test", icon: <PendingActionsIcon /> },
    {
      text: "Certificate ",
      link: "/certificate",
      icon: <WorkspacePremiumIcon />,
    },

  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={`${open ? "" : "appbar-open"}`}
        open={open}
        sx={{
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          marginLeft: open ? drawerWidth : 0,
          transition: "all 0.3s",
          background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {currentRouteName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            <Avatar
              alt="Company Logo"
              src={user.logo}
              sx={{
                width: open ? 56 : 40,
                height: open ? 56 : 40,
                marginRight: open ? "12px" : 0,
                transition: "all 0.3s ease",
              }}
            />
            {open && (
              <Box>
                <Typography variant="h7">{user.companyName}</Typography>
                <Typography>{user.role}</Typography>
              </Box>
            )}
          </Box>
        </DrawerHeader>
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
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor: isSelected
                    ? "rgba(0, 0, 0, 0.2)"
                    : "transparent",
                  color: isSelected ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? "rgba(0, 0, 0, 0.3)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: isSelected ? "#fff" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List className="position-relative h-100">
          <ListItem
            button
            onClick={handleLogout}
            className="position-absolute bottom-0 w-100"
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#600b0b",
                color: "#fff",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
