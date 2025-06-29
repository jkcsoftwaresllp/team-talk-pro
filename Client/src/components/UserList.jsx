import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const UserList = ({ setSelectedChatId }) => {
  const [activeUserId, setActiveUserId] = useState(null);
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice', isOnline: false },
    { id: '2', name: 'Bob', isOnline: false },
    { id: '3', name: 'Charlie', isOnline: false },
  ]);

  useEffect(() => {
    const loggedInUserId = 'user123'; // Replace with actual ID from auth
    socket.emit('userOnline', loggedInUserId);

    socket.on('userStatus', ({ userId, isOnline }) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isOnline } : user
        )
      );
    });

    return () => {
      socket.off('userStatus');
    };
  }, []);

  const handleSelect = (userId) => {
    setActiveUserId(userId);
    setSelectedChatId(userId);
  };

  return (
    <div className="user-list">
      <h2 className="user-title">Users</h2>
      <ul className="user-items">
        {users.map((user) => (
          <li
            key={user.id}
            className={`user-item ${user.isOnline ? 'online' : 'offline'} ${
              activeUserId === user.id ? 'active' : ''
            }`}
            onClick={() => handleSelect(user.id)}
          >
            <span className="status-dot"></span>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  setSelectedChatId: PropTypes.func.isRequired,
};

export default UserList;
