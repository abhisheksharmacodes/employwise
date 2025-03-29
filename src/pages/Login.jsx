import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Paper, Box, TextField, Button, Typography, Snackbar } from '@mui/material';

const Login = () => {
  // State to hold email and password
  const [credentials, setCredentials] = useState({ email: 'eve.holt@reqres.in', password: 'cityslicka' });
  // State for per-field validation errors
  const [errors, setErrors] = useState({ email: '', password: '' });
  // Snackbar open state for global error
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Validate user input fields with meaningful error messages
  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required.'; // Email cannot be empty
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        newErrors.email = 'Invalid email format.'; // Check email format
        isValid = false;
      }
    }
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required.'; // Password cannot be empty
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Handle the login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if validation fails
    try {
      // Make an API call to login endpoint
      const res = await api.post('/api/login', credentials);
      localStorage.setItem('token', res.data.token); // Save token to local storage
      navigate('/users'); // Redirect to user list page on success
    } catch (err) {
      setOpen(true); // Trigger error snackbar on failed login
    }
  };

  // Close Snackbar function
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <>
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
      <div className='w-fit mx-auto mt-10 p-0'>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Login
          </Typography>
          <Box component="form" className='flex flex-col' onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Email input field */}
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={credentials.email}
              onChange={(e) => {
                setCredentials({ ...credentials, email: e.target.value });
                setErrors({ ...errors, email: '' }); // Reset email error on change
              }}
              sx={{ maxWidth: '300px' }}
              required
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            {/* Password input field */}
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
                setErrors({ ...errors, password: '' }); // Reset password error on change
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
      </div>
    </>
  );
};

export default Login;
