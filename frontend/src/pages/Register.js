import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { getErrorMessage, validateRegisterForm } from "../utils/formValidation";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRegister = async () => {
    try {
      const payload = validateRegisterForm(form);
      await API.post("/auth/register", payload);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>

        <Typography variant="body2" align="center">
          Already have an account? <Link to="/">Login</Link>
        </Typography>
      </Box>
  );
};

export default Register;
