import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://immo360-auth-service.onrender.com',
  // baseURL: 'http://localhost:3001',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Ajouter un intercepteur pour inclure le token d'authentification dans les en-têtes
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const publicEndpoints = ['/auth/register', '/auth/login'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url === endpoint);
  
  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (credentials) => api.post('/auth/login', credentials),
//   // getProfile: () => api.get('/auth/profile'),
// };



// export default api;
