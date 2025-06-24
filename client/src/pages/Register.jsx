import React, { useState } from 'react';
import api from '../api/axios.js'; // adjust path

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', form);
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || 'Register failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
