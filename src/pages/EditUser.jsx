import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const EditUser = () => {
  // ...existing code...
  const { id } = useParams();
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      // Reqres does not have a dedicated endpoint to get a single user detail in the same shape as needed.
      // We simulate it by calling the list endpoint or pre-filling from local state.
      const res = await api.get(`/api/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      setError('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${id}`, user);
      alert('User updated successfully.');
      navigate('/users');
    } catch (err) {
      setError('Update failed.');
    }
  };

  return (
    <div className="container">
      <h2>Edit User</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input 
          type="text" 
          value={user.first_name} 
          onChange={(e) => setUser({ ...user, first_name: e.target.value })} 
          required 
        />
        <label>Last Name:</label>
        <input 
          type="text" 
          value={user.last_name} 
          onChange={(e) => setUser({ ...user, last_name: e.target.value })} 
          required 
        />
        <label>Email:</label>
        <input 
          type="email" 
          value={user.email} 
          onChange={(e) => setUser({ ...user, email: e.target.value })} 
          required 
        />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default EditUser;
