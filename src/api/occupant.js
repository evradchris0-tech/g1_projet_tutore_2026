import { api } from './http'

// Fonction pour créer un nouvel occupant
export async function createOccupant(occupantData) {
  try {
    const response = await api.post('/occupants', occupantData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la création de l\'occupant:', error)
    throw error
  }
}

// Fonction pour récupérer tous les occupants
export async function getOccupants() {
  try {
    const response = await api.get('/occupants')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des occupants:', error)
    throw error
  }
}

// Fonction pour mettre à jour un occupant existant
export async function updateOccupant(occupantId, occupantData) {
  try {
    const response = await api.put(`/occupants/${occupantId}`, occupantData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'occupant:', error)
    throw error
  }
}

// Fonction pour supprimer un occupant
export async function deleteOccupant(occupantId) {
  try {
    const response = await api.delete(`/occupants/${occupantId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'occupant:', error)
    throw error
  }
}

// Fonction pour récupérer un occupant par son ID
export async function getOccupantById(occupantId) {
  try {
    const response = await api.get(`/occupants/${occupantId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'occupant:', error)
    throw error
  }
}

// Fonction pour rechercher des occupants par nom
export async function searchOccupantsByName(name) {
  try {
    const response = await api.get(`/occupants/search`, {
      params: { name }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des occupants:', error)
    throw error
  }
}