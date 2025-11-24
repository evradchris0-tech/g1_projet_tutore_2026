import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://immo360-api-gateway.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const publicEndpoints = ['/auth/login', '/auth/register']
  const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url === endpoint)

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})