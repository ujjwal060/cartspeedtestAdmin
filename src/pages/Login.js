import {
  Box, Button, Card, Checkbox, FormControlLabel, TextField, Typography,
  InputAdornment, IconButton,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { toast } from 'react-toastify';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
      setEmailError("");
    }
    if (e.target.name === 'password') {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!formData.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Invalid email address");
      isValid = false;
    }

    if (!formData.password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem('keepLogin', keepLoggedIn ? 'true' : 'false');

      toast.success('Login successful!', {
        autoClose: 3000,
      });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message[0] || "Login failed", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeepLoggedInChange = (e) => {
    setKeepLoggedIn(e.target.checked);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{ background: "linear-gradient(to right, #3f87a6, #ebf8e1)" }}
    >
      <Card sx={{ p: 4, width: 400, borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", textAlign: "center" }}>
        <img src="/logo.jpg" alt="avatar" style={{ width: 60, marginBottom: 20 }} />
        <Typography variant="h6" mb={2}>Login to your account</Typography>

        {error && (
          <Typography color="error" fontSize={14} mb={1}>{error}</Typography>
        )}

        <TextField
          fullWidth
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "#000" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: "#000" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": { borderColor: "#000" },
            },
          }}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          fullWidth
          placeholder="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "#000" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff sx={{ color: "#000" }} /> : <Visibility sx={{ color: "#000" }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: "#000" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": { borderColor: "#000" },
            },
          }}
          error={!!passwordError}
          helperText={passwordError}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={<Checkbox sx={{ color: "#000" }} checked={keepLoggedIn} onChange={handleKeepLoggedInChange} />}
            label={<Typography sx={{ fontSize: 14 }}>Keep me logged in</Typography>}
          />
          <Typography
            sx={{ fontSize: 14, textDecoration: "underline", cursor: "pointer", color: "#1976d2" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            mt: 2,
            background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "10px",
            height: 48,
          }}
        >
          {loading ? (
            <Box className="dot-loader" />
          ) : (
            "Login"
          )}
        </Button>

        <style>
          {`
            .dot-loader {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .dot-loader::before,
            .dot-loader::after,
            .dot-loader {
              content: '';
              display: inline-block;
              width: 8px;
              height: 8px;
              margin: 0 2px;
              background-color: #000;
              border-radius: 50%;
              animation: bounce 0.6s infinite ease-in-out both;
            }

            .dot-loader::before {
              animation-delay: -0.32s;
            }

            .dot-loader::after {
              animation-delay: -0.16s;
            }

            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1); }
            }
          `}
        </style>
      </Card>
    </Box>
  );
};

export default Login;
