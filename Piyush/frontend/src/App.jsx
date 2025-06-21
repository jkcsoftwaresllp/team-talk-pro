import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import RegistrationForm from './components/jsx/RegistrationForm';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<div>Login Page (To be implemented)</div>} />
        <Route path="/" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;