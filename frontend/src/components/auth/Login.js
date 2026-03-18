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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { loginFail, loginSuccess } from '../../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', form);
      const payload = response.data || {};
      const token = payload.token || '';

      if (token) {
        localStorage.setItem('token', token);
      }

      dispatch(
        loginSuccess({
          token,
          user: payload.user || { email: form.email },
        })
      );
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Check the backend server.';
      setError(message);
      dispatch(loginFail(message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, px: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} elevation={3}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h4">Login</Typography>
          <Typography color="text.secondary">
            Sign in to access protected yearbooks.
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
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
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
