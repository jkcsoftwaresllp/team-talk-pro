import React, { useState } from 'react';
import api from '../api/axios.js';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', form);
      alert(res.data.msg);
      // optionally redirect or store user info
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
