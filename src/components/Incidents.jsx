import { useState, useEffect } from 'react'
import {
  IoSearchOutline,
  IoAddOutline,
  IoFilterOutline,
  IoSwapVerticalOutline,
  IoCheckboxOutline,
  IoSquareOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoRefreshOutline
} from 'react-icons/io5'
import '../styles/Incidents.css'
import { listIncidents, createIncident, assignIncident, resolveIncident, closeIncident } from '../services/incidents'

function Incidents({ searchQuery, setSearchQuery }) {
  const [selectedIncidents, setSelectedIncidents] = useState([])
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [newIncident, setNewIncident] = useState({
    building: '',
    roomNumber: '',
    assignedAgent: '',
    date: '',
    state: 'En cours'
  })
  const [backendIncidents, setBackendIncidents] = useState([])
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)
  const [incidentsMessage, setIncidentsMessage] = useState('')
  const [incidentActionId, setIncidentActionId] = useState(null)
  const [editingIncident, setEditingIncident] = useState(null)

  // Données simulées pour les incidents
  const incidents = [
    { id: 1, building: 'Batiment A', roomNumber: 'A01', assignedAgent: 'Jon Snow', date: '25-09-2025', state: 'En cours' },
    { id: 2, building: 'Batiment B', roomNumber: 'B11', assignedAgent: 'Jack Bauer', date: '25-09-2025', state: 'A Reparer' },
    { id: 3, building: 'Batiment A', roomNumber: 'A04', assignedAgent: 'Luis Suarez', date: '25-09-2025', state: 'Bon Etat' },
    { id: 4, building: 'Batiment A', roomNumber: 'A14', assignedAgent: 'Pablo Escobar', date: '25-09-2025', state: 'En cours' },
    { id: 5, building: 'Batiment A', roomNumber: 'A08', assignedAgent: 'Jane Smith', date: '25-09-2025', state: 'En cours' },
    { id: 6, building: 'Batiment D', roomNumber: 'D04', assignedAgent: 'Will Smith', date: '25-09-2025', state: 'Bon Etat' },
    { id: 7, building: 'Batiment C', roomNumber: 'C04', assignedAgent: 'Lebron James', date: '25-09-2025', state: 'A Reparer' },
    { id: 8, building: 'Batiment B', roomNumber: 'B02', assignedAgent: 'Steph Curry', date: '25-09-2025', state: 'A Reparer' },
    { id: 9, building: 'Batiment D', roomNumber: 'D10', assignedAgent: 'Lionel Messi', date: '25-09-2025', state: 'En cours' }
  ]

  // Gestion des incidents
  const handleSelectIncident = (incidentId) => {
    setSelectedIncidents(prev => {
      if (prev.includes(incidentId)) {
        return prev.filter(id => id !== incidentId)
      } else {
        return [...prev, incidentId]
      }
    })
  }

  const handleSelectAllIncidents = () => {
    // Utiliser filteredIncidents pour la sélection globale
    const allPaginatedIds = paginatedIncidents.map(inc => inc.id)
    const allSelected = allPaginatedIds.every(id => selectedIncidents.includes(id))
    
    if (allSelected) {
      // Désélectionner tous les incidents de la page courante
      setSelectedIncidents(prev => prev.filter(id => !allPaginatedIds.includes(id)))
    } else {
      // Sélectionner tous les incidents de la page courante
      setSelectedIncidents(prev => {
        const newSelection = [...prev]
        allPaginatedIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id)
          }
        })
        return newSelection
      })
    }
  }

  const handleAddIncident = async (e) => {
    e.preventDefault()
    setIncidentsMessage('')
    try {
      if (editingIncident) {
        await updateIncident(editingIncident.id, {
          building: newIncident.building,
          roomNumber: newIncident.roomNumber,
          assignedAgent: newIncident.assignedAgent,
          date: newIncident.date,
          state: newIncident.state
        })
        setIncidentsMessage('✅ Incident mis à jour (backend)')
      } else {
        await createIncident({
          building: newIncident.building,
          roomNumber: newIncident.roomNumber,
          assignedAgent: newIncident.assignedAgent,
          date: newIncident.date,
          state: newIncident.state
        })
        setIncidentsMessage('✅ Incident créé (backend)')
      }
      await handleRefreshIncidents()
    } catch (error) {
      setIncidentsMessage(`❌ Erreur: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setNewIncident({
        building: '',
        roomNumber: '',
        assignedAgent: '',
        date: '',
        state: 'En cours'
      })
      setEditingIncident(null)
      setShowAddIncidentModal(false)
    }
  }

  const handleCancelAddIncident = () => {
    setNewIncident({
      building: '',
      roomNumber: '',
      assignedAgent: '',
      date: '',
      state: 'En cours'
    })
    setShowAddIncidentModal(false)
  }

  const handleAssign = async (incident) => {
    if (!incident?.fromBackend) {
      setIncidentsMessage('❌ Action réservée aux incidents du backend.')
      return
    }
    const agentId = prompt('ID ou nom de l’agent à assigner :', incident.assignedAgent || '')
    if (!agentId) return
    setIncidentActionId(incident.id)
    setIncidentsMessage('')
    try {
      await assignIncident(incident.id, { agentId })
      setIncidentsMessage('✅ Incident assigné')
      await handleRefreshIncidents()
    } catch (error) {
      setIncidentsMessage(`❌ Erreur assignation: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIncidentActionId(null)
    }
  }

  const handleResolve = async (incident) => {
    if (!incident?.fromBackend) {
      setIncidentsMessage('❌ Action réservée aux incidents du backend.')
      return
    }
    const resolution = prompt('Résolution effectuée :', '')
    if (!resolution) return
    setIncidentActionId(incident.id)
    setIncidentsMessage('')
    try {
      await resolveIncident(incident.id, { resolution })
      setIncidentsMessage('✅ Incident résolu')
      await handleRefreshIncidents()
    } catch (error) {
      setIncidentsMessage(`❌ Erreur résolution: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIncidentActionId(null)
    }
  }

  const handleCloseIncident = async (incident) => {
    if (!incident?.fromBackend) {
      setIncidentsMessage('❌ Action réservée aux incidents du backend.')
      return
    }
    const feedback = prompt('Commentaire de clôture :', '')
    setIncidentActionId(incident.id)
    setIncidentsMessage('')
    try {
      await closeIncident(incident.id, { feedback })
      setIncidentsMessage('✅ Incident clôturé')
      await handleRefreshIncidents()
    } catch (error) {
      setIncidentsMessage(`❌ Erreur clôture: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIncidentActionId(null)
    }
  }

  const handleEditIncident = (incident) => {
    if (!incident?.fromBackend) {
      setIncidentsMessage('❌ Edition réservée aux incidents du backend.')
      return
    }
    setEditingIncident(incident)
    setNewIncident({
      building: incident.building || '',
      roomNumber: incident.roomNumber || '',
      assignedAgent: incident.assignedAgent || '',
      date: '',
      state: incident.state || 'En cours'
    })
    setShowAddIncidentModal(true)
  }

  // Fetch initial incidents au montage
  useEffect(() => {
    handleRefreshIncidents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefreshIncidents = async () => {
    setIsLoadingBackend(true)
    setIncidentsMessage('')
    try {
      const result = await listIncidents({ page: 1, limit: 100 })
      const mapped =
        result?.data?.map((i, idx) => ({
          id: i.id || `inc-back-${idx}`,
          building: i.building || i.buildingName || 'N/A',
          roomNumber: i.roomNumber || i.spaceNumber || '',
          assignedAgent: i.assignedAgent || i.agentName || 'N/A',
          date: i.date
            ? i.date
            : i.createdAt
            ? new Date(i.createdAt).toLocaleDateString('fr-FR')
            : '',
          state: i.state || i.status || 'En cours',
          fromBackend: true
        })) || []
      setBackendIncidents(mapped)
      setIncidentsMessage(`✅ ${mapped.length} incident(s) chargé(s) depuis le backend`)
    } catch (error) {
      setIncidentsMessage(`❌ Erreur lors du chargement: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsLoadingBackend(false)
    }
  }

  // Filtrer les incidents selon la recherche
  const allIncidents = [
    ...backendIncidents,
    ...incidents.filter(
      (inc) => !backendIncidents.find((bi) => bi.id === inc.id || bi.roomNumber === inc.roomNumber)
    )
  ]

  const filteredIncidents = allIncidents.filter((incident) => {
    const query = searchQuery.toLowerCase()
    return (
      incident.building.toLowerCase().includes(query) ||
      incident.roomNumber.toLowerCase().includes(query) ||
      incident.assignedAgent.toLowerCase().includes(query) ||
      incident.date.toLowerCase().includes(query) ||
      incident.state.toLowerCase().includes(query)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex)
  const totalIncidents = filteredIncidents.length
  const displayStart = totalIncidents > 0 ? startIndex + 1 : 0
  const displayEnd = Math.min(endIndex, totalIncidents)

  // Réinitialiser la page courante si elle est hors limites après filtrage
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredIncidents.length, currentPage, totalPages])

  // Fonction pour obtenir la classe CSS du badge selon l'état de l'incident
  const getIncidentStateBadgeClass = (state) => {
    const stateMap = {
      'En cours': 'badge-en-cours',
      'A Reparer': 'badge-a-reparer',
      'Bon Etat': 'badge-bon-etat'
    }
    return stateMap[state] || 'badge-en-cours'
  }

  return (
    <>
      <div className="incidents-page">
        <div className="incidents-header-bar">
          <h2 className="incidents-page-title">Table des Incidents</h2>
          <div className="search-container search-incidents">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Faites votre recherche ici"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="incidents-actions-right">
            <button className="btn-filter">
              <IoFilterOutline />
            </button>
            <button className="btn-sort">
              <IoSwapVerticalOutline />
            </button>
            <button
              className="btn-add-incident"
              onClick={handleRefreshIncidents}
              disabled={isLoadingBackend}
              style={{ backgroundColor: '#f0f0f0', color: '#333' }}
            >
              <IoRefreshOutline />
              <span>{isLoadingBackend ? 'Chargement...' : 'Rafraîchir (backend)'}</span>
            </button>
            <button 
              className="btn-add-incident"
              onClick={() => setShowAddIncidentModal(true)}
            >
              <IoAddOutline />
              <span>{editingIncident ? 'Mettre à jour' : 'Ajouter'}</span>
            </button>
          </div>
        </div>

        {incidentsMessage && (
          <div className="incidents-status-banner">
            {incidentsMessage}
          </div>
        )}

        <div className="incidents-table-container">
          <table className="incidents-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <button 
                    className="checkbox-btn"
                    onClick={handleSelectAllIncidents}
                  >
                    {paginatedIncidents.length > 0 && paginatedIncidents.every(inc => selectedIncidents.includes(inc.id)) ? (
                      <IoCheckboxOutline />
                    ) : (
                      <IoSquareOutline />
                    )}
                  </button>
                </th>
                <th>Batiment</th>
                <th>N° de Chambre</th>
                <th>Agent Assigné</th>
                <th>Date</th>
                <th>Etat</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIncidents.length > 0 ? (
                paginatedIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="checkbox-column">
                      <button 
                        className="checkbox-btn"
                        onClick={() => handleSelectIncident(incident.id)}
                      >
                        {selectedIncidents.includes(incident.id) ? (
                          <IoCheckboxOutline />
                        ) : (
                          <IoSquareOutline />
                        )}
                      </button>
                    </td>
                    <td className="incident-building">{incident.building}</td>
                    <td className="incident-room">{incident.roomNumber}</td>
                    <td className="incident-agent">{incident.assignedAgent}</td>
                    <td className="incident-date">{incident.date}</td>
                    <td>
                      <span className={`badge-state ${getIncidentStateBadgeClass(incident.state)}`}>
                        {incident.state}
                      </span>
                    </td>
                    <td className="actions-column" style={{ textAlign: 'right' }}>
                      {incident.fromBackend && (
                        <div className="incident-actions-inline">
                          <button
                            className="btn-actions"
                            onClick={() => handleEditIncident(incident)}
                            disabled={incidentActionId === incident.id}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn-actions"
                            onClick={() => handleAssign(incident)}
                            disabled={incidentActionId === incident.id}
                          >
                            Assigner
                          </button>
                          <button
                            className="btn-actions"
                            onClick={() => handleResolve(incident)}
                            disabled={incidentActionId === incident.id}
                          >
                            Résoudre
                          </button>
                          <button
                            className="btn-actions"
                            onClick={() => handleCloseIncident(incident)}
                            disabled={incidentActionId === incident.id}
                          >
                            Clôturer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    {searchQuery ? `Aucun incident trouvé pour "${searchQuery}"` : 'Aucun incident disponible'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalIncidents > 0 && (
          <div className="incidents-pagination">
            <p className="pagination-info">
              Affichage de <span className="font-medium">{displayStart}-{displayEnd}</span> sur <span className="font-medium">{totalIncidents}</span> incidents
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

      {/* Modal Ajouter un Incident */}
      {showAddIncidentModal && (
        <div className="modal-overlay" onClick={handleCancelAddIncident}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Ajouter un nouvel incident</h2>
              <button className="modal-close-btn" onClick={handleCancelAddIncident}>
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={handleAddIncident} className="modal-form">
              <div className="form-group">
                <label htmlFor="building">Bâtiment</label>
                <input
                  type="text"
                  id="building"
                  value={newIncident.building}
                  onChange={(e) => setNewIncident({ ...newIncident, building: e.target.value })}
                  placeholder="Ex: Batiment A"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roomNumber">N° de Chambre</label>
                <input
                  type="text"
                  id="roomNumber"
                  value={newIncident.roomNumber}
                  onChange={(e) => setNewIncident({ ...newIncident, roomNumber: e.target.value })}
                  placeholder="Ex: A01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="assignedAgent">Agent Assigné</label>
                <input
                  type="text"
                  id="assignedAgent"
                  value={newIncident.assignedAgent}
                  onChange={(e) => setNewIncident({ ...newIncident, assignedAgent: e.target.value })}
                  placeholder="Ex: Jon Snow"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={newIncident.date}
                    onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">État</label>
                  <select
                    id="state"
                    value={newIncident.state}
                    onChange={(e) => setNewIncident({ ...newIncident, state: e.target.value })}
                    required
                  >
                    <option value="En cours">En cours</option>
                    <option value="A Reparer">A Reparer</option>
                    <option value="Bon Etat">Bon Etat</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelAddIncident}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Ajouter l'Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Incidents

