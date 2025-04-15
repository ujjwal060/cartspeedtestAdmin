import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { Box } from "@mui/material";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import Watermark from "./components/Watermark";
import Loader from "./components/Loader";
import TestDashboard from "./pages/TestDashboard";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const SetNewPassword = lazy(() => import("./pages/SetNewPassword"));
const Users = lazy(() => import("./pages/Users"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const VideoDashboard = lazy(() => import("./pages/VideoDashboard"));

function App() {
  return (
    <Router>
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
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

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/Videos" element={<VideoDashboard />} />
                <Route path="/tests" element={<TestDashboard />} />
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
