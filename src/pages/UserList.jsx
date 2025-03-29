import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api'
import { Button, Snackbar } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({ message: '', color: '' });

  const fetchUsers = async (pageNumber) => {
    try {
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      setOpen(true);
      setStatus({ message: 'User deleted successfully', color: '#39AD6F' });
      if (users.length === 0 && page > 1) {
        setPage(page - 1);
      }
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setOpen(true)
      setStatus({ message: 'Failed to delete user', color: '#f44336' });
    }
  };

  const handleClose = (
    event, reason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={status.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': { // Targeting the root content of the Snackbar
            backgroundColor: status.color, // Red background color
            color: 'white',
            fontWeight: 'bold',
          }
        }}
      />
      <div className="w-full">
        <header className='fixed top-0 flex justify-center items-center bg-sky-700 w-full p-3 pl-5'>
          <h1 className="text-2xl font-normal text-white">User Management</h1>
        </header>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="flex flex-wrap gap-6 mt-20 items-center justify-center">
          {(users.length != 0) ? users.map(user => (
            <div key={user.id} className="p-6 flex gap-3 flex-col justify-between items-center bg-gray-100 rounded-lg shadow-md">
              <img src={user.avatar} className='h-30 rounded-full' alt={`${user.first_name} ${user.last_name}`} />
              <p className='font-bold'>{user.first_name} {user.last_name}</p>
              <div className="mt-1">
                <Link to={`/edit/${user.id}`}><Button size='small' variant="contained" color="primary" onClick={() => navigate(`/users/${user.id}`)} style={{ marginRight: '10px' }}>Edit</Button></Link>
                <Button loadingPosition="start" onClick={() => handleDelete(user.id)} size='small' variant="contained" color="error">Delete</Button>
              </div>
            </div>
          )) : <p>No data found</p>}
        </div>
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
