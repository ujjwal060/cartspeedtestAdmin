import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {authenticateUser,refreashToken} from '../api/auth'

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const keepLogin = localStorage.getItem('keepLogin');

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
      const res = await authenticateUser(token);  

        if (res.data.valid) {
          setAuthenticated(true);
        }
      } catch (err) {
        const expired = err.response?.data?.expired;
        if (expired && keepLogin && refreshToken) {
          try {
            const refreshRes = await refreashToken(refreshToken);
            localStorage.setItem('token', refreshRes.data.accessToken);
            setAuthenticated(true);
          } catch (refreshErr) {
            localStorage.clear();
            setAuthenticated(false);
          }
        } else {
          localStorage.clear();
          setAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) return null;

  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
