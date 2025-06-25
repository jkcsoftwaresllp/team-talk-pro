import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormField from './FormField';
import ErrorMessage from './ErrorMessage';
import styles from '../css/LoginForm.module.css';
import apiClient from '../helper/apiClient.js';

function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.login(formData);
      localStorage.setItem('token', response.token); // Store JWT token
      setUser(response.user); // Set user state
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
        />
        <ErrorMessage message={error} />
        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Login'}
        </button>
        <p className={styles.toggle}>
          Don't have an account? <Link className={styles.toggleLink} to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;