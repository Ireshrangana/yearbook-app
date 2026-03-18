import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await api.post('/api/auth/register', form);
      setMessage('Registration successful. You can sign in now.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Check the backend server.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, px: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} elevation={3}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h4">Register</Typography>
          {message ? <Alert severity="success">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField required label="Name" name="name" value={form.name} onChange={handleChange} />
          <TextField
            required
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            required
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Button disabled={submitting} type="submit" variant="contained" size="large">
            {submitting ? 'Creating account...' : 'Register'}
          </Button>
          <Button component={RouterLink} to="/login">
            Go to login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Register;
