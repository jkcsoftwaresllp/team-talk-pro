import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/ChatLayout';
import AdminDashboard from './pages/AdminDashboard'; // ✅ Add this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />    
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* ✅ Admin route */}
      </Routes>
    </Router>
  );
}

export default App;
