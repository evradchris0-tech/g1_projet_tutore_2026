import { api } from './http'

// Fonction pour créer un nouvel bâtiment
export async function createBuilding(buildingData) {
  try {
    const response = await api.post('/buildings', buildingData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la création du bâtiment:', error)
    throw error
  }
}

// Fonction pour récupérer tous les bâtiments
export async function getBuildings() {
  try {
    const response = await api.get('/buildings')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des bâtiments:', error)
    throw error
  }
}

// Fonction pour mettre à jour un bâtiment existant
export async function updateBuilding(buildingId, buildingData) {
  try {
    const response = await api.put(`/buildings/${buildingId}`, buildingData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bâtiment:', error)
    throw error
  }
}

// Fonction pour supprimer un bâtiment
export async function deleteBuilding(buildingId) {
  try {
    const response = await api.delete(`/buildings/${buildingId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la suppression du bâtiment:', error)
    throw error
  }
}

// Fonction pour récupérer un bâtiment par son ID
export async function getBuildingById(buildingId) {
  try {
    const response = await api.get(`/buildings/${buildingId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération du bâtiment:', error)
    throw error
  }
}

// Fonction pour rechercher des bâtiments par nom
export async function searchBuildingsByName(name) {
  try {
    const response = await api.get(`/buildings/search`, {
      params: { name }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des bâtiments:', error)
    throw error
  }
}