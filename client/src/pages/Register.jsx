import React, { useState } from 'react';
import AuthLayout from '../components/authLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6 text-black text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border border-black rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-[#4b2e2e] transition"
        >
          Register
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
