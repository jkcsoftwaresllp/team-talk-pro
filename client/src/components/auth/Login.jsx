// src/components/auth/Login.jsx
import { useState } from "react";
import { login } from "../../api/authApi";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      setUser(res.data);
      navigate("/dashboard"); // or your protected page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}