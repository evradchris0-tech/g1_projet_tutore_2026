import { useState, useEffect, useRef } from 'react'
import {
  IoSearchOutline,
  IoAddOutline,
  IoFilterOutline,
  IoSwapVerticalOutline,
  IoCheckboxOutline,
  IoSquareOutline,
  IoEllipsisVerticalOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoRefreshOutline
} from 'react-icons/io5'
import '../styles/Equipments.css'
import { listEquipments, createEquipment, deleteEquipment, assignEquipmentToSpace } from '../services/equipments'

function Equipments({ searchQuery, setSearchQuery, openCreateModalToken = null }) {
  // États pour la page Équipements
  const [selectedEquipments, setSelectedEquipments] = useState([])
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const lastOpenTokenRef = useRef(null)
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    model: '',
    value: '',
    buildingId: '',
    floorId: '',
    spaceId: '',
    type: '',
    brand: '',
    lifespan: '',
    description: '',
    state: 'bon etat',
    status: 'Activé'
  })
  const [backendEquipments, setBackendEquipments] = useState([])
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)
  const [equipmentsMessage, setEquipmentsMessage] = useState('')
  const [equipmentActionId, setEquipmentActionId] = useState(null)

  useEffect(() => {
    if (openCreateModalToken && openCreateModalToken !== lastOpenTokenRef.current) {
      setShowAddEquipmentModal(true)
      lastOpenTokenRef.current = openCreateModalToken
    }
  }, [openCreateModalToken])

  // Données simulées pour les bâtiments (même structure que Buildings.jsx)
  const buildings = [
    {
      id: 1,
      name: 'Bâtiment A',
      code: 'BA',
      type: 'Pédagogique',
      floors: 3,
      spaces: 42
    },
    {
      id: 2,
      name: 'Bâtiment B',
      code: 'BB',
      type: 'Pédagogique',
      floors: 2,
      spaces: 28
    },
    {
      id: 3,
      name: 'Cité Universitaire',
      code: 'CU',
      type: 'Résidentiel',
      floors: 4,
      spaces: 96
    },
    {
      id: 4,
      name: 'Bâtiment des Pères',
      code: 'BP',
      type: 'Résidentiel',
      floors: 3,
      spaces: 24
    }
  ]

  // Obtenir les étages d'un bâtiment
  const getFloorsForBuilding = (buildingId) => {
    const building = buildings.find(b => b.id === buildingId)
    if (!building) return []
    
    const floors = []
    for (let i = 0; i < building.floors; i++) {
      floors.push({
        id: `${buildingId}-floor-${i}`,
        buildingId: buildingId,
        number: i,
        name: i === 0 ? 'Rez-de-chaussée' : `Étage ${i}`
      })
    }
    return floors
  }

  // Obtenir les espaces d'un étage
  const getSpacesForFloor = (buildingId, floorId) => {
    const building = buildings.find(b => b.id === buildingId)
    if (!building) return []
    
    const floors = getFloorsForBuilding(buildingId)
    const floor = floors.find(f => f.id === floorId)
    if (!floor) return []
    
    const spaces = []
    const spaceTypes = building.type === 'Résidentiel' 
      ? ['Chambre', 'Salle commune', 'Bureau']
      : ['Salle de classe', 'Laboratoire', 'Bureau', 'Amphithéâtre']
    
    const spacesPerFloor = Math.floor(building.spaces / building.floors)
    for (let i = 1; i <= spacesPerFloor; i++) {
      const type = spaceTypes[Math.floor(Math.random() * spaceTypes.length)]
      spaces.push({
        id: `${floorId}-space-${i}`,
        floorId: floorId,
        code: `${building.code}${floor.number}${String(i).padStart(2, '0')}`,
        name: `${type} ${building.code}${floor.number}${String(i).padStart(2, '0')}`,
        type: type
      })
    }
    return spaces
  }

  // Obtenir la liste des espaces disponibles pour le sélecteur
  const getAvailableSpaces = () => {
    const allSpaces = []
    buildings.forEach(building => {
      const floors = getFloorsForBuilding(building.id)
      floors.forEach(floor => {
        const spaces = getSpacesForFloor(building.id, floor.id)
        spaces.forEach(space => {
          allSpaces.push({
            ...space,
            buildingName: building.name,
            buildingCode: building.code,
            floorName: floor.name
          })
        })
      })
    })
    return allSpaces
  }

  // Données simulées pour les équipements
  const equipments = [
    { id: 1, name: 'Réfrigérateur LG 450L', type: 'Réfrigérateur', state: 'bon etat', lastMaintenance: '6 98 76 54 32', status: 'Activé' },
    { id: 2, name: 'Climatiseur Samsung', type: 'Climatiseur', state: 'à remplacer', lastMaintenance: '6 98 76 54 32', status: 'Désactivé' },
    { id: 3, name: 'Ordinateur HP ProDesk', type: 'Ordinateur', state: 'bon etat', lastMaintenance: '6 98 76 54 32', status: 'Activé' },
    { id: 4, name: 'Imprimante Canon', type: 'Imprimante', state: 'à réparer', lastMaintenance: '6 98 76 54 32', status: 'Activé' },
    { id: 5, name: 'Table de Bureau', type: 'Mobilier', state: 'en maintenance', lastMaintenance: '6 98 76 54 32', status: 'Désactivé' },
    { id: 6, name: 'Ventilateur Plafond', type: 'Ventilateur', state: 'bon etat', lastMaintenance: '6 98 76 54 32', status: 'Activé' },
    { id: 7, name: 'Projecteur Epson', type: 'Projecteur', state: 'hors service', lastMaintenance: '6 98 76 54 32', status: 'Désactivé' },
    { id: 8, name: 'Machine à Café', type: 'Machine à Café', state: 'en attente de piece', lastMaintenance: '6 98 76 54 32', status: 'Désactivé' },
    { id: 9, name: 'Lampe LED Bureau', type: 'Éclairage', state: 'bon etat', lastMaintenance: '6 98 76 54 32', status: 'Activé' }
  ]

  const handleRefreshEquipments = async () => {
    setIsLoadingBackend(true)
    setEquipmentsMessage('')
    try {
      const result = await listEquipments({ page: 1, limit: 100 })
      const mapped =
        result?.data?.map((eq, idx) => ({
          id: eq.id || `eq-back-${idx}`,
          name: eq.name,
          type: eq.category || eq.type || 'N/A',
          state: eq.condition || 'bon etat',
          lastMaintenance: eq.lastMaintenanceDate
            ? new Date(eq.lastMaintenanceDate).toLocaleDateString('fr-FR')
            : 'N/A',
          status: eq.status || 'Activé',
          fromBackend: true
        })) || []
      setBackendEquipments(mapped)
      setEquipmentsMessage(`✅ ${mapped.length} équipement(s) chargés depuis le backend`)
    } catch (error) {
      setEquipmentsMessage(`❌ Erreur lors du chargement: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsLoadingBackend(false)
    }
  }

  // Gestion des équipements
  const handleSelectEquipment = (equipmentId) => {
    setSelectedEquipments(prev => {
      if (prev.includes(equipmentId)) {
        return prev.filter(id => id !== equipmentId)
      } else {
        return [...prev, equipmentId]
      }
    })
  }

  const handleSelectAllEquipments = () => {
    // Utiliser paginatedEquipments pour la sélection de la page courante
    const allPaginatedIds = paginatedEquipments.map(eq => eq.id)
    const allSelected = allPaginatedIds.every(id => selectedEquipments.includes(id))
    
    if (allSelected) {
      // Désélectionner tous les équipements de la page courante
      setSelectedEquipments(prev => prev.filter(id => !allPaginatedIds.includes(id)))
    } else {
      // Sélectionner tous les équipements de la page courante
      setSelectedEquipments(prev => {
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

  const handleDeleteEquipment = async (equipment) => {
    if (!equipment?.fromBackend) {
      setEquipmentsMessage('❌ Suppression dispo uniquement pour équipements backend.')
      return
    }
    if (!window.confirm(`Supprimer ${equipment.name} ?`)) return
    setEquipmentActionId(equipment.id)
    setEquipmentsMessage('')
    try {
      await deleteEquipment(equipment.id)
      setEquipmentsMessage('✅ Équipement supprimé')
      await handleRefreshEquipments()
    } catch (error) {
      setEquipmentsMessage(`❌ Erreur suppression: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setEquipmentActionId(null)
    }
  }

  const handleAssignEquipment = async (equipment) => {
    if (!equipment?.fromBackend) {
      setEquipmentsMessage('❌ Assignation dispo uniquement pour équipements backend.')
      return
    }
    const spaceId = prompt('spaceId à assigner :', '')
    if (!spaceId) return
    setEquipmentActionId(equipment.id)
    setEquipmentsMessage('')
    try {
      await assignEquipmentToSpace(equipment.id, { spaceId })
      setEquipmentsMessage('✅ Équipement assigné')
      await handleRefreshEquipments()
    } catch (error) {
      setEquipmentsMessage(`❌ Erreur assignation: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setEquipmentActionId(null)
    }
  }

  // Fetch initial backend equipments au montage
  useEffect(() => {
    handleRefreshEquipments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddEquipment = async (e) => {
    e.preventDefault()
    setEquipmentsMessage('')
    try {
      await createEquipment({
        name: newEquipment.name,
        category: newEquipment.type || 'N/A',
        brand: newEquipment.brand || '',
        model: newEquipment.model || '',
        status: newEquipment.status || 'Activé',
        condition: newEquipment.state || 'bon etat',
        spaceId: newEquipment.spaceId || undefined
      })
      setEquipmentsMessage('✅ Équipement créé (backend)')
      await handleRefreshEquipments()
    } catch (error) {
      setEquipmentsMessage(`❌ Erreur création: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setNewEquipment({
        name: '',
        model: '',
        value: '',
        buildingId: '',
        floorId: '',
        spaceId: '',
        type: '',
        brand: '',
        lifespan: '',
        description: '',
        state: 'bon etat',
        status: 'Activé'
      })
      setShowAddEquipmentModal(false)
    }
  }

  const handleCancelAddEquipment = () => {
    setNewEquipment({
      name: '',
      model: '',
      value: '',
      buildingId: '',
      floorId: '',
      spaceId: '',
      type: '',
      brand: '',
      lifespan: '',
      description: '',
      state: 'bon etat',
      status: 'Activé'
    })
    setShowAddEquipmentModal(false)
  }

  // Gérer le changement de bâtiment (réinitialiser étage et espace)
  const handleBuildingChange = (buildingId) => {
    setNewEquipment({
      ...newEquipment,
      buildingId: buildingId,
      floorId: '',
      spaceId: ''
    })
  }

  // Gérer le changement d'étage (réinitialiser espace)
  const handleFloorChange = (floorId) => {
    setNewEquipment({
      ...newEquipment,
      floorId: floorId,
      spaceId: ''
    })
  }

  // Filtrer les équipements selon la recherche
  const allEquipments = [
    ...backendEquipments,
    ...equipments.filter(
      (eq) => !backendEquipments.find((be) => be.name === eq.name && be.type === eq.type)
    )
  ]

  const filteredEquipments = allEquipments.filter((equipment) => {
    const query = searchQuery.toLowerCase()
    return (
      equipment.name.toLowerCase().includes(query) ||
      equipment.type.toLowerCase().includes(query) ||
      equipment.state.toLowerCase().includes(query) ||
      equipment.status.toLowerCase().includes(query)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEquipments = filteredEquipments.slice(startIndex, endIndex)
  const totalEquipments = filteredEquipments.length
  const displayStart = totalEquipments > 0 ? startIndex + 1 : 0
  const displayEnd = Math.min(endIndex, totalEquipments)

  // Réinitialiser la page courante si elle est hors limites après filtrage
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [filteredEquipments.length, currentPage, totalPages])

  // Fonction pour obtenir la classe CSS du badge selon l'état
  const getStateBadgeClass = (state) => {
    const stateMap = {
      'bon etat': 'badge-bon-etat',
      'à remplacer': 'badge-a-remplacer',
      'à réparer': 'badge-a-reparer',
      'en maintenance': 'badge-en-maintenance',
      'hors service': 'badge-hors-service',
      'en attente de piece': 'badge-en-attente-de-piece'
    }
    return stateMap[state] || 'badge-bon-etat'
  }

  return (
    <>
      <div className="equipments-page">
        <div className="equipments-header-bar">
          <h2 className="equipments-page-title">Table des Equipements</h2>
          <div className="search-container search-equipments">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Faites votre recherche ici"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="equipments-actions-right">
            <button className="btn-filter">
              <IoFilterOutline />
            </button>
            <button className="btn-sort">
              <IoSwapVerticalOutline />
            </button>
            <button
              className="btn-add-equipment"
              onClick={handleRefreshEquipments}
              disabled={isLoadingBackend}
              style={{ backgroundColor: '#f0f0f0', color: '#333' }}
            >
              <IoRefreshOutline />
              <span>{isLoadingBackend ? 'Chargement...' : 'Rafraîchir (backend)'}</span>
            </button>
            <button 
              className="btn-add-equipment"
              onClick={() => setShowAddEquipmentModal(true)}
            >
              <IoAddOutline />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        {equipmentsMessage && (
          <div className="equipments-status-banner">
            {equipmentsMessage}
          </div>
        )}

        <div className="equipments-table-container">
          <table className="equipments-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <button 
                    className="checkbox-btn"
                    onClick={handleSelectAllEquipments}
                  >
                    {paginatedEquipments.length > 0 && paginatedEquipments.every(eq => selectedEquipments.includes(eq.id)) ? (
                      <IoCheckboxOutline />
                    ) : (
                      <IoSquareOutline />
                    )}
                  </button>
                </th>
                <th>Nom de l'équipement</th>
                <th>Type</th>
                <th>Etat</th>
                <th>Dernière maintenance</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEquipments.length > 0 ? (
                paginatedEquipments.map((equipment) => (
                  <tr key={equipment.id}>
                    <td className="checkbox-column">
                      <button 
                        className="checkbox-btn"
                        onClick={() => handleSelectEquipment(equipment.id)}
                      >
                        {selectedEquipments.includes(equipment.id) ? (
                          <IoCheckboxOutline />
                        ) : (
                          <IoSquareOutline />
                        )}
                      </button>
                    </td>
                    <td className="equipment-name">{equipment.name}</td>
                    <td className="equipment-type">{equipment.type}</td>
                    <td>
                      <span className={`badge-state ${getStateBadgeClass(equipment.state)}`}>
                        {equipment.state}
                      </span>
                    </td>
                    <td className="equipment-maintenance">{equipment.lastMaintenance}</td>
                    <td>
                      <span className={`badge-status ${equipment.status === 'Activé' ? 'badge-active' : 'badge-inactive'}`}>
                        {equipment.status}
                      </span>
                    </td>
                    <td className="actions-column" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {equipment.fromBackend && (
                        <>
                          <button
                            className="btn-actions"
                            onClick={() => handleAssignEquipment(equipment)}
                            disabled={equipmentActionId === equipment.id}
                          >
                            Assigner
                          </button>
                          <button
                            className="btn-actions"
                            onClick={() => handleDeleteEquipment(equipment)}
                            disabled={equipmentActionId === equipment.id}
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    {searchQuery ? `Aucun équipement trouvé pour "${searchQuery}"` : 'Aucun équipement disponible'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalEquipments > 0 && (
          <div className="equipments-pagination">
            <p className="pagination-info">
              Affichage de <span className="font-medium">{displayStart}-{displayEnd}</span> sur <span className="font-medium">{totalEquipments}</span> équipements
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

      {/* Modal Ajouter un équipement */}
      {showAddEquipmentModal && (
        <div className="modal-overlay" onClick={handleCancelAddEquipment}>
          <div className="modal-content modal-equipment" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Ajouter un Equipement</h2>
              <button className="modal-close-btn" onClick={handleCancelAddEquipment}>
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={handleAddEquipment} className="modal-form modal-form-equipment">
              <div className="form-row-equipment">
                <div className="form-column-left">
                  <div className="form-group">
                    <label htmlFor="equipment-name">Nom</label>
                    <input
                      type="text"
                      id="equipment-name"
                      value={newEquipment.name}
                      onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                      placeholder="Entrez vôtre nom"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="equipment-model">Modele</label>
                    <input
                      type="text"
                      id="equipment-model"
                      value={newEquipment.model}
                      onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                      placeholder="Entrez le modele"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="equipment-value">Valeur</label>
                    <input
                      type="text"
                      id="equipment-value"
                      value={newEquipment.value}
                      onChange={(e) => setNewEquipment({ ...newEquipment, value: e.target.value })}
                      placeholder="Entrez sa Valeur"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="equipment-building">Bâtiment</label>
                    <select
                      id="equipment-building"
                      value={newEquipment.buildingId}
                      onChange={(e) => handleBuildingChange(e.target.value)}
                    >
                      <option value="">Sélectionner un bâtiment</option>
                      {buildings.map(building => (
                        <option key={building.id} value={building.id}>
                          {building.name} ({building.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {newEquipment.buildingId && (
                    <div className="form-group">
                      <label htmlFor="equipment-floor">Étage</label>
                      <select
                        id="equipment-floor"
                        value={newEquipment.floorId}
                        onChange={(e) => handleFloorChange(e.target.value)}
                      >
                        <option value="">Sélectionner un étage</option>
                        {getFloorsForBuilding(parseInt(newEquipment.buildingId)).map(floor => (
                          <option key={floor.id} value={floor.id}>
                            {floor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {newEquipment.floorId && (
                    <div className="form-group">
                      <label htmlFor="equipment-space">Espace *</label>
                      <select
                        id="equipment-space"
                        value={newEquipment.spaceId}
                        onChange={(e) => setNewEquipment({ ...newEquipment, spaceId: e.target.value })}
                        required={newEquipment.floorId !== ''}
                      >
                        <option value="">Sélectionner un espace</option>
                        {getSpacesForFloor(parseInt(newEquipment.buildingId), newEquipment.floorId).map(space => (
                          <option key={space.id} value={space.id}>
                            {space.code} - {space.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="equipment-description">Description</label>
                    <textarea
                      id="equipment-description"
                      value={newEquipment.description}
                      onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                      placeholder=""
                      rows={4}
                    />
                  </div>
                </div>
                <div className="form-column-right">
                  <div className="form-group">
                    <label htmlFor="equipment-type">Type d'equipement</label>
                    <select
                      id="equipment-type"
                      value={newEquipment.type}
                      onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                      required
                    >
                      <option value="">Selectionner le type d'equipement</option>
                      <option value="Réfrigérateur">Réfrigérateur</option>
                      <option value="Climatiseur">Climatiseur</option>
                      <option value="Ordinateur">Ordinateur</option>
                      <option value="Imprimante">Imprimante</option>
                      <option value="Mobilier">Mobilier</option>
                      <option value="Ventilateur">Ventilateur</option>
                      <option value="Projecteur">Projecteur</option>
                      <option value="Machine à Café">Machine à Café</option>
                      <option value="Éclairage">Éclairage</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="equipment-brand">Marque</label>
                    <input
                      type="text"
                      id="equipment-brand"
                      value={newEquipment.brand}
                      onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                      placeholder="Entrez la marque"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="equipment-lifespan">Durée de Vie</label>
                    <input
                      type="text"
                      id="equipment-lifespan"
                      value={newEquipment.lifespan}
                      onChange={(e) => setNewEquipment({ ...newEquipment, lifespan: e.target.value })}
                      placeholder="Entrez sa durée de vie"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelAddEquipment}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Creer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Equipments

