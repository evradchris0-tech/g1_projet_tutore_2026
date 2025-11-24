// import axios from 'axios';

// export const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Ajouter un intercepteur pour inclure le token d'authentification dans les en-têtes
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   const publicEndpoints = ['/auth/register', '/auth/login'];
//   const isPublicEndpoint = publicEndpoints.some(endpoint => config.url === endpoint);

//   if (token && !isPublicEndpoint) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // export const authAPI = {
// //   register: (userData) => api.post('/auth/register', userData),
// //   login: (credentials) => api.post('/auth/login', credentials),
// //   // getProfile: () => api.get('/auth/profile'),
// // };

// // export default api;

import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://immo360-api-gateway.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const publicEndpoints = ['/auth/register', '/auth/login']
  const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url === endpoint)

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
