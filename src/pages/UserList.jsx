import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Button, Snackbar, TextField } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const UserList = () => {
  // State for user list, current page, total pages, and error string
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Snackbar state for status messages (success/failure)
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({ message: '', color: '' });
  // State for search input to filter users
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch user data from API based on page number
  const fetchUsers = async (pageNumber) => {
    try {
      // Debug log for development purposes
      console.log('Fetching users for page:', pageNumber);
      const res = await api.get(`/api/users?page=${pageNumber}`);
      setUsers(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    if (page < 1) {
      setPage(1);
    }
    if (page > totalPages) {
      setPage(totalPages);
    }
    fetchUsers(page);
  }, [page]);

  // Handle deletion of a user and update status message
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      setOpen(true);
      setStatus({ message: 'User deleted successfully', color: '#39AD6F' });
      // Adjust page if no users left on current page
      if (users.length === 0 && page > 1) {
        setPage(page - 1);
      }
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setOpen(true);
      setStatus({ message: 'Failed to delete user', color: '#f44336' });
    }
  };

  // Close Snackbar when user dismisses message
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // Filter users based on combined first and last name matching the search term
  const filteredUsers = users.filter(user =>
    (`${user.first_name} ${user.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={status.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: status.color,
            color: 'white',
            fontWeight: 'bold',
          }
        }}
      />
      <div className="w-full">
        <header className='fixed z-1 top-0 flex justify-center items-center bg-sky-700 w-full p-3 pl-5'>
          <h1 className="text-2xl font-normal text-white">User Management</h1>
        </header>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* Search bar component for filtering user list */}
        <div className="search-bar flex justify-center mt-20">
          <TextField
            label="Search Users"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: '500px' }}
          />
        </div>
        {/* User cards are displayed below */}
        <div className="flex flex-wrap gap-6 mt-6 items-center justify-center">
          {(filteredUsers.length !== 0)
            ? filteredUsers.map(user => (
                <div key={user.id} className="p-6 flex gap-3 flex-col justify-between items-center bg-gray-100 rounded-lg shadow-md">
                  <img src={user.avatar} className='h-30 rounded-full' alt={`${user.first_name} ${user.last_name}`} />
                  <p className='font-bold'>{user.first_name} {user.last_name}</p>
                  <div className="mt-1">
                    <Link to={`/edit/${user.id}`}>
                      <Button size='small' variant="contained" color="primary" onClick={() => navigate(`/users/${user.id}`)} style={{ marginRight: '10px' }}>
                        Edit
                      </Button>
                    </Link>
                    <Button loadingPosition="start" onClick={() => handleDelete(user.id)} size='small' variant="contained" color="error">
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            : <p>No data found</p>}
        </div>
        {/* Pagination controls */}
        <div className="pagination mt-10 flex justify-center items-center gap-4">
          <ArrowBackIosNewIcon className='scale-75 cursor-pointer' onClick={() => setPage(page - 1)} />
          <span> {page} of {totalPages} </span>
          <ArrowForwardIosIcon className='scale-75 cursor-pointer' onClick={() => setPage(page + 1)} />
        </div>
      </div>
    </>
  );
};

export default UserList;
