import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://immo360-auth-service.onrender.com',
  withCredentials: true,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

// Ajouter un intercepteur pour inclure le token d'authentification dans les en-têtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



