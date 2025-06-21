import React from "react";
import {BrowserRouter as Router,Routes,Route}from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
function App(){
    return (
        <Router>
            <Routes>
                <Route path="/"element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}