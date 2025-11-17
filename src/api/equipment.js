import { api } from './http'

// Fonction pour créer un nouvel équipement
export async function createEquipment(equipmentData) {
  try {
    const response = await api.post('/equipment', equipmentData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipement:', error)
    throw error
  }
}

// Fonction pour récupérer tous les équipements
export async function getEquipments() {
  try {
    const response = await api.get('/equipment')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements:', error)
    throw error
  }
}

// Fonction pour mettre à jour un équipement existant
export async function updateEquipment(equipmentId, equipmentData) {
  try {
    const response = await api.put(`/equipment/${equipmentId}`, equipmentData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'équipement:', error)
    throw error
  }
}

// Fonction pour supprimer un équipement
export async function deleteEquipment(equipmentId) {
  try {
    const response = await api.delete(`/equipment/${equipmentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'équipement:', error)
    throw error
  }
}

// Fonction pour récupérer un équipement par son ID
export async function getEquipmentById(equipmentId) {
  try {
    const response = await api.get(`/equipment/${equipmentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'équipement:', error)
    throw error
  }
}

// Fonction pour rechercher des équipements par nom
export async function searchEquipmentsByName(name) {
  try {
    const response = await api.get(`/equipment/search`, {
      params: { name }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des équipements:', error)
    throw error
  }
}