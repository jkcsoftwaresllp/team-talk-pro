import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import RegistrationForm from './components/jsx/RegistrationForm';
import LoginForm from './components/jsx/LoginForm';
import HomePage from './components/jsx/HomePage';
import ChatPage from './components/jsx/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        {/* <Route path="/login" element={<LoginForm />} /> */} <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;