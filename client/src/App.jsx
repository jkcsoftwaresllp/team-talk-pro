import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./ChatPage";

function App() {
  return (
    <Router>
      <div>
        <h1>TeamTalk Pro+</h1>
        <Routes>
          <Route path="/" element={<h2>Welcome to TeamTalk Pro+</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
