// En développement, utiliser le proxy Vite pour éviter les problèmes CORS
const isDev = import.meta.env?.DEV
const ENV_AUTH_API_BASE_URL = import.meta.env?.VITE_API_BASE_URL_FOR_AUTH

// En dev: proxy local /api-auth -> backend | En prod: URL directe
const API_BASE_URL = isDev ? '/api-auth' : (ENV_AUTH_API_BASE_URL || '').replace(/\/+$/, '')

const STORAGE_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
  SESSION: 'sessionToken',
  AUTH_FLAG: 'isAuthenticated',
  USERNAME: 'username'
}

function storeAuthTokens({ accessToken, refreshToken, sessionToken, user }) {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS, accessToken)
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH, refreshToken)
  if (sessionToken) localStorage.setItem(STORAGE_KEYS.SESSION, sessionToken)
  if (user?.email) localStorage.setItem(STORAGE_KEYS.USERNAME, user.email)
  localStorage.setItem(STORAGE_KEYS.AUTH_FLAG, 'true')
}

function getStoredTokens() {
  return {
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS) || '',
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH) || '',
    sessionToken: localStorage.getItem(STORAGE_KEYS.SESSION) || ''
  }
}

function clearAuthTokens() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS)
  localStorage.removeItem(STORAGE_KEYS.REFRESH)
  localStorage.removeItem(STORAGE_KEYS.SESSION)
  localStorage.removeItem(STORAGE_KEYS.USERNAME)
  localStorage.removeItem(STORAGE_KEYS.AUTH_FLAG)
}

export async function login(email, password) {
  // En dev, le proxy est toujours disponible. En prod, on vérifie la variable d'env.
  if (!isDev && !ENV_AUTH_API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL_FOR_AUTH est manquant. Définissez-le dans .env (ex: https://auth-api... ).'
    )
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  let payload = null
  try {
    payload = await response.json()
  } catch (error) {
    // Le backend devrait toujours répondre en JSON, mais on garde une erreur claire en fallback
    throw new Error("Impossible d'analyser la réponse du serveur.")
  }

  if (!response.ok) {
    const message =
      Array.isArray(payload?.message) ? payload.message.join('\n') : payload?.message
    const error = new Error(message || 'Impossible de se connecter pour le moment.')
    error.statusCode = response.status
    throw error
  }

  storeAuthTokens(payload)
  return payload
}

export async function refreshTokens() {
  const { refreshToken } = getStoredTokens()

  // En dev, le proxy est toujours disponible. En prod, on vérifie la variable d'env.
  if (!isDev && !ENV_AUTH_API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL_FOR_AUTH est manquant. Définissez-le dans .env (ex: https://auth-api... ).'
    )
  }

  if (!refreshToken) {
    throw new Error('Refresh token manquant, merci de vous reconnecter.')
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })

  let payload = null
  try {
    payload = await response.json()
  } catch (error) {
    throw new Error("Impossible d'analyser la réponse du serveur.")
  }

  if (!response.ok) {
    const message =
      Array.isArray(payload?.message) ? payload.message.join('\n') : payload?.message
    const error = new Error(message || 'Impossible de rafraîchir la session.')
    error.statusCode = response.status
    throw error
  }

  storeAuthTokens(payload)
  return payload
}

export async function logout() {
  const { accessToken } = getStoredTokens()

  // En dev, le proxy est toujours disponible. En prod, on vérifie la variable d'env.
  if (!isDev && !ENV_AUTH_API_BASE_URL) {
    clearAuthTokens()
    throw new Error(
      'VITE_API_BASE_URL_FOR_AUTH est manquant. Définissez-le dans .env (ex: https://auth-api... ).'
    )
  }

  // On tente l'appel backend, mais on purge local quoi qu’il arrive
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      }
    })
  } finally {
    clearAuthTokens()
  }
}

export {
  API_BASE_URL,
  storeAuthTokens,
  getStoredTokens,
  clearAuthTokens,
  STORAGE_KEYS
}

