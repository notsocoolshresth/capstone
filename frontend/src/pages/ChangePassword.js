import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { severity, message }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setResult({ severity: "error", message: "All fields are required." });
      return;
    }
    if (form.newPassword.length < 6) {
      setResult({ severity: "error", message: "New password must be at least 6 characters." });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setResult({ severity: "error", message: "New passwords do not match." });
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setResult({ severity: "error", message: "New password must be different from the current one." });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setResult({ severity: "success", message: res.data.message });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setResult({
        severity: "error",
        message: err.response?.data?.message || "Failed to change password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter your current password and choose a new one.
          </Typography>
        </Box>
        <Button variant="text" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
            fullWidth
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            helperText="Minimum 6 characters"
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            fullWidth
          />

          {result && (
            <Alert severity={result.severity}>{result.message}</Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? "Saving…" : "Change Password"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
