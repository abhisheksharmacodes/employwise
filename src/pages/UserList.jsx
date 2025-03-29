import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const UserList = () => {
  // ...existing code...
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert('Deletion failed.');
    }
  };

  return (
    <div className="container">
      <h2>User List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
            <p>{user.first_name} {user.last_name}</p>
            <div>
              <Link to={`/edit/${user.id}`} style={{ marginRight: '10px' }}>Edit</Link>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default UserList;
