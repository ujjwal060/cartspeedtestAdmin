import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    InputAdornment
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgot } from "../api/auth";
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        if (!email) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email address");
            isValid = false;
        } else {
            setEmailError("");
        }
        return isValid;
    };

    const handleSendOTP = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await forgot({ email });  
            toast.success(res?.message[0], { autoClose: 3000 });
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            toast.error(err?.response?.data?.message[0] || "Failed to send OTP", {
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
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
            <Card
                sx={{
                    p: 4,
                    width: 400,
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    textAlign: "center"
                }}
            >
                <img src="/logo.jpg" alt="logo" style={{ width: 60, marginBottom: 20 }} />
                <Typography variant="h6" mb={2}>Forgot Password</Typography>

                <TextField
                    fullWidth
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    error={!!emailError}
                    helperText={emailError}
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
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSendOTP}
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
                        "Send OTP"
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

export default ForgotPassword;
