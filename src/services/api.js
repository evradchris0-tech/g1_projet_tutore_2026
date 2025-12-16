import { fetchWithAuth } from './httpClient'

async function apiRequest(path, { method = 'GET', body, headers } = {}) {
  console.log(`[API] ${method} ${path}`)
  
  const response = await fetchWithAuth(path, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  })

  let payload = null
  try {
    payload = await response.json()
  } catch (error) {
    // On laisse payload à null si pas de JSON, on gère plus bas
  }

  if (!response.ok) {
    console.error(`[API] Erreur ${response.status}:`, payload)
    const message =
      Array.isArray(payload?.message) ? payload.message.join('\n') : payload?.message
    const error = new Error(message || `Erreur ${response.status} lors de la requête API.`)
    error.statusCode = response.status
    error.payload = payload
    throw error
  }

  return payload
}

const apiGet = (path, options = {}) => apiRequest(path, { ...options, method: 'GET' })
const apiPost = (path, body, options = {}) =>
  apiRequest(path, { ...options, method: 'POST', body })
const apiPatch = (path, body, options = {}) =>
  apiRequest(path, { ...options, method: 'PATCH', body })
const apiDelete = (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' })

export { apiGet, apiPost, apiPatch, apiDelete, apiRequest }

