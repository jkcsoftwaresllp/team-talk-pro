import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import RegistrationForm from './components/jsx/RegistrationForm';
import LoginForm from './components/jsx/LoginForm';
import HomePage from './components/jsx/HomePage';
import ChatPage from './components/jsx/ChatPage';
import UserList from './components/jsx/UserList.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm setUser={setUser} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/chat/:receiverId" element={<ChatPage />} />
        {/* Redirect /chat to /users */}
        <Route path="/chat" element={<Navigate to="/users" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;