import {
  Box,
  Button,
  Card,
  Typography,
  TextField
} from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { otpVerify } from "../api/auth";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setOtpError("Please enter the 4-digit OTP.");
      return;
    }

    setLoading(true);
    setOtpError("");

    try {
      const res = await otpVerify({ otp: enteredOtp,email });
        toast.success(res?.message[0], { autoClose: 3000 });
        navigate("/set-password",{ state: { email } });
    } catch (err) {
      setOtpError(err?.response?.data?.message[0] || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{ background: "linear-gradient(to right, #3f87a6, #ebf8e1)" }}
    >
      <Card sx={{
        p: 4,
        width: 400,
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.99)",
        textAlign: "center"
      }}>
        <img src="/logo.jpg" alt="logo" style={{ width: 60, marginBottom: 20 }} />
        <Typography variant="h5" mb={2}>Verify OTP</Typography>

        <Box display="flex" justifyContent="center" gap={2} mb={2}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={el => inputRefs.current[index] = el}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 18 } }}
              sx={{
                width: 50,
                '& .MuiOutlinedInput-root': {
                  borderRadius: "10px",
                  border: '1px solid #ccc',
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#999',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#000',
                  },
                },
              }}
            />
          ))}
        </Box>

        {otpError && (
          <Typography color="error" fontSize={14} mb={1}>
            {otpError}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerify}
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
            "Verify OTP"
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

export default VerifyOTP;
