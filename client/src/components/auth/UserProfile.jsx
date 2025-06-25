// src/components/auth/UserProfile.jsx
import { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import { getProfile, updateProfile } from "../../api/authApi";
import { useAuth } from "../../context/authContext";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    currentPassword: "",
    newPassword: "",
    role: "",
    profileImage: null
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        username: user.username || "",
        fullName: user.fullName || "",
        currentPassword: "",
        newPassword: "",
        role: user.role || "",
        profileImage: null
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("username", formData.username);
      data.append("fullName", formData.fullName);
      data.append("currentPassword", formData.currentPassword);
      data.append("newPassword", formData.newPassword);
      data.append("role", formData.role);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await updateProfile(data);
      setUser(res.data);
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className={styles.container}>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <input
          type="password"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        />

        <input
          type="text"
          placeholder="Role (admin/user)"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
        />

        <button type="submit">Update Profile</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
