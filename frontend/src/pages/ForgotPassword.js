import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  getErrorMessage,
  validateForgotPasswordForm,
} from "../utils/formValidation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async () => {
    try {
      const payload = validateForgotPasswordForm(email);
      await API.post("/auth/forgot-password", payload);
      setSuccess("If the account exists, a reset link has been generated.");
      setError("");
    } catch (err) {
      setSuccess("");
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body2" align="center" color="text.secondary">
        Enter your registered email address and we&apos;ll send you a link to reset your password.
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
          setSuccess("");
        }}
        fullWidth
      />
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Button variant="contained" size="large" onClick={handleForgotPassword} fullWidth sx={{ py: 1.25 }}>
        Send Reset Link
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "underline" }}>
          Back to Login
        </Link>
      </Typography>
    </Box>
  );
};

export default ForgotPassword;
