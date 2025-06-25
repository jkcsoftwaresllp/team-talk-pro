// for adminpanel only

import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000/api/admin", 
  withCredentials: true,                      
});

// ==========================
// USERS
// ==========================
export const getAllUsers = () => API.get("/users");
export const banUser = (id) => API.patch(`/users/${id}/ban`);
export const removeUser = (id) => API.delete(`/users/${id}`); 

// ==========================
// CHANNEL STATS
// ==========================
export const getChannelStats = () => API.get("/channels/volume");

// ==========================
// SPAM MESSAGES
// ==========================
export const getSpamMessages = () => API.get("/messages/spam");
export const deleteMessage = (id) => API.delete(`/messages/${id}`);

// ==========================
// SPAM FILES
// ==========================
export const getSpamFiles = () => API.get("/files/spam");
export const deleteFile = (id) => API.delete(`/files/${id}`);

// ==========================
// RECYCLE BIN
// ==========================
export const getDeletedFiles = () => API.get("/files/deleted");
export const restoreFile = (id) => API.patch(`/files/${id}/restore`);
export const permanentlyDeleteFile = (id) => API.delete(`/files/${id}/hard`);
