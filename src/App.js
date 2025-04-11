import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect,useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import Watermark from './components/Watermark';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import SetNewPassword from './pages/SetNewPassword';
import Loader from './components/Loader';

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        <Watermark />
        {/* {loading && <Loader />} */}

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/set-password" element={<SetNewPassword />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div style={{ display: 'flex' }}>
                  <Sidebar />
                  <div style={{ marginLeft: 240, padding: 20, width: '100%' }}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Box>
      <ToastContainer />
    </Router>
  );
}

export default App;
