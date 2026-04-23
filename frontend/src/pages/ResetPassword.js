import React, { useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  getErrorMessage,
  validateResetPasswordForm,
} from "../utils/formValidation";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleResetPassword = async () => {
    try {
      const payload = validateResetPasswordForm(form);
      const res = await API.post(`/auth/reset-password/${token}`, {
        password: payload.password
      });

      alert(res.data.message || "Password reset successfully!");
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Invalid or expired token"));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="New Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        fullWidth
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" size="large" onClick={handleResetPassword} fullWidth sx={{ py: 1.25 }}>
        Update Password
      </Button>
    </Box>
  );
};

export default ResetPassword;
