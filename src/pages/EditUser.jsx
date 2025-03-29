import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Container, Paper, Box, TextField, Button, Typography, Snackbar } from '@mui/material';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
  const [errors, setErrors] = useState({ first_name: '', last_name: '', email: '' });
  const [globalError, setGlobalError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await api.get(`/api/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      setGlobalError('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const validate = () => {
    const newErrors = { first_name: '', last_name: '', email: '' };
    let isValid = true;
    if (!user.first_name.trim()) {
      newErrors.first_name = 'First name is required.';
      isValid = false;
    }
    if (!user.last_name.trim()) {
      newErrors.last_name = 'Last name is required.';
      isValid = false;
    }
    if (!user.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        newErrors.email = 'Invalid email format.';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setGlobalError('');
    try {
      await api.put(`/api/users/${id}`, user);
      navigate('/users');
    } catch (err) {
      setOpen(true);
    }
  };

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
        message="Update failed."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#f44336',
            color: 'white',
            fontWeight: 'bold',
          }
        }}
      />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Edit User
          </Typography>
          {globalError && <Typography color="error" sx={{ mb: 2 }}>{globalError}</Typography>}
          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              label="First Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={user.first_name}
              onChange={(e) => {
                setUser({ ...user, first_name: e.target.value });
                setErrors({ ...errors, first_name: '' });
              }}
              required
              error={Boolean(errors.first_name)}
              helperText={errors.first_name}
            />
            <TextField
              label="Last Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={user.last_name}
              onChange={(e) => {
                setUser({ ...user, last_name: e.target.value });
                setErrors({ ...errors, last_name: '' });
              }}
              required
              error={Boolean(errors.last_name)}
              helperText={errors.last_name}
            />
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              type="email"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              required
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <Box className="mt-2 flex justify-center gap-4">
              <Button variant="contained" color="primary" type="submit">
                Update User
              </Button>
              <Button variant="outlined" onClick={() => navigate('/users')} sx={{ color: '#0080ff', borderColor: '#0080ff' }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default EditUser;