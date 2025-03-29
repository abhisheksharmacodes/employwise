import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Paper, Box, TextField, Button, Typography, Snackbar } from '@mui/material';

const EditUser = () => {
  const { id } = useParams();
  // State to hold user details for editing
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
  // Per-field validation errors
  const [errors, setErrors] = useState({ first_name: '', last_name: '', email: '' });
  const [open, setOpen] = useState(false); // Snackbar open state for error notifications
  const navigate = useNavigate();

  // Fetch user details from API for pre-filling the form
  const fetchUser = async () => {
    try {
      const res = await api.get(`/api/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      setOpen(true); // Open Snackbar when fetch fails
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // Validate user inputs with meaningful error messages
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

  // Submit updated user information to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Do not submit if validation fails
    try {
      await api.put(`/api/users/${id}`, user);
      navigate('/users'); // Redirect back to user list on success
    } catch (err) {
      setOpen(true); // Open Snackbar if update fails
      console.error('Error updating user:', err);
    }
  };

  // Close Snackbar
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
          '& .MuiSnackbarContent-root': { backgroundColor: '#f44336', color: 'white', fontWeight: 'bold' }
        }}
      />
      <div className='w-fit mx-auto mt-10 p-0'>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Edit User
          </Typography>
          <Box component="form" className='flex flex-col' onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* First Name field */}
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
              sx={{ maxWidth: '300px' }}
              error={Boolean(errors.first_name)}
              helperText={errors.first_name}
            />
            {/* Last Name field */}
            <TextField
              label="Last Name"
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ maxWidth: '300px' }}
              value={user.last_name}
              onChange={(e) => {
                setUser({ ...user, last_name: e.target.value });
                setErrors({ ...errors, last_name: '' });
              }}
              required
              error={Boolean(errors.last_name)}
              helperText={errors.last_name}
            />
            {/* Email field */}
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              sx={{ maxWidth: '300px' }}
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
      </div>
    </>
  );
};

export default EditUser;