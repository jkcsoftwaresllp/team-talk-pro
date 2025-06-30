import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/UserList.module.css';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/userlist/list', {
          withCredentials: true,
        });
        console.log('Fetched users:', response.data);
        
        const filteredUsers = response.data.filter(user => 
          currentUser ? user.id !== currentUser.id : true
        );
        setUsers(filteredUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleUserClick = (userId) => {
    console.log(`Navigating to chat with user ${userId}`);
    navigate(`/chat/${userId}`);
  };

  if (!currentUser) {
    return <div>Please log in to see users.</div>;
  }

  return (
    <div className={styles.userListContainer}>
      <h2>Select a user to chat with</h2>
      {loading ? (
        <div className={styles.loading}>Loading users...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : users.length === 0 ? (
        <div className={styles.noUsers}>No users found.</div>
      ) : (
        <div className={styles.userList}>
          {users.map((user) => (
            <div
              key={user.id}
              className={styles.userItem}
              onClick={() => handleUserClick(user.id)}
            >
              <div className={styles.userName}>{user.username}</div>
              <div className={styles.userId}>ID: {user.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;