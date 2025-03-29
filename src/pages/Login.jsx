import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Box, TextField, Button, Snackbar } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    // Validate email field
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Invalid email format');
        valid = false;
      } else {
        setEmailError('');
      }
    }
    // Validate password field
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (!valid) return;
    // Proceed with API call
    try {
      const res = await api.post('/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/users');
    } catch (err) {
      setOpen(true);
    }
  };

  const handleClose = (
    event, reason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Login failed. Check your credentials."
        sx={{
          '& .MuiSnackbarContent-root': { // Targeting the root content of the Snackbar
            backgroundColor: '#f44336', // Red background color
            color: 'white',
            fontWeight: 'bold',
          }
        }}
      />
      <div className="flex justify-center items-center h-screen">
        <div className="p-5 border border-gray-300 rounded shadow flex flex-col gap-6">
          <h1 className='text-2xl font-semibold'>Login</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { mb: 2, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <div className="flex flex-col gap-2">
                <TextField
                  id="outlined-helperText"
                  label="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-80 m-0"
                  required
                />
                {emailError && <p className="text-red-500 text-sm -mt-5 mb-2 text-center">{emailError}</p>}
                <TextField
                  id="outlined-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full m-0"
                />
                {passwordError && <p className="text-red-500 -mt-5 mb-2 text-sm text-center">{passwordError}</p>}
              </div>
            </Box>
            <Button type="submit" className="w-full mt-8" size="large" variant="contained">Log in</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
