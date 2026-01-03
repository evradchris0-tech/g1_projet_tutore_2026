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
  IoRefreshOutline,
  IoEyeOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoGridOutline,
  IoDocumentTextOutline,
  IoCreateOutline,
  IoPersonAddOutline,
  IoCloseCircleOutline
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

  // Nouveaux états pour les fonctionnalités améliorées
  const [viewMode, setViewMode] = useState('admin') // 'admin' ou 'declare'
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedIncidentDetails, setSelectedIncidentDetails] = useState(null)

  // Données simulées pour les incidents avec timeline
  const incidents = [
    { 
      id: 1, 
      building: 'Batiment A', 
      roomNumber: 'A01', 
      assignedAgent: 'Jon Snow', 
      date: '25-09-2025', 
      state: 'En cours',
      description: 'Problème électrique dans la chambre A01',
      priority: 'Haute',
      category: 'Électricité',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Incident signalé par l\'occupant',
          timestamp: '2025-09-25T08:30:00Z',
          user: 'Marie Dupont (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Jon Snow',
          timestamp: '2025-09-25T09:15:00Z',
          user: 'Admin Système'
        },
        {
          id: 3,
          type: 'status_change',
          title: 'Statut mis à jour',
          description: 'Statut changé de "Nouveau" à "En cours"',
          timestamp: '2025-09-25T10:00:00Z',
          user: 'Jon Snow'
        }
      ]
    },
    { 
      id: 2, 
      building: 'Batiment B', 
      roomNumber: 'B11', 
      assignedAgent: 'Jack Bauer', 
      date: '25-09-2025', 
      state: 'A Reparer',
      description: 'Fuite d\'eau dans la salle de bain',
      priority: 'Moyenne',
      category: 'Plomberie',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Fuite d\'eau signalée',
          timestamp: '2025-09-24T14:20:00Z',
          user: 'Pierre Martin (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Jack Bauer',
          timestamp: '2025-09-24T15:00:00Z',
          user: 'Admin Système'
        },
        {
          id: 3,
          type: 'comment',
          title: 'Commentaire ajouté',
          description: 'Diagnostic: Joint de robinet défaillant',
          timestamp: '2025-09-25T11:30:00Z',
          user: 'Jack Bauer'
        }
      ]
    },
    { 
      id: 3, 
      building: 'Batiment A', 
      roomNumber: 'A04', 
      assignedAgent: 'Luis Suarez', 
      date: '25-09-2025', 
      state: 'Bon Etat',
      description: 'Problème de chauffage résolu',
      priority: 'Basse',
      category: 'Chauffage',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Chauffage ne fonctionne pas',
          timestamp: '2025-09-20T07:45:00Z',
          user: 'Sophie Leroy (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Luis Suarez',
          timestamp: '2025-09-20T08:30:00Z',
          user: 'Admin Système'
        },
        {
          id: 3,
          type: 'resolved',
          title: 'Incident résolu',
          description: 'Réparation du thermostat effectuée',
          timestamp: '2025-09-22T16:15:00Z',
          user: 'Luis Suarez'
        },
        {
          id: 4,
          type: 'closed',
          title: 'Incident clôturé',
          description: 'Validation finale et clôture',
          timestamp: '2025-09-23T09:00:00Z',
          user: 'Admin Système'
        }
      ]
    },
    { 
      id: 4, 
      building: 'Batiment A', 
      roomNumber: 'A14', 
      assignedAgent: 'Pablo Escobar', 
      date: '25-09-2025', 
      state: 'En cours',
      description: 'Problème de serrure électronique',
      priority: 'Haute',
      category: 'Sécurité',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Carte d\'accès ne fonctionne plus',
          timestamp: '2025-09-26T12:00:00Z',
          user: 'Jean Michel (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Pablo Escobar',
          timestamp: '2025-09-26T12:30:00Z',
          user: 'Admin Système'
        }
      ]
    },
    { 
      id: 5, 
      building: 'Batiment A', 
      roomNumber: 'A08', 
      assignedAgent: 'Jane Smith', 
      date: '25-09-2025', 
      state: 'En cours',
      description: 'Fenêtre cassée',
      priority: 'Moyenne',
      category: 'Menuiserie',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Fenêtre de la chambre cassée',
          timestamp: '2025-09-27T10:15:00Z',
          user: 'Alice Bernard (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Jane Smith',
          timestamp: '2025-09-27T11:00:00Z',
          user: 'Admin Système'
        }
      ]
    },
    { 
      id: 6, 
      building: 'Batiment D', 
      roomNumber: 'D04', 
      assignedAgent: 'Will Smith', 
      date: '25-09-2025', 
      state: 'Bon Etat',
      description: 'Problème de WiFi résolu',
      priority: 'Basse',
      category: 'Informatique',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Connexion WiFi instable',
          timestamp: '2025-09-15T09:20:00Z',
          user: 'Marc Dubois (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Will Smith',
          timestamp: '2025-09-15T10:00:00Z',
          user: 'Admin Système'
        },
        {
          id: 3,
          type: 'resolved',
          title: 'Incident résolu',
          description: 'Redémarrage du routeur effectué',
          timestamp: '2025-09-16T14:30:00Z',
          user: 'Will Smith'
        },
        {
          id: 4,
          type: 'closed',
          title: 'Incident clôturé',
          description: 'Confirmation de résolution',
          timestamp: '2025-09-17T08:45:00Z',
          user: 'Admin Système'
        }
      ]
    },
    { 
      id: 7, 
      building: 'Batiment C', 
      roomNumber: 'C04', 
      assignedAgent: 'Lebron James', 
      date: '25-09-2025', 
      state: 'A Reparer',
      description: 'Problème d\'éclairage',
      priority: 'Moyenne',
      category: 'Électricité',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Ampoule grillée dans le couloir',
          timestamp: '2025-09-28T16:45:00Z',
          user: 'Claire Petit (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Lebron James',
          timestamp: '2025-09-28T17:00:00Z',
          user: 'Admin Système'
        }
      ]
    },
    { 
      id: 8, 
      building: 'Batiment B', 
      roomNumber: 'B02', 
      assignedAgent: 'Steph Curry', 
      date: '25-09-2025', 
      state: 'A Reparer',
      description: 'Problème de climatisation',
      priority: 'Haute',
      category: 'Climatisation',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Climatisation ne refroidit plus',
          timestamp: '2025-09-29T13:10:00Z',
          user: 'Thomas Durand (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Steph Curry',
          timestamp: '2025-09-29T13:45:00Z',
          user: 'Admin Système'
        },
        {
          id: 3,
          type: 'comment',
          title: 'Commentaire ajouté',
          description: 'Diagnostic: Filtre obstrué, nettoyage nécessaire',
          timestamp: '2025-09-30T09:20:00Z',
          user: 'Steph Curry'
        }
      ]
    },
    { 
      id: 9, 
      building: 'Batiment D', 
      roomNumber: 'D10', 
      assignedAgent: 'Lionel Messi', 
      date: '25-09-2025', 
      state: 'En cours',
      description: 'Problème de plomberie',
      priority: 'Moyenne',
      category: 'Plomberie',
      timeline: [
        {
          id: 1,
          type: 'created',
          title: 'Incident créé',
          description: 'Évier bouché',
          timestamp: '2025-09-30T11:30:00Z',
          user: 'Emma Laurent (Occupant)'
        },
        {
          id: 2,
          type: 'assigned',
          title: 'Assigné à un agent',
          description: 'Incident assigné à Lionel Messi',
          timestamp: '2025-09-30T12:00:00Z',
          user: 'Admin Système'
        }
      ]
    }
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

  const handleViewDetails = (incident) => {
    setSelectedIncidentDetails(incident)
    setShowDetailsModal(true)
  }

  const handleDeclareIncident = async (e) => {
    e.preventDefault()
    setIncidentsMessage('')
    try {
      await createIncident({
        building: newIncident.building,
        roomNumber: newIncident.roomNumber,
        description: newIncident.description || 'Incident déclaré par utilisateur',
        priority: newIncident.priority || 'Moyenne',
        category: newIncident.category || 'Autre',
        state: 'Nouveau'
      })
      setIncidentsMessage('✅ Incident déclaré avec succès')
      setNewIncident({
        building: '',
        roomNumber: '',
        description: '',
        priority: 'Moyenne',
        category: 'Autre'
      })
      handleRefreshIncidents()
    } catch (error) {
      setIncidentsMessage(`❌ Erreur lors de la déclaration: ${error?.message || 'Erreur inconnue'}`)
    }
  }

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'created': return IoDocumentTextOutline
      case 'assigned': return IoPersonOutline
      case 'status_change': return IoAlertCircleOutline
      case 'resolved': return IoCheckmarkCircleOutline
      case 'closed': return IoCheckmarkCircleOutline
      case 'comment': return IoTimeOutline
      default: return IoTimeOutline
    }
  }

  const getTimelineColor = (type) => {
    switch (type) {
      case 'created': return '#3b82f6'
      case 'assigned': return '#10b981'
      case 'status_change': return '#f59e0b'
      case 'resolved': return '#10b981'
      case 'closed': return '#6b7280'
      case 'comment': return '#8b5cf6'
      default: return '#6b7280'
    }
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
          <h2 className="incidents-page-title">
            {viewMode === 'admin' ? 'Gestion des Incidents' : 'Déclarer un Incident'}
          </h2>
          
          {/* Toggle entre vue admin et déclaration */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'declare' ? 'active' : ''}`}
              onClick={() => setViewMode('declare')}
            >
              <IoDocumentTextOutline />
              Déclarer
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'admin' ? 'active' : ''}`}
              onClick={() => setViewMode('admin')}
            >
              <IoGridOutline />
              Administration
            </button>
          </div>

          {viewMode === 'admin' && (
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
          )}

          <div className="incidents-actions-right">
            {viewMode === 'admin' && (
              <>
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
                  <span>{isLoadingBackend ? 'Chargement...' : 'Rafraîchir'}</span>
                </button>
              </>
            )}
            <button 
              className="btn-add-incident"
              onClick={() => {
                if (viewMode === 'declare') {
                  setNewIncident({
                    building: '',
                    roomNumber: '',
                    description: '',
                    priority: 'Moyenne',
                    category: 'Autre'
                  })
                }
                setShowAddIncidentModal(true)
              }}
            >
              <IoAddOutline />
              <span>{viewMode === 'admin' ? (editingIncident ? 'Mettre à jour' : 'Ajouter') : 'Déclarer'}</span>
            </button>
          </div>
        </div>

        {incidentsMessage && (
          <div className="incidents-status-banner">
            {incidentsMessage}
          </div>
        )}

        {viewMode === 'declare' ? (
          <div className="declare-incident-view">
            <div className="declare-card">
              <div className="declare-header">
                <IoAlertCircleOutline className="declare-icon" />
                <h3>Signaler un problème</h3>
                <p>Décrivez le problème que vous rencontrez pour que notre équipe puisse intervenir rapidement.</p>
              </div>
              
              <form className="declare-form" onSubmit={handleDeclareIncident}>
                <div className="form-section">
                  <h4>Localisation</h4>
                  <div className="form-row">
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
                  </div>
                </div>

                <div className="form-section">
                  <h4>Détails du problème</h4>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={newIncident.description || ''}
                      onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                      placeholder="Décrivez le problème de manière détaillée..."
                      rows="4"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Catégorie</label>
                      <select
                        id="category"
                        value={newIncident.category || 'Autre'}
                        onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                      >
                        <option value="Autre">Autre</option>
                        <option value="Électricité">Électricité</option>
                        <option value="Plomberie">Plomberie</option>
                        <option value="Chauffage">Chauffage</option>
                        <option value="Sécurité">Sécurité</option>
                        <option value="Menuiserie">Menuiserie</option>
                        <option value="Climatisation">Climatisation</option>
                        <option value="Informatique">Informatique</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="priority">Priorité</label>
                      <select
                        id="priority"
                        value={newIncident.priority || 'Moyenne'}
                        onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
                      >
                        <option value="Basse">Basse</option>
                        <option value="Moyenne">Moyenne</option>
                        <option value="Haute">Haute</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="declare-actions">
                  <button type="submit" className="btn-submit-declare">
                    <IoDocumentTextOutline />
                    Déclarer l'incident
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
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
                      <div className="incident-actions-inline">
                        <button
                          className="btn-action view"
                          onClick={() => handleViewDetails(incident)}
                          title="Voir détails et timeline"
                        >
                          <IoEyeOutline />
                        </button>
                        {incident.fromBackend && (
                          <>
                            <button
                              className="btn-action edit"
                              onClick={() => handleEditIncident(incident)}
                              disabled={incidentActionId === incident.id}
                              title="Éditer l'incident"
                            >
                              <IoCreateOutline />
                            </button>
                            <button
                              className="btn-action assign"
                              onClick={() => handleAssign(incident)}
                              disabled={incidentActionId === incident.id}
                              title="Assigner l'incident"
                            >
                              <IoPersonAddOutline />
                            </button>
                            <button
                              className="btn-action resolve"
                              onClick={() => handleResolve(incident)}
                              disabled={incidentActionId === incident.id}
                              title="Résoudre l'incident"
                            >
                              <IoCheckmarkCircleOutline />
                            </button>
                            <button
                              className="btn-action close"
                              onClick={() => handleCloseIncident(incident)}
                              disabled={incidentActionId === incident.id}
                              title="Clôturer l'incident"
                            >
                              <IoCloseCircleOutline />
                            </button>
                          </>
                        )}
                      </div>
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
        )}

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

      {/* Modal Ajouter/Déclarer un Incident */}
      {showAddIncidentModal && (
        <div className="modal-overlay" onClick={handleCancelAddIncident}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {viewMode === 'admin' ? 'Ajouter un nouvel incident' : 'Déclarer un incident'}
              </h2>
              <button className="modal-close-btn" onClick={handleCancelAddIncident}>
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={viewMode === 'admin' ? handleAddIncident : handleDeclareIncident} className="modal-form">
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

              {viewMode === 'declare' && (
                <>
                  <div className="form-group">
                    <label htmlFor="description">Description du problème</label>
                    <textarea
                      id="description"
                      value={newIncident.description || ''}
                      onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                      placeholder="Décrivez le problème de manière détaillée..."
                      rows="4"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Catégorie</label>
                      <select
                        id="category"
                        value={newIncident.category || 'Autre'}
                        onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                      >
                        <option value="Autre">Autre</option>
                        <option value="Électricité">Électricité</option>
                        <option value="Plomberie">Plomberie</option>
                        <option value="Chauffage">Chauffage</option>
                        <option value="Sécurité">Sécurité</option>
                        <option value="Menuiserie">Menuiserie</option>
                        <option value="Climatisation">Climatisation</option>
                        <option value="Informatique">Informatique</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="priority">Priorité</label>
                      <select
                        id="priority"
                        value={newIncident.priority || 'Moyenne'}
                        onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
                      >
                        <option value="Basse">Basse</option>
                        <option value="Moyenne">Moyenne</option>
                        <option value="Haute">Haute</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {viewMode === 'admin' && (
                <>
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
                </>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelAddIncident}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  {viewMode === 'admin' ? 'Ajouter l\'Incident' : 'Déclarer l\'incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détails et Timeline */}
      {showDetailsModal && selectedIncidentDetails && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'incident #{selectedIncidentDetails.id}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <IoCloseOutline />
              </button>
            </div>

            <div className="incident-details-content">
              {/* Informations générales */}
              <div className="details-section">
                <h4>Informations générales</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>ID:</label>
                    <span>{selectedIncidentDetails.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>État:</label>
                    <span className={`badge-state ${getIncidentStateBadgeClass(selectedIncidentDetails.state)}`}>
                      {selectedIncidentDetails.state}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Bâtiment:</label>
                    <span>{selectedIncidentDetails.building}</span>
                  </div>
                  <div className="detail-item">
                    <label>Chambre:</label>
                    <span>{selectedIncidentDetails.roomNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Agent assigné:</label>
                    <span>{selectedIncidentDetails.assignedAgent}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{selectedIncidentDetails.date}</span>
                  </div>
                  {selectedIncidentDetails.priority && (
                    <div className="detail-item">
                      <label>Priorité:</label>
                      <span className={`priority-badge priority-${selectedIncidentDetails.priority.toLowerCase()}`}>
                        {selectedIncidentDetails.priority}
                      </span>
                    </div>
                  )}
                  {selectedIncidentDetails.category && (
                    <div className="detail-item">
                      <label>Catégorie:</label>
                      <span>{selectedIncidentDetails.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedIncidentDetails.description && (
                <div className="details-section">
                  <h4>Description</h4>
                  <p className="incident-description">{selectedIncidentDetails.description}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="details-section">
                <h4>Historique et Timeline</h4>
                <div className="timeline">
                  {selectedIncidentDetails.timeline && selectedIncidentDetails.timeline.length > 0 ? (
                    selectedIncidentDetails.timeline.map((event, index) => {
                      const IconComponent = getTimelineIcon(event.type)
                      const iconColor = getTimelineColor(event.type)
                      return (
                        <div key={event.id} className="timeline-item">
                          <div className="timeline-marker" style={{ backgroundColor: iconColor }}>
                            <IconComponent />
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <h5 className="timeline-title">{event.title}</h5>
                              <span className="timeline-date">
                                {new Date(event.timestamp).toLocaleString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="timeline-description">{event.description}</p>
                            <span className="timeline-user">{event.user}</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="timeline-empty">
                      <IoTimeOutline />
                      <p>Aucun historique disponible pour cet incident.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDetailsModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Incidents

