import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Button,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BlockedAccountPage = () => {
  const navigate = useNavigate();
  const superAdminEmail = "superadmin@example.com";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "linear-gradient(to right, #3f87a6, #ebf8e1)" }}
    >
      <Card sx={{ width: "100%", maxWidth: 450, p: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 2,
            }}
          >
            <Lock color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Account Blocked
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your account has been blocked. Please contact the super
              administrator for assistance.
            </Typography>
            <Typography variant="body1">Contact Super Admin:</Typography>
            <Typography
              variant="body1"
              component="a"
              href={`mailto:${superAdminEmail}`}
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {superAdminEmail}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                mt: 2,
                background: "linear-gradient(to right, #3f87a6, #ebf8e1)",
                color: "#000",
                fontWeight: "bold",
                borderRadius: "10px",
                height: 48,
              }}
            >
              Back to Login Page
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlockedAccountPage;
