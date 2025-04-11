import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense,lazy } from 'react';
import { Box } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import Watermark from './components/Watermark';
import Loader from './components/Loader';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const SetNewPassword = lazy(() => import('./pages/SetNewPassword'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));



function App() {
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
        <Box sx={{ position: "relative", zIndex: 1 }}>
           <Suspense fallback={<Loader />}>
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
          </Suspense>
        </Box>
      </Box>
      <ToastContainer />
    </Router>
  );
}

export default App;
