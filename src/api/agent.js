import { api } from './http'

// Fonction pour créer un nouvel agent
export async function createAgent(agentData) {
  try {
    const response = await api.post('/agents', agentData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la création de l\'agent:', error)
    throw error
  }
}

// Fonction pour récupérer tous les agents
export async function getAgents() {
  try {
    const response = await api.get('/agents')
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des agents:', error)
    throw error
  }
}

// Fonction pour mettre à jour un agent existant
export async function updateAgent(agentId, agentData) {
  try {
    const response = await api.put(`/agents/${agentId}`, agentData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'agent:', error)
    throw error
  }
}

// Fonction pour supprimer un agent
export async function deleteAgent(agentId) {
  try {
    const response = await api.delete(`/agents/${agentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'agent:', error)
    throw error
  }
}

// Fonction pour récupérer un agent par son ID
export async function getAgentById(agentId) {
  try {
    const response = await api.get(`/agents/${agentId}`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'agent:', error)
    throw error
  }
}

// Fonction pour rechercher des agents par nom
export async function searchAgentsByName(name) {
  try {
    const response = await api.get(`/agents/search`, {
      params: { name }
    })
    return response.data
  } catch (error) {
    console.error('Erreur lors de la recherche des agents:', error)
    throw error
  }
}