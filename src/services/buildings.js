import { apiGet, apiPost, apiPatch, apiDelete } from './api'

const BUILDINGS_BASE = '/buildings'

export const listBuildings = async (params = {}) => {
  return apiGet(BUILDINGS_BASE, { params })
}

export const createBuilding = async (payload) => apiPost(BUILDINGS_BASE, payload)

export const updateBuilding = async (id, payload) => apiPatch(`${BUILDINGS_BASE}/${id}`, payload)

export const deleteBuilding = async (id) => apiDelete(`${BUILDINGS_BASE}/${id}`)

// Floors
export const listFloors = async (buildingId) => apiGet(`${BUILDINGS_BASE}/${buildingId}/floors`)
export const createFloor = async (buildingId, payload) =>
  apiPost(`${BUILDINGS_BASE}/${buildingId}/floors`, payload)

// Spaces
export const listSpaces = async (floorId) => apiGet(`/floors/${floorId}/spaces`)
export const createSpace = async (floorId, payload) =>
  apiPost(`/floors/${floorId}/spaces`, payload)

