import { apiGet, apiPost, apiPatch, apiDelete } from './api'
import { fetchWithAuth } from './httpClient'

const USERS_BASE = '/users'

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// --- CRUD de base ---
export const listUsers = async ({ page = 1, limit = 20, role, status, search } = {}) => {
  const query = buildQuery({ page, limit, role, status, search })
  return apiGet(`${USERS_BASE}${query}`)
}

export const getUserById = async (id) => apiGet(`${USERS_BASE}/${id}`)

export const createUser = async (userPayload) => apiPost(USERS_BASE, userPayload)

export const updateUser = async (id, updates) => apiPatch(`${USERS_BASE}/${id}`, updates)

export const deleteUser = async (id) => apiDelete(`${USERS_BASE}/${id}`)

// --- Assignation de chambre ---
export const assignRoom = async (id, payload) =>
  apiPatch(`${USERS_BASE}/${id}/assign-room`, payload)

// --- Import / Validation Excel ---
export const validateExcel = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetchWithAuth(`${USERS_BASE}/import/validate`, {
    method: 'POST',
    body: formData
  })

  const payload = await response.json()
  if (!response.ok) {
    const message =
      Array.isArray(payload?.message) ? payload.message.join('\n') : payload?.message
    const error = new Error(message || 'Validation du fichier échouée.')
    error.statusCode = response.status
    throw error
  }
  return payload
}

export const uploadExcel = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetchWithAuth(`${USERS_BASE}/import/upload`, {
    method: 'POST',
    body: formData
  })

  const payload = await response.json()
  if (!response.ok) {
    const message =
      Array.isArray(payload?.message) ? payload.message.join('\n') : payload?.message
    const error = new Error(message || "Import du fichier échoué.")
    error.statusCode = response.status
    throw error
  }
  return payload
}

export const importOccupants = async (file, academicSessionId) => {
  const formData = new FormData()
  formData.append('file', file)
  if (academicSessionId) formData.append('academicSessionId', academicSessionId)

  const response = await fetchWithAuth(`${USERS_BASE}/import/occupants`, {
    method: 'POST',
    body: formData
  })

  const payload = await response.json()
  if (!response.ok) {
    const message =
      Array.isArray(payload?.message) ? payload.message.join('\n') : payload?.message
    const error = new Error(message || "Import des occupants échoué.")
    error.statusCode = response.status
    throw error
  }
  return payload
}

// --- Export / Template ---
export const exportUsers = async () => {
  const response = await fetchWithAuth(`${USERS_BASE}/import/export`, {
    method: 'GET'
  })
  if (!response.ok) {
    const error = new Error('Export échoué.')
    error.statusCode = response.status
    throw error
  }
  return response.blob()
}

export const downloadTemplate = async () => {
  const response = await fetchWithAuth(`${USERS_BASE}/import/template`, {
    method: 'GET'
  })
  if (!response.ok) {
    const error = new Error('Téléchargement du template échoué.')
    error.statusCode = response.status
    throw error
  }
  return response.blob()
}

