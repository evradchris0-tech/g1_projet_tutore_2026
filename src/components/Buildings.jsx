import { useState, useEffect } from 'react'
import {
  IoSearchOutline,
  IoAddOutline,
  IoCloseOutline,
  IoArrowBackOutline,
  IoBusinessOutline,
  IoGridOutline,
  IoConstructOutline,
  IoEyeOutline,
  IoCheckboxOutline,
  IoSquareOutline,
  IoWarning,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoExpandOutline,
  IoContractOutline,
  IoRefreshOutline
} from 'react-icons/io5'
import '../styles/Buildings.css'
import Campus3DView from './Campus3DView'
import { listBuildings, createBuilding, deleteBuilding, updateBuilding } from '../services/buildings'

function Buildings({ searchQuery, setSearchQuery }) {
  // États pour la navigation hiérarchique (Bâtiments)
  const [viewLevel, setViewLevel] = useState('buildings') // 'buildings' | 'floors' | 'spaces'
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false)
  const [showSpaceDetailModal, setShowSpaceDetailModal] = useState(false)
  const [showAssignEquipmentModal, setShowAssignEquipmentModal] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [isFullscreen3D, setIsFullscreen3D] = useState(false)
  const [newBuilding, setNewBuilding] = useState({
    name: '',
    code: '',
    type: 'Pédagogique',
    floors: 1,
    spaces: 0
  })
  const [backendBuildings, setBackendBuildings] = useState([])
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)
  const [buildingsMessage, setBuildingsMessage] = useState('')
  const [buildingActionId, setBuildingActionId] = useState(null)
  const [editingBuilding, setEditingBuilding] = useState(null)

  const buildingStats = [
    {
      title: 'Bâtiments',
      count: 4,
      description: 'Nombre total de bâtiments sur le site',
      icon: IoBusinessOutline,
      bgColor: '#3b82f6'
    },
    {
      title: 'Étages',
      count: 12,
      description: "Nombre total d'étages configurés",
      icon: IoGridOutline,
      bgColor: '#10b981'
    },
    {
      title: 'Espaces',
      count: 215,
      description: 'Chambres, salles de classe et bureaux',
      icon: IoConstructOutline,
      bgColor: '#6366f1'
    }
  ]

  const mockBuildings = [
    {
      id: 1,
      name: 'Bâtiment A',
      code: 'BA',
      type: 'Pédagogique',
      floors: 3,
      spaces: 42,
      incidents: 18
    },
    {
      id: 2,
      name: 'Bâtiment B',
      code: 'BB',
      type: 'Pédagogique',
      floors: 2,
      spaces: 28,
      incidents: 9
    },
    {
      id: 3,
      name: 'Cité Universitaire',
      code: 'CU',
      type: 'Résidentiel',
      floors: 4,
      spaces: 96,
      incidents: 32
    },
    {
      id: 4,
      name: 'Bâtiment des Pères',
      code: 'BP',
      type: 'Résidentiel',
      floors: 3,
      spaces: 24,
      incidents: 6
    }
  ]

  const allBuildings = [
    ...backendBuildings,
    ...mockBuildings.filter(
      (b) => !backendBuildings.find((bb) => bb.code === b.code || bb.name === b.name)
    )
  ]

  const mergedBuildingStats = buildingStats.map((stat) => {
    if (stat.title === 'Bâtiments') {
      return { ...stat, count: allBuildings.length }
    }
    return stat
  })

  // Données simulées pour les étages (générées dynamiquement)
  const getFloorsForBuilding = (buildingId) => {
    const building = allBuildings.find(b => b.id === buildingId)
    if (!building) return []
    
    const floors = []
    for (let i = 0; i < building.floors; i++) {
      floors.push({
        id: `${buildingId}-floor-${i}`,
        buildingId: buildingId,
        number: i,
        name: i === 0 ? 'Rez-de-chaussée' : `Étage ${i}`,
        spaces: Math.floor(building.spaces / building.floors),
        incidents: Math.floor(Math.random() * 10)
      })
    }
    return floors
  }

  // Données simulées pour les espaces
  const getSpacesForFloor = (buildingId, floorId) => {
    const building = allBuildings.find(b => b.id === buildingId)
    if (!building) return []
    
    const floors = getFloorsForBuilding(buildingId)
    const floor = floors.find(f => f.id === floorId)
    if (!floor) return []
    
    const spaces = []
    const spaceTypes = building.type === 'Résidentiel' 
      ? ['Chambre', 'Salle commune', 'Bureau']
      : ['Salle de classe', 'Laboratoire', 'Bureau', 'Amphithéâtre']
    
    for (let i = 1; i <= floor.spaces; i++) {
      const type = spaceTypes[Math.floor(Math.random() * spaceTypes.length)]
      const equipmentCount = Math.floor(Math.random() * 15)
      // Simuler des équipements défectueux (30% de chance d'en avoir si équipements présents)
      const defectiveCount = equipmentCount > 0 && Math.random() > 0.7 
        ? Math.floor(Math.random() * Math.min(3, equipmentCount)) + 1 
        : 0

      spaces.push({
        id: `${floorId}-space-${i}`,
        floorId: floorId,
        code: `${building.code}${floor.number}${String(i).padStart(2, '0')}`,
        name: `${type} ${building.code}${floor.number}${String(i).padStart(2, '0')}`,
        type: type,
        area: Math.floor(Math.random() * 50) + 20,
        occupants: Math.floor(Math.random() * 30),
        equipment: equipmentCount,
        defectiveEquipments: defectiveCount,
        incidents: Math.floor(Math.random() * 5)
      })
    }
    return spaces
  }

  // Obtenir les détails complets d'un espace (équipements, occupant, incidents)
  const getSpaceDetails = (space) => {
    if (!space || !selectedBuilding || !selectedFloor) return null

    // Données simulées pour les équipements de l'espace
    const equipmentTypes = ['Réfrigérateur', 'Climatiseur', 'Ordinateur', 'Imprimante', 'Ventilateur', 'Lampe LED', 'Table', 'Chaise']
    const equipmentStates = ['bon etat', 'à réparer', 'à remplacer', 'en maintenance', 'hors service']
    const equipments = []
    
    for (let i = 0; i < space.equipment; i++) {
      equipments.push({
        id: `eq-${space.id}-${i}`,
        name: `${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]} ${space.code}-${i + 1}`,
        type: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
        state: equipmentStates[Math.floor(Math.random() * equipmentStates.length)],
        brand: ['LG', 'Samsung', 'HP', 'Canon', 'Philips'][Math.floor(Math.random() * 5)],
        model: `Model-${Math.floor(Math.random() * 1000)}`
      })
    }

    // Occupant actuel (si c'est une chambre)
    const currentOccupant = space.type === 'Chambre' && Math.random() > 0.5
      ? {
          id: Math.floor(Math.random() * 10) + 1,
          lastName: ['Dupont', 'Martin', 'Bernard', 'Dubois', 'Laurent'][Math.floor(Math.random() * 5)],
          firstName: ['Jean', 'Marie', 'Sophie', 'Pierre', 'Thomas'][Math.floor(Math.random() * 5)],
          email: `occupant.${space.code}@email.com`,
          startDate: '2024-09-01',
          endDate: '2025-06-30'
        }
      : null

    // Historique des incidents
    const incidentsHistory = []
    for (let i = 0; i < space.incidents; i++) {
      incidentsHistory.push({
        id: `inc-${space.id}-${i}`,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('fr-FR'),
        description: `Incident ${i + 1} sur équipement ${equipments[i]?.name || 'équipement'}`,
        state: ['En cours', 'Résolu', 'A Reparer'][Math.floor(Math.random() * 3)],
        assignedAgent: ['Jon Snow', 'Jack Bauer', 'Jane Smith'][Math.floor(Math.random() * 3)]
      })
    }

    return {
      space,
      building: selectedBuilding,
      floor: selectedFloor,
      equipments,
      currentOccupant,
      incidentsHistory
    }
  }

  // Fonction pour ouvrir le modal de détail
  const handleViewSpaceDetails = (e, space) => {
    e.stopPropagation() // Empêcher le clic de se propager à la ligne
    setSelectedSpace(space)
    setShowSpaceDetailModal(true)
  }

  // Fonction pour fermer le modal
  const handleCloseSpaceDetail = () => {
    setShowSpaceDetailModal(false)
    setSelectedSpace(null)
  }

  // Fonction pour obtenir la classe CSS du badge d'état d'équipement
  const getEquipmentStateBadgeClass = (state) => {
    const stateMap = {
      'bon etat': 'badge-bon-etat',
      'à réparer': 'badge-a-reparer',
      'à remplacer': 'badge-a-remplacer',
      'en maintenance': 'badge-en-maintenance',
      'hors service': 'badge-hors-service'
    }
    return stateMap[state] || 'badge-bon-etat'
  }

  // Fonctions de navigation
  const handleBuildingClick = (building) => {
    setSelectedBuilding(building)
    setViewLevel('floors')
    setSearchQuery('') // Réinitialiser la recherche
  }

  const handleFloorClick = (floor) => {
    setSelectedFloor(floor)
    setViewLevel('spaces')
    setSearchQuery('') // Réinitialiser la recherche
    setCurrentPage(1) // Réinitialiser la pagination
  }

  const handleBackClick = () => {
    if (viewLevel === 'spaces') {
      setViewLevel('floors')
      setSelectedFloor(null)
      setSearchQuery('')
      setCurrentPage(1) // Réinitialiser la pagination
    } else if (viewLevel === 'floors') {
      setViewLevel('buildings')
      setSelectedBuilding(null)
      setSearchQuery('')
    }
  }

  const handleRefreshBuildings = async () => {
    setIsLoadingBackend(true)
    setBuildingsMessage('')
    try {
      const result = await listBuildings({ page: 1, limit: 100 })
      const mapped =
        result?.data?.map((b, index) => ({
          id: b.id || `backend-${index}`,
          name: b.name,
          code: b.code,
          type: b.type || 'N/A',
          floors: b.floorsCount || b.floors || 0,
          spaces: b.totalSpaces || b.spaces || 0,
          incidents: b.incidents || 0,
          fromBackend: true
        })) || []
      setBackendBuildings(mapped)
      setBuildingsMessage(`✅ ${mapped.length} bâtiment(s) chargés depuis le backend`)
    } catch (error) {
      setBuildingsMessage(`❌ Erreur lors du chargement: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsLoadingBackend(false)
    }
  }

  const handleDeleteBuilding = async (building, event) => {
    event.stopPropagation()
    if (!building?.fromBackend) {
      setBuildingsMessage('❌ Suppression disponible uniquement pour les bâtiments backend.')
      return
    }
    if (!window.confirm(`Supprimer ${building.name} ?`)) return
    setBuildingActionId(building.id)
    setBuildingsMessage('')
    try {
      await deleteBuilding(building.id)
      setBuildingsMessage('✅ Bâtiment supprimé (backend)')
      await handleRefreshBuildings()
    } catch (error) {
      setBuildingsMessage(`❌ Erreur suppression: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setBuildingActionId(null)
    }
  }

  const handleEditBuilding = (building, event) => {
    event.stopPropagation()
    if (!building?.fromBackend) {
      setBuildingsMessage('❌ Edition disponible uniquement pour les bâtiments backend.')
      return
    }
    setEditingBuilding(building)
    setNewBuilding({
      name: building.name,
      code: building.code,
      type: building.type || 'Pédagogique',
      floors: building.floors || 1,
      spaces: building.spaces || 0
    })
    setShowAddBuildingModal(true)
  }

  // Filtrer les bâtiments selon la recherche
  const filteredBuildings = allBuildings.filter((building) => {
    const query = searchQuery.toLowerCase()
    return (
      building.name.toLowerCase().includes(query) ||
      building.code.toLowerCase().includes(query) ||
      building.type.toLowerCase().includes(query) ||
      building.spaces.toString().includes(query)
    )
  })

  // Obtenir les données actuelles selon le niveau de navigation
  const getCurrentData = () => {
    if (viewLevel === 'buildings') {
      return filteredBuildings
    } else if (viewLevel === 'floors' && selectedBuilding) {
      const floors = getFloorsForBuilding(selectedBuilding.id)
      const query = searchQuery.toLowerCase()
      return floors.filter(floor => 
        floor.name.toLowerCase().includes(query) ||
        floor.number.toString().includes(query)
      )
    } else if (viewLevel === 'spaces' && selectedBuilding && selectedFloor) {
      const spaces = getSpacesForFloor(selectedBuilding.id, selectedFloor.id)
      const query = searchQuery.toLowerCase()
      return spaces.filter(space => 
        space.name.toLowerCase().includes(query) ||
        space.code.toLowerCase().includes(query) ||
        space.type.toLowerCase().includes(query)
      )
    }
    return []
  }

  const allData = getCurrentData()
  
  // Pagination uniquement pour les espaces
  const isSpacesView = viewLevel === 'spaces'

  // Fetch initial backend buildings au montage
  useEffect(() => {
    handleRefreshBuildings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const totalPages = isSpacesView ? Math.ceil(allData.length / itemsPerPage) : 1
  const startIndex = isSpacesView ? (currentPage - 1) * itemsPerPage : 0
  const endIndex = isSpacesView ? startIndex + itemsPerPage : allData.length
  const currentData = isSpacesView ? allData.slice(startIndex, endIndex) : allData

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    if (isSpacesView) {
      setCurrentPage(1)
    }
  }, [searchQuery, isSpacesView])

  // Ajuster la page courante si elle dépasse le nombre total de pages
  useEffect(() => {
    if (isSpacesView && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, isSpacesView, currentPage])

  // Calculer les détails de l'espace sélectionné pour le modal
  const spaceDetails = selectedSpace ? getSpaceDetails(selectedSpace) : null

  // Info de sélection pour la vue 3D (utilise la même carte démo pour l'instant)
  const selectionInfo = (() => {
    if (viewLevel === 'buildings' && selectedBuilding) {
      return { label: `Bâtiment : ${selectedBuilding.name}`, detail: selectedBuilding.code }
    }
    if (viewLevel === 'floors' && selectedBuilding && selectedFloor) {
      return { label: `Étage : ${selectedFloor.name}`, detail: selectedBuilding.name }
    }
    if (viewLevel === 'spaces' && selectedBuilding && selectedFloor && selectedSpace) {
      return { label: `Espace : ${selectedSpace.name}`, detail: `${selectedBuilding.name} • ${selectedFloor.name}` }
    }
    return { label: 'Sélectionnez un bâtiment pour centrer la vue' }
  })()

  // Obtenir le titre de la section selon le niveau
  const getSectionTitle = () => {
    if (viewLevel === 'buildings') {
      return 'Liste des bâtiments'
    } else if (viewLevel === 'floors' && selectedBuilding) {
      return `Étages - ${selectedBuilding.name}`
    } else if (viewLevel === 'spaces' && selectedBuilding && selectedFloor) {
      return `Espaces - ${selectedBuilding.name} - ${selectedFloor.name}`
    }
    return 'Liste des bâtiments'
  }

  const getSectionSubtitle = () => {
    if (viewLevel === 'buildings') {
      return "Vue d'ensemble des bâtiments configurés sur le site d'Eyang"
    } else if (viewLevel === 'floors') {
      return `Liste des étages du ${selectedBuilding?.name}`
    } else if (viewLevel === 'spaces') {
      return `Liste des espaces au ${selectedFloor?.name}`
    }
    return "Vue d'ensemble des bâtiments configurés sur le site d'Eyang"
  }

  // Fonction pour gérer l'ajout d'un bâtiment (mock + placeholder backend)
  const handleAddBuilding = async (e) => {
    e.preventDefault()
    setBuildingsMessage('')
    try {
      if (editingBuilding) {
        await updateBuilding(editingBuilding.id, {
          name: newBuilding.name,
          code: newBuilding.code,
          type: newBuilding.type || 'Pédagogique',
          floorsCount: Number(newBuilding.floors) || 1,
          totalSpaces: Number(newBuilding.spaces) || 0
        })
        setBuildingsMessage('✅ Bâtiment mis à jour (backend)')
      } else {
        await createBuilding({
          name: newBuilding.name,
          code: newBuilding.code,
          type: newBuilding.type || 'Pédagogique',
          floorsCount: Number(newBuilding.floors) || 1,
          totalSpaces: Number(newBuilding.spaces) || 0
        })
        setBuildingsMessage('✅ Bâtiment créé (backend)')
      }
      await handleRefreshBuildings()
    } catch (error) {
      setBuildingsMessage(`❌ Erreur: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setNewBuilding({
        name: '',
        code: '',
        type: 'Pédagogique',
        floors: 1,
        spaces: 0
      })
      setEditingBuilding(null)
      setShowAddBuildingModal(false)
    }
  }

  // Fonction pour réinitialiser le formulaire
  const handleCancelAdd = () => {
    setNewBuilding({
      name: '',
      code: '',
      type: 'Pédagogique',
      floors: 1,
      spaces: 0
    })
    setShowAddBuildingModal(false)
  }

  return (
    <>
      <div className="buildings-page">
        <div className="stats-grid">
          {buildingStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
                  <IconComponent />
                </div>
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-count">{stat.count}</div>
                <div className="stat-divider"></div>
                <p className="stat-description">{stat.description}</p>
              </div>
            )
          })}
        </div>

        <div className="buildings-layout">
          <div className="buildings-list-card">
            {buildingsMessage && (
              <div className="buildings-status-banner">
                {buildingsMessage}
              </div>
            )}
            <div className="buildings-card-header">
              {viewLevel !== 'buildings' && (
                <button className="btn-back" onClick={handleBackClick}>
                  <IoArrowBackOutline />
                  <span>Retour</span>
                </button>
              )}
              <div className="buildings-header-top">
                <div>
                  <h3 className="buildings-title">{getSectionTitle()}</h3>
                  <p className="buildings-subtitle">
                    {getSectionSubtitle()}
                  </p>
                </div>
                {viewLevel === 'buildings' && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-add-building"
                      onClick={handleRefreshBuildings}
                      disabled={isLoadingBackend}
                      style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                    >
                      <IoRefreshOutline />
                      <span>{isLoadingBackend ? 'Chargement...' : 'Rafraîchir (backend)'}</span>
                    </button>
                    <button 
                      className="btn-add-building"
                      onClick={() => {
                        setEditingBuilding(null)
                        setShowAddBuildingModal(true)
                      }}
                    >
                      <IoAddOutline />
                      <span>Ajouter un bâtiment</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="search-container">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Rechercher un bâtiment ou un espace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <table className="buildings-table">
              <thead>
                <tr>
                  {viewLevel === 'buildings' && (
                    <>
                      <th>Nom</th>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Étages</th>
                      <th>Espaces</th>
                      <th>Incidents</th>
                          <th className="text-right">Actions</th>
                    </>
                  )}
                  {viewLevel === 'floors' && (
                    <>
                      <th>Étage</th>
                      <th>Numéro</th>
                      <th>Espaces</th>
                      <th>Incidents</th>
                    </>
                  )}
                  {viewLevel === 'spaces' && (
                    <>
                      <th>Code</th>
                      <th>Nom</th>
                      <th>Type</th>
                      <th>Surface (m²)</th>
                      <th>Occupants</th>
                      <th>Équipements</th>
                      <th>Incidents</th>
                      <th className="text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  <>
                    {viewLevel === 'buildings' && currentData.map((building) => (
                      <tr 
                        key={building.code} 
                        onClick={() => handleBuildingClick(building)}
                        className="clickable-row"
                      >
                        <td>{building.name}</td>
                        <td>{building.code}</td>
                        <td>{building.type}</td>
                        <td>{building.floors}</td>
                        <td>{building.spaces}</td>
                        <td>
                          <span
                            className={`badge-incidents ${
                              building.incidents > 20 ? 'badge-danger' : building.incidents > 10 ? 'badge-warning' : 'badge-success'
                            }`}
                          >
                            {building.incidents}
                          </span>
                        </td>
                        <td className="text-right" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {building.fromBackend && (
                            <>
                              <button
                                className="btn-delete-building"
                                onClick={(e) => handleEditBuilding(building, e)}
                                disabled={buildingActionId === building.id}
                              >
                                Éditer
                              </button>
                              <button
                                className="btn-delete-building"
                                onClick={(e) => handleDeleteBuilding(building, e)}
                                disabled={buildingActionId === building.id}
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {viewLevel === 'floors' && currentData.map((floor) => (
                      <tr 
                        key={floor.id}
                        onClick={() => handleFloorClick(floor)}
                        className="clickable-row"
                      >
                        <td>{floor.name}</td>
                        <td>{floor.number}</td>
                        <td>{floor.spaces}</td>
                        <td>
                          <span
                            className={`badge-incidents ${
                              floor.incidents > 5 ? 'badge-warning' : 'badge-success'
                            }`}
                          >
                            {floor.incidents}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {viewLevel === 'spaces' && currentData.map((space) => (
                      <tr key={space.id}>
                        <td>{space.code}</td>
                        <td>{space.name}</td>
                        <td>{space.type}</td>
                        <td>{space.area}</td>
                        <td>{space.occupants}</td>
                        <td>
                          <div className="equipment-cell">
                            <span>{space.equipment}</span>
                            {space.defectiveEquipments > 0 && (
                              <div className="defective-badge" title={`${space.defectiveEquipments} équipement(s) défectueux`}>
                                <IoWarning />
                                <span>{space.defectiveEquipments}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge-incidents ${
                              space.incidents > 2 ? 'badge-danger' : space.incidents > 0 ? 'badge-warning' : 'badge-success'
                            }`}
                          >
                            {space.incidents}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            className="btn-view-details"
                            onClick={(e) => handleViewSpaceDetails(e, space)}
                            title="Voir les détails"
                          >
                            <IoEyeOutline />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={viewLevel === 'buildings' ? 6 : viewLevel === 'floors' ? 4 : 8} className="no-results">
                      {searchQuery ? `Aucun résultat trouvé pour "${searchQuery}"` : 'Aucune donnée disponible'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination pour les espaces */}
            {isSpacesView && allData.length > itemsPerPage && (
              <div className="buildings-pagination">
                <div className="pagination-info">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, allData.length)} sur {allData.length} espaces
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    title="Page précédente"
                  >
                    <IoChevronBackOutline />
                  </button>
                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                      // Afficher seulement les pages proches de la page courante
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="pagination-ellipsis">...</span>
                      }
                      return null
                    })}
                  </div>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    title="Page suivante"
                  >
                    <IoChevronForwardOutline />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="buildings-map-card">
            <div className="buildings-map-card-header">
              <div>
                <h3 className="buildings-title">Carte des bâtiments</h3>
                <p className="buildings-subtitle">
                  Visualisation 3D de démonstration basée sur des données de campus fictives.
                </p>
              </div>
              <button
                className="btn-fullscreen-3d"
                onClick={() => setIsFullscreen3D(true)}
                title="Afficher en plein écran"
              >
                <IoExpandOutline />
              </button>
            </div>
            <Campus3DView selectionInfo={selectionInfo} />
          </div>
        </div>
      </div>

      {/* Modal Détail d'un espace */}
      {showSpaceDetailModal && spaceDetails && (
          <div className="modal-overlay" onClick={handleCloseSpaceDetail}>
            <div className="modal-content modal-space-detail" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Détails de l&apos;espace</h2>
                <button className="modal-close-btn" onClick={handleCloseSpaceDetail}>
                  <IoCloseOutline />
                </button>
              </div>
              <div className="modal-body-space-detail">
                {/* Informations générales */}
                <div className="space-detail-section">
                  <h3 className="space-detail-section-title">Informations générales</h3>
                  <div className="space-detail-info-grid">
                    <div className="space-detail-info-item">
                      <span className="space-detail-label">Bâtiment:</span>
                      <span className="space-detail-value">{spaceDetails.building.name} ({spaceDetails.building.code})</span>
                    </div>
                    <div className="space-detail-info-item">
                      <span className="space-detail-label">Étage:</span>
                      <span className="space-detail-value">{spaceDetails.floor.name}</span>
                    </div>
                    <div className="space-detail-info-item">
                      <span className="space-detail-label">Code:</span>
                      <span className="space-detail-value">{spaceDetails.space.code}</span>
                    </div>
                    <div className="space-detail-info-item">
                      <span className="space-detail-label">Nom:</span>
                      <span className="space-detail-value">{spaceDetails.space.name}</span>
                    </div>
                    <div className="space-detail-info-item">
                      <span className="space-detail-label">Type:</span>
                      <span className="space-detail-value">{spaceDetails.space.type}</span>
                    </div>
                    <div className="space-detail-info-item">
                      <span className="space-detail-label">Surface:</span>
                      <span className="space-detail-value">{spaceDetails.space.area} m²</span>
                    </div>
                  </div>
                </div>

                {/* Occupant actuel (si chambre) */}
                {spaceDetails.currentOccupant && (
                  <div className="space-detail-section">
                    <h3 className="space-detail-section-title">Occupant actuel</h3>
                    <div className="space-detail-occupant">
                      <div className="space-detail-info-item">
                        <span className="space-detail-label">Nom:</span>
                        <span className="space-detail-value">{spaceDetails.currentOccupant.lastName} {spaceDetails.currentOccupant.firstName}</span>
                      </div>
                      <div className="space-detail-info-item">
                        <span className="space-detail-label">Email:</span>
                        <span className="space-detail-value">{spaceDetails.currentOccupant.email}</span>
                      </div>
                      <div className="space-detail-info-item">
                        <span className="space-detail-label">Période d&apos;occupation:</span>
                        <span className="space-detail-value">{spaceDetails.currentOccupant.startDate} - {spaceDetails.currentOccupant.endDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liste des équipements */}
                <div className="space-detail-section">
                  <div className="space-detail-section-header">
                    <h3 className="space-detail-section-title">
                      Équipements ({spaceDetails.equipments.length})
                    </h3>
                    <button
                      className="btn-assign-equipment"
                      onClick={() => setShowAssignEquipmentModal(true)}
                    >
                      <IoAddOutline />
                      <span>Assigner un équipement</span>
                    </button>
                  </div>
                  {spaceDetails.equipments.length > 0 ? (
                    <div className="space-detail-equipments">
                      <table className="space-detail-table">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Marque</th>
                            <th>État</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {spaceDetails.equipments.map((equipment) => (
                            <tr key={equipment.id}>
                              <td>{equipment.name}</td>
                              <td>{equipment.type}</td>
                              <td>{equipment.brand}</td>
                              <td>
                                <span className={`badge-state ${getEquipmentStateBadgeClass(equipment.state)}`}>
                                  {equipment.state}
                                </span>
                              </td>
                              <td className="text-right">
                                <button
                                  className="btn-remove-equipment"
                                  title="Retirer l'équipement"
                                >
                                  <IoCloseOutline />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-detail-empty-container">
                      <p className="space-detail-empty">Aucun équipement assigné à cet espace</p>
                    </div>
                  )}
                </div>

                {/* Historique des incidents */}
                <div className="space-detail-section">
                  <h3 className="space-detail-section-title">
                    Historique des incidents ({spaceDetails.incidentsHistory.length})
                  </h3>
                  {spaceDetails.incidentsHistory.length > 0 ? (
                    <div className="space-detail-incidents">
                      {spaceDetails.incidentsHistory.map((incident) => (
                        <div key={incident.id} className="space-detail-incident-item">
                          <div className="space-detail-incident-header">
                            <span className="space-detail-incident-date">{incident.date}</span>
                            <span className={`badge-state ${incident.state === 'Résolu' ? 'badge-bon-etat' : incident.state === 'A Reparer' ? 'badge-a-reparer' : 'badge-en-cours'}`}>
                              {incident.state}
                            </span>
                          </div>
                          <p className="space-detail-incident-description">{incident.description}</p>
                          <div className="space-detail-incident-footer">
                            <span className="space-detail-incident-agent">Agent: {incident.assignedAgent}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="space-detail-empty">Aucun incident enregistré pour cet espace</p>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseSpaceDetail}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Modal Assigner un équipement */}
      {showAssignEquipmentModal && selectedSpace && spaceDetails && (
        <div className="modal-overlay" onClick={handleCancelAssignEquipment}>
          <div className="modal-content modal-assign-equipment" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assigner un équipement à {spaceDetails.space.code}</h2>
              <button className="modal-close-btn" onClick={handleCancelAssignEquipment}>
                <IoCloseOutline />
              </button>
            </div>
            <div className="modal-body-assign-equipment">
              <div className="assign-equipment-info">
                <p className="assign-equipment-space-info">
                  <strong>Espace:</strong> {spaceDetails.space.name} ({spaceDetails.space.code})<br />
                  <strong>Localisation:</strong> {spaceDetails.building.name} - {spaceDetails.floor.name}
                </p>
              </div>

              <div className="assign-equipment-list">
                <div className="assign-equipment-list-header">
                  <h3 className="assign-equipment-list-title">Équipements disponibles</h3>
                  <button
                    className="btn-select-all-equipments"
                    onClick={handleSelectAllEquipmentsForAssign}
                  >
                    {selectedEquipmentsForAssign.length === getAvailableEquipments().length && getAvailableEquipments().length > 0 ? (
                      <IoCheckboxOutline />
                    ) : (
                      <IoSquareOutline />
                    )}
                    <span>Sélectionner tout</span>
                  </button>
                </div>
                <div className="assign-equipment-table-container">
                  <table className="assign-equipment-table">
                    <thead>
                      <tr>
                        <th className="checkbox-column"></th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Marque</th>
                        <th>État</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAvailableEquipments().map((equipment) => (
                        <tr key={equipment.id}>
                          <td className="checkbox-column">
                            <button
                              className="checkbox-btn"
                              onClick={() => handleSelectEquipmentForAssign(equipment.id)}
                            >
                              {selectedEquipmentsForAssign.includes(equipment.id) ? (
                                <IoCheckboxOutline />
                              ) : (
                                <IoSquareOutline />
                              )}
                            </button>
                          </td>
                          <td>{equipment.name}</td>
                          <td>{equipment.type}</td>
                          <td>{equipment.brand}</td>
                          <td>
                            <span className={`badge-state ${getEquipmentStateBadgeClass(equipment.state)}`}>
                              {equipment.state}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleCancelAssignEquipment}>
                Annuler
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={handleAssignEquipments}
                disabled={selectedEquipmentsForAssign.length === 0}
              >
                Assigner ({selectedEquipmentsForAssign.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter un bâtiment */}
      {showAddBuildingModal && (
        <div className="modal-overlay" onClick={handleCancelAdd}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingBuilding ? 'Modifier le bâtiment' : 'Ajouter un nouveau bâtiment'}
              </h2>
              <button className="modal-close-btn" onClick={handleCancelAdd}>
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={handleAddBuilding} className="modal-form">
              <div className="form-group">
                <label htmlFor="building-name">Nom du bâtiment *</label>
                <input
                  type="text"
                  id="building-name"
                  value={newBuilding.name}
                  onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                  placeholder="Ex: Bâtiment C"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="building-code">Code du bâtiment *</label>
                <input
                  type="text"
                  id="building-code"
                  value={newBuilding.code}
                  onChange={(e) => setNewBuilding({ ...newBuilding, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: BC"
                  required
                  maxLength={5}
                />
              </div>
              <div className="form-group">
                <label htmlFor="building-type">Type de bâtiment *</label>
                <select
                  id="building-type"
                  value={newBuilding.type}
                  onChange={(e) => setNewBuilding({ ...newBuilding, type: e.target.value })}
                  required
                >
                  <option value="Pédagogique">Pédagogique</option>
                  <option value="Administratif">Administratif</option>
                  <option value="Résidentiel">Résidentiel</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="building-floors">Nombre d&apos;étages *</label>
                  <input
                    type="number"
                    id="building-floors"
                    value={newBuilding.floors}
                    onChange={(e) => setNewBuilding({ ...newBuilding, floors: parseInt(e.target.value) || 1 })}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="building-spaces">Nombre d&apos;espaces</label>
                  <input
                    type="number"
                    id="building-spaces"
                    value={newBuilding.spaces}
                    onChange={(e) => setNewBuilding({ ...newBuilding, spaces: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelAdd}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  {editingBuilding ? 'Mettre à jour' : 'Ajouter le bâtiment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Plein écran 3D */}
      {isFullscreen3D && (
        <div className="fullscreen-3d-overlay" onClick={() => setIsFullscreen3D(false)}>
          <div className="fullscreen-3d-container" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-3d-header">
              <div className="fullscreen-3d-title">
                <h2>Visualisation 3D - Carte des bâtiments</h2>
                {selectionInfo?.label && (
                  <p className="fullscreen-3d-subtitle">{selectionInfo.label}</p>
                )}
              </div>
              <button
                className="btn-close-fullscreen"
                onClick={() => setIsFullscreen3D(false)}
                title="Fermer le plein écran"
              >
                <IoContractOutline />
              </button>
            </div>
            <div className="fullscreen-3d-content">
              <Campus3DView selectionInfo={selectionInfo} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Buildings

