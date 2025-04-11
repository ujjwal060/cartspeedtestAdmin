import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from '../api/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SetNewPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleSetPassword = async () => {
    const isPasswordValid = validatePassword();

    if (!isPasswordValid) return;

    if (password !== confirm) {
      setConfirmError("Passwords do not match.");
      return;
    }

    setConfirmError("");

    try {
      const res = await resetPassword({ email, password });
      toast.success(res?.message[0], { autoClose: 3000 });
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message[0] || "Failed to reset password", {
        autoClose: 3000
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "linear-gradient(to right, #3f87a6, #ebf8e1)" }}
    >
      <Card sx={{
        p: 4,
        width: 400,
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <img src="/logo.jpg" alt="logo" style={{ width: 60, marginBottom: 20 }} />
        <Typography variant="h6" mb={2}>Set New Password</Typography>

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          error={!!passwordError}
          helperText={passwordError}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: "10px",
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#999' },
              '&.Mui-focused fieldset': { borderColor: '#000' }
            },
            input: { color: "#000" }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          fullWidth
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          variant="outlined"
          margin="normal"
          error={!!confirmError}
          helperText={confirmError}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: "10px",
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#999' },
              '&.Mui-focused fieldset': { borderColor: '#000' }
            },
            input: { color: "#000" }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSetPassword}
          sx={{
            mt: 2,
            background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "10px",
            height: 48,
          }}
        >
          Save
        </Button>
      </Card>
    </Box>
  );
}
