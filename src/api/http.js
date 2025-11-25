import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://immo360-auth-service.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Ajouter un intercepteur pour inclure le token d'authentification dans les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const publicEndpoints = ['/auth/login', '/auth/register']
  const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url === endpoint)

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})