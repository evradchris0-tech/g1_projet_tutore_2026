import { api } from '../api/http'

// Fonction pour s'inscrire
export async function register(userData) {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    throw error
  }
}

// Fonction pour se connecter
export async function login(username, password) {
  try {
    const response = await api.post('/auth/login', { username, password })
    localStorage.setItem('token', response.data.token)
    return response
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    throw error
  }
}

// Fonction pour se déconnecter
export async function logout() {
  await api.post('/auth/logout')
  localStorage.removeItem('token')
}

// Fonction pour vérifier l'authentification
export function isAuthenticated() {
  return !!localStorage.getItem('token')
}

// Fonction pour obtenir les informations de l'utilisateur connecté
export async function getCurrentUser() {
  try {
    const response = await api.get('/me')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error)
    throw error
  }
}
