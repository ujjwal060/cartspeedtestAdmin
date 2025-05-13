// Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
import { Box } from "@mui/material";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    if (mediaQuery.matches) setSidebarOpen(false);

    const handleResize = () => {
      setSidebarOpen(!mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Box sx={{ flex: 1 }}>
        {/* <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        <Box
          sx={{ marginTop: 8, padding: 2 }}
          className={`${sidebarOpen ? "content-open" : "w-100"}`}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
