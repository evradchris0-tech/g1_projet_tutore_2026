import { useEffect, useRef, useState } from 'react'
import {
  IoSearchOutline,
  IoAddOutline,
  IoCloseOutline,
  IoStarOutline,
  IoStar,
  IoCreateOutline,
  IoTrashOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline
} from 'react-icons/io5'
import '../styles/Agents.css'
import { createUser, listUsers, updateUser, deleteUser } from '../services/users'
import { IoRefreshOutline } from 'react-icons/io5'

function Agents({ searchQuery, setSearchQuery, openCreateModalToken = null }) {
  const [showAddAgentModal, setShowAddAgentModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('Tous') // 'Tous', 'Actif', 'Inactif'
  const [favoriteAgents, setFavoriteAgents] = useState([2]) // ID de l'agent favori
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const [isSavingAgent, setIsSavingAgent] = useState(false)
  const [agentMessage, setAgentMessage] = useState('')
  const [backendAgents, setBackendAgents] = useState([])
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)
  const [agentActionId, setAgentActionId] = useState(null)

  const lastOpenTokenRef = useRef(null)
  useEffect(() => {
    if (openCreateModalToken && openCreateModalToken !== lastOpenTokenRef.current) {
      setShowAddAgentModal(true)
      lastOpenTokenRef.current = openCreateModalToken
    }
  }, [openCreateModalToken])

  const [newAgent, setNewAgent] = useState({
    fullName: '',
    email: '',
    role: '',
    sendCredentials: true
  })

  // Données simulées pour les agents (selon la maquette)
  const agents = [
    { id: 1, fullName: "Jean-Pierre Eto'o", email: 'jp.etoo@gmail.com', role: 'Électricien', creationDate: '15/07/2023', status: 'Actif' },
    { id: 2, fullName: 'Chantal Ngo Biyong', email: 'chantal.ngobiyong@gmail.com', role: 'Superviseur', creationDate: '12/06/2023', status: 'Actif' },
    { id: 3, fullName: 'Paul Biya Mvondo', email: 'paul.biyamvondo@gmail.com', role: 'Technicien CVC', creationDate: '01/03/2023', status: 'Inactif' },
    { id: 4, fullName: 'Aïssatou Ngono', email: 'aissatou.ngono@gmail.com', role: 'Plombier', creationDate: '28/02/2023', status: 'Actif' },
    { id: 5, fullName: 'Fotso Emmanuel', email: 'fotso.emmanuel@gmail.com', role: 'Généraliste', creationDate: '20/01/2023', status: 'Actif' },
    { id: 6, fullName: 'Marie Dubois', email: 'marie.dubois@gmail.com', role: 'Électricien', creationDate: '15/12/2022', status: 'Inactif' },
    { id: 7, fullName: 'Pierre Martin', email: 'pierre.martin@gmail.com', role: 'Plombier', creationDate: '10/11/2022', status: 'Actif' },
    { id: 8, fullName: 'Sophie Laurent', email: 'sophie.laurent@gmail.com', role: 'Technicien CVC', creationDate: '05/10/2022', status: 'Actif' }
  ]

  const handleAddAgent = async (e) => {
    e.preventDefault()
    setAgentMessage('')
    setIsSavingAgent(true)

    // Découper le nom complet en prénom/nom pour l'API
    const [firstName = '', ...rest] = newAgent.fullName.trim().split(' ')
    const lastName = rest.join(' ') || ''

    try {
      await createUser({
        email: newAgent.email,
        firstName: firstName || newAgent.email,
        lastName: lastName || '',
        role: 'AGENT_TERRAIN',
      })

      setAgentMessage('Agent créé (backend) avec succès.')
    } catch (error) {
      setAgentMessage(error?.message || 'Impossible de créer cet agent.')
    } finally {
      setIsSavingAgent(false)
      // Réinitialiser le formulaire et fermer le modal
      setNewAgent({
        fullName: '',
        email: '',
        role: '',
        sendCredentials: true
      })
      setShowAddAgentModal(false)
    }
  }

  const handleCancelAddAgent = () => {
    setNewAgent({
      fullName: '',
      email: '',
      role: '',
      sendCredentials: true
    })
    setShowAddAgentModal(false)
  }

  const handleRefreshAgents = async () => {
    setIsLoadingBackend(true)
    setAgentMessage('')
    try {
      const result = await listUsers({ role: 'AGENT_TERRAIN', page: 1, limit: 100 })
      // Transformer les données du backend pour correspondre au format attendu
      const transformed = result.data.map(user => ({
        id: user.id,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role === 'AGENT_TERRAIN' ? 'Agent Terrain' : user.role,
        creationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-',
        status: user.status === 'ACTIVE' ? 'Actif' : user.status === 'INACTIVE' ? 'Inactif' : 'Inactif',
        fromBackend: true
      }))
      setBackendAgents(transformed)
      setAgentMessage(`✅ ${transformed.length} agent(s) chargé(s) depuis le backend`)
    } catch (error) {
      setAgentMessage(`❌ Erreur lors du chargement: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsLoadingBackend(false)
    }
  }

  const handleToggleStatus = async (agent) => {
    if (!agent?.fromBackend) {
      setAgentMessage('❌ Action disponible uniquement pour les agents du backend.')
      return
    }
    const nextStatus = agent.status === 'Actif' ? 'INACTIVE' : 'ACTIVE'
    setAgentActionId(agent.id)
    setAgentMessage('')
    try {
      await updateUser(agent.id, { status: nextStatus })
      await handleRefreshAgents()
      setAgentMessage('✅ Statut mis à jour')
    } catch (error) {
      setAgentMessage(`❌ Erreur statut: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setAgentActionId(null)
    }
  }

  const handleDeleteAgent = async (agent) => {
    if (!agent?.fromBackend) {
      setAgentMessage('❌ Suppression uniquement pour les agents du backend.')
      return
    }
    if (!window.confirm(`Supprimer ${agent.fullName || agent.email} ?`)) return
    setAgentActionId(agent.id)
    setAgentMessage('')
    try {
      await deleteUser(agent.id)
      await handleRefreshAgents()
      setAgentMessage('✅ Agent supprimé')
    } catch (error) {
      setAgentMessage(`❌ Erreur suppression: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setAgentActionId(null)
    }
  }

  // Fetch initial backend agents
  useEffect(() => {
    handleRefreshAgents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFavorite = (agentId) => {
    setFavoriteAgents(prev => {
      if (prev.includes(agentId)) {
        return prev.filter(id => id !== agentId)
      } else {
        return [...prev, agentId]
      }
    })
  }

  // Fusionner les agents simulés avec les agents du backend (les agents backend en priorité)
  const allAgents = [...backendAgents, ...agents.filter(a => !backendAgents.find(ba => ba.email === a.email))]

  // Filtrer les agents selon la recherche et le statut
  const filteredAgents = allAgents.filter((agent) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = 
      agent.fullName.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.role.toLowerCase().includes(query)
    
    const matchesStatus = 
      filterStatus === 'Tous' || 
      (filterStatus === 'Actif' && agent.status === 'Actif') ||
      (filterStatus === 'Inactif' && agent.status === 'Inactif')
    
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex)
  const totalAgents = filteredAgents.length
  const displayStart = totalAgents > 0 ? startIndex + 1 : 0
  const displayEnd = Math.min(endIndex, totalAgents)

  return (
    <>
      <div className="agents-page">
        <header className="agents-page-header">
          <div className="agents-header-content">
            <h1 className="agents-page-title">Gestion des Agents</h1>
            <p className="agents-page-subtitle">
              Visualisez, créez et gérez les comptes des agents de terrain.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-add-agent-header"
              onClick={handleRefreshAgents}
              disabled={isLoadingBackend}
              style={{ backgroundColor: '#f0f0f0', color: '#333' }}
            >
              <IoRefreshOutline />
              <span>{isLoadingBackend ? 'Chargement...' : 'Rafraîchir depuis le backend'}</span>
            </button>
            <button 
              className="btn-add-agent-header"
              onClick={() => setShowAddAgentModal(true)}
            >
              <IoAddOutline />
              <span>Ajouter un Agent</span>
            </button>
          </div>
        </header>

          <div className="agents-filters-bar">
          <div className="agents-search-wrapper">
            <div className="agents-search-icon">
              <IoSearchOutline />
            </div>
            <input
              type="text"
              className="agents-search-input"
              placeholder="Rechercher par nom, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="agents-filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'Tous' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Tous')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'Actif' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Actif')}
            >
              Actif
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'Inactif' ? 'active' : ''}`}
              onClick={() => setFilterStatus('Inactif')}
            >
              Inactif
            </button>
          </div>
        </div>

        {agentMessage && (
          <div className="agents-status-banner">
            {agentMessage}
          </div>
        )}

        <div className="agents-table-wrapper">
          <table className="agents-table">
            <thead>
              <tr>
                <th>NOM COMPLET</th>
                <th>EMAIL</th>
                <th>RÔLE</th>
                <th>DATE DE CRÉATION</th>
                <th>STATUT</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.length > 0 ? (
                paginatedAgents.map((agent, index) => (
                  <tr key={agent.id} className={index % 2 === 1 ? 'highlighted-row' : ''}>
                    <td className="agent-fullname">
                      <div className="agent-name-wrapper">
                        {agent.fullName}
                        {favoriteAgents.includes(agent.id) && (
                          <IoStar className="favorite-star" />
                        )}
                      </div>
                    </td>
                    <td className="agent-email">{agent.email}</td>
                    <td className="agent-role">{agent.role}</td>
                    <td className="agent-date">{agent.creationDate}</td>
                    <td>
                      <span className={`status-badge ${agent.status === 'Actif' ? 'status-active' : 'status-inactive'}`}>
                        <span className="status-dot"></span>
                        {agent.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="actions-buttons">
                        <button 
                          className="action-btn"
                          onClick={() => toggleFavorite(agent.id)}
                          title="Favori"
                        >
                          {favoriteAgents.includes(agent.id) ? (
                            <IoStar className="star-filled" />
                          ) : (
                            <IoStarOutline />
                          )}
                        </button>
                        <button className="action-btn" title="Modifier">
                          <IoCreateOutline />
                        </button>
                        <button
                          className="action-btn"
                          title={agent.status === 'Actif' ? 'Désactiver' : 'Activer'}
                          onClick={() => handleToggleStatus(agent)}
                          disabled={agentActionId === agent.id}
                        >
                          {agent.status === 'Actif' ? (
                            <IoCloseCircleOutline />
                          ) : (
                            <IoCheckmarkCircleOutline />
                          )}
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Supprimer"
                          onClick={() => handleDeleteAgent(agent)}
                          disabled={agentActionId === agent.id}
                        >
                          <IoTrashOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    {searchQuery ? `Aucun agent trouvé pour "${searchQuery}"` : 'Aucun agent disponible'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalAgents > 0 && (
          <div className="agents-pagination">
            <p className="pagination-info">
              Affichage de <span className="font-medium">{displayStart}-{displayEnd}</span> sur <span className="font-medium">{totalAgents}</span> agents
            </p>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <IoChevronBackOutline />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <IoChevronForwardOutline />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajouter un Agent */}
      {showAddAgentModal && (
        <div className="modal-overlay" onClick={handleCancelAddAgent}>
          <div className="modal-content modal-agent-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Ajouter un nouvel agent</h2>
              <button className="modal-close-btn" onClick={handleCancelAddAgent}>
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={handleAddAgent} className="modal-form-new">
              <div className="form-group">
                <label htmlFor="fullName">Nom complet</label>
                <input
                  type="text"
                  id="fullName"
                  value={newAgent.fullName}
                  onChange={(e) => setNewAgent({ ...newAgent, fullName: e.target.value })}
                  placeholder="Ex: Fotso Emmanuel"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  id="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  placeholder="Ex: fotso.emmanuel@gmail.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rôle / Spécialité</label>
                <select
                  id="role"
                  value={newAgent.role}
                  onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                  required
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="Électricien">Électricien</option>
                  <option value="Plombier">Plombier</option>
                  <option value="Technicien CVC">Technicien CVC</option>
                  <option value="Superviseur">Superviseur</option>
                  <option value="Généraliste">Généraliste</option>
                </select>
              </div>
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="sendCredentials"
                  checked={newAgent.sendCredentials}
                  onChange={(e) => setNewAgent({ ...newAgent, sendCredentials: e.target.checked })}
                />
                <label htmlFor="sendCredentials">
                  Envoyer les paramètres d'accès par email
                </label>
              </div>
              <div className="modal-actions-new">
                <button type="button" className="btn-cancel-new" onClick={handleCancelAddAgent}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit-new" disabled={isSavingAgent}>
                  {isSavingAgent ? 'Enregistrement...' : "Enregistrer l'Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Agents
