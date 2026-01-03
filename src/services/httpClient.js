import { getStoredTokens, refreshTokens, clearAuthTokens } from './auth'

// En développement, utiliser le proxy Vite pour éviter les problèmes CORS
const isDev = import.meta.env?.DEV
const ENV_USER_API_BASE_URL = import.meta.env?.VITE_API_BASE_URL_FOR_USER_MANAGEMENT

// En dev: proxy local /api-users -> backend | En prod: URL directe
const USER_API_BASE_URL = isDev ? '/api-users' : (ENV_USER_API_BASE_URL || '').replace(/\/+$/, '')

let refreshingPromise = null

async function ensureApiBaseUrl() {
  // En dev, le proxy est toujours disponible. En prod, on vérifie la variable d'env.
  if (!isDev && !ENV_USER_API_BASE_URL) {
    throw new Error(
      'VITE_API_BASE_URL_FOR_USER_MANAGEMENT est manquant. Définissez-le dans .env (ex: https://users-api...).'
    )
  }
}

function buildHeaders(accessToken, baseHeaders = {}) {
  const headers = new Headers(baseHeaders)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return headers
}

async function fetchWithAuth(path, options = {}) {
  await ensureApiBaseUrl()

  const { accessToken } = getStoredTokens()
  const headers = buildHeaders(accessToken, options.headers || {})

  // Première tentative
  const firstResponse = await fetch(`${USER_API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  if (firstResponse.status !== 401) {
    return firstResponse
  }

  // 401: tentative de rafraîchissement de token
  if (!refreshingPromise) {
    refreshingPromise = refreshTokens().finally(() => {
      refreshingPromise = null
    })
  }

  try {
    await refreshingPromise
  } catch (error) {
    clearAuthTokens()
    throw new Error(error?.message || 'Session expirée. Merci de vous reconnecter.')
  }

  const { accessToken: newAccessToken } = getStoredTokens()
  if (!newAccessToken) {
    clearAuthTokens()
    throw new Error('Session expirée. Merci de vous reconnecter.')
  }

  const retryHeaders = buildHeaders(newAccessToken, options.headers || {})

  return fetch(`${USER_API_BASE_URL}${path}`, {
    ...options,
    headers: retryHeaders
  })
}

export { fetchWithAuth, USER_API_BASE_URL }

