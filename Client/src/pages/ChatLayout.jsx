// src/pages/ChatLayout.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChannelList from '../components/ChannelList';
import UserList from '../components/UserList';
import ChatArea from '../components/ChatArea';
import SettingsMenu from '../components/SettingsMenu';

const ChatLayout = () => {
  const [user, setUser] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState('general');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="chat-layout">
      <aside className="sidebar-left">
        <ChannelList setSelectedChatId={setSelectedChatId} />
        <UserList setSelectedChatId={setSelectedChatId} />
      </aside>

      <main className="chat-main">
        {user ? (
          <ChatArea user={user} selectedChatId={selectedChatId} />
        ) : (
          <p className="loading-msg">Loading chat...</p>
        )}
      </main>

      <aside className="sidebar-right">
        <SettingsMenu />
      </aside>
    </div>
  );
};

export default ChatLayout;
