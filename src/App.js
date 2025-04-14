import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Box } from "@mui/material";
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import Watermark from './components/Watermark';
import Loader from './components/Loader';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const SetNewPassword = lazy(() => import('./pages/SetNewPassword'));
// const Sidebar = lazy(() => import('./components/Sidebar'));
// const Navbar = lazy(() => import('./components/Navbar'));
const Users = lazy(() => import('./pages/Users'));
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
            {/* <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/set-password" element={<SetNewPassword />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <div style={{ display: 'flex' }}>
                    <Sidebar />
                    <Box sx={{ flex: 1 }}>
                      <Navbar />
                      <Box sx={{ marginTop: 8, padding: 2 }}>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                      </Box>
                    </Box>
                  </div>
                </ProtectedRoute>
              } />
            </Routes> */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/set-password" element={<SetNewPassword />} />

              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Routes>
          </Suspense>
        </Box>
      </Box>
      <ToastContainer />
    </Router>
  );
}

export default App;
