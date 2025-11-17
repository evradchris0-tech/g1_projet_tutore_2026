import { api } from './http'

// Fonction pour créer un nouvel incident
export async function createIncident(incidentData) {
  try {
    const response = await api.post('/incident', incidentData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la création de l\'incident:', error)
    throw error
  }
}

// Fonction pour récupérer tous les incidents
export async function getIncidents() {
  try {
    const response = await api.get('/incident')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des incidents:', error)
    throw error
  }
}

// Fonction pour mettre à jour un incident existant
export async function updateIncident(incidentId, incidentData) {
  try {
    const response = await api.put(`/incident/${incidentId}`, incidentData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'incident:', error)
    throw error
  }
}

// Fonction pour supprimer un incident
export async function deleteIncident(incidentId) {
  try {
    const response = await api.delete(`/incident/${incidentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'incident:', error)
    throw error
  }
}

// Fonction pour récupérer un incident par son ID
export async function getIncidentById(incidentId) {
  try {
    const response = await api.get(`/incident/${incidentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'incident:', error)
    throw error
  }
}

// Fonction pour rechercher des incidents par titre
export async function searchIncidentsByTitle(title) {
  try {
    const response = await api.get(`/incident/search`, {
      params: { title }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des incidents par titre:', error)
    throw error
  }
}

// Fonction pour rechercher des incidents par statut
export async function searchIncidentsByStatus(status) {
  try {
    const response = await api.get(`/incident/search`, {
      params: { status }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des incidents par statut:', error)
    throw error
  }
}

// Fonction pour rechercher des incidents par priorité
export async function searchIncidentsByPriority(priority) {
  try {
    const response = await api.get(`/incident/search`, {
      params: { priority }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des incidents par priorité:', error)
    throw error
  }
}

// Fonction pour rechercher des incidents par date de création
export async function searchIncidentsByCreationDate(creationDate) {
  try {
    const response = await api.get(`/incident/search`, {
      params: { creationDate }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des incidents par date de création:', error)
    throw error
  }
}

// Fonction pour rechercher des incidents par date de résolution
export async function searchIncidentsByResolutionDate(resolutionDate) {
  try {
    const response = await api.get(`/incident/search`, {
      params: { resolutionDate }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des incidents par date de résolution:', error)
    throw error
  }
}