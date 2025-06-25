import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

const apiClient = {
  register: async (formData) => {
    const res = await API.post('/user/register', formData);
    return res.data;
  },

    login: async (formData) => {
    const res = await API.post('/user/login', formData);
    return res.data;
  }
};

export default apiClient;
