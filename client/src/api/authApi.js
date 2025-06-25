// src/api/authApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);
export const logout = () => API.post("/logout");
