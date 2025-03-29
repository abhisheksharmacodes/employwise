import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Container, Paper, Box, TextField, Button, Typography, Snackbar } from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: 'eve.holt@reqres.in', password: 'cityslicka' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [globalError, setGlobalError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        newErrors.email = 'Invalid email format.';
        isValid = false;
      }
    }
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setGlobalError('');
    try {
      const res = await api.post('/api/login', credentials);
      localStorage.setItem('token', res.data.token);
      navigate('/users');
    } catch (err) {
      setGlobalError('Login failed. Please check your credentials.');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, px: 0 }}>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Login failed."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': { backgroundColor: '#f44336', color: 'white', fontWeight: 'bold' }
        }}
      />
      <Paper elevation={3} sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={credentials.email}
            onChange={(e) => {
              setCredentials({ ...credentials, email: e.target.value });
              setErrors({ ...errors, email: '' });
            }}
            sx={{ maxWidth: '300px' }}
            required
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            value={credentials.password}
            sx={{ maxWidth: '300px' }}
            onChange={(e) => {
              setCredentials({ ...credentials, password: e.target.value });
              setErrors({ ...errors, password: '' });
            }}
            required
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
