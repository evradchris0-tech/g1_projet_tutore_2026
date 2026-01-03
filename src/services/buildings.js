import { apiGet, apiPost, apiPatch, apiDelete } from './api'

const BUILDINGS_BASE = '/buildings'

// Mock data for blocks/wings
const MOCK_BLOCKS = {
  1: [{ id: 'A', name: 'Aile A', description: 'Aile principale' }, { id: 'B', name: 'Aile B', description: 'Aile secondaire' }],
  2: [{ id: 'A', name: 'Aile A', description: 'Aile pédagogique' }],
  3: [{ id: 'Nord', name: 'Bloc Nord', description: 'Chambres 1-50' }, { id: 'Sud', name: 'Bloc Sud', description: 'Chambres 51-96' }],
  4: [{ id: 'Principal', name: 'Bloc Principal', description: 'Bâtiment principal' }]
}

export const listBuildings = async (params = {}) => {
  return apiGet(BUILDINGS_BASE, { params })
}

export const createBuilding = async (payload) => apiPost(BUILDINGS_BASE, payload)

export const updateBuilding = async (id, payload) => apiPatch(`${BUILDINGS_BASE}/${id}`, payload)

export const deleteBuilding = async (id) => apiDelete(`${BUILDINGS_BASE}/${id}`)

// Blocks/Wings
export const getBlocksForBuilding = async (buildingId) => {
  // TODO: Remplacer par fetch réel lors de l'intégration
  return Promise.resolve(MOCK_BLOCKS[buildingId] || [])
}

// Floors
export const listFloors = async (buildingId) => apiGet(`${BUILDINGS_BASE}/${buildingId}/floors`)
export const createFloor = async (buildingId, payload) =>
  apiPost(`${BUILDINGS_BASE}/${buildingId}/floors`, payload)

// Spaces
export const listSpaces = async (floorId) => apiGet(`/floors/${floorId}/spaces`)
export const createSpace = async (floorId, payload) =>
  apiPost(`/floors/${floorId}/spaces`, payload)

