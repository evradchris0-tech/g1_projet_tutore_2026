import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoGridOutline,
  IoBusinessOutline,
  IoConstructOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoWarningOutline,
  IoStatsChartOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoSearchOutline,
  IoAddOutline,
  IoCloseOutline,
  IoArrowBackOutline,
  IoFilterOutline,
  IoSwapVerticalOutline,
  IoEllipsisVerticalOutline,
  IoCheckboxOutline,
  IoSquareOutline,
  IoCloudDownloadOutline,
} from 'react-icons/io5'
import { createEquipment } from '../api/equipment'
import { createOccupant, getOccupants } from '../api/occupant'
import { createAgent, getAgents } from '../api/agent'
import { createIncident } from '../api/incident'
import { createBuilding } from '../api/batiment'
import '../styles/Dashboard.css'
import logo from '../assets/logo 1.png'

function Dashboard() {
  // Récupérer l'état du menu actif depuis localStorage ou utiliser 'dashboard' par défaut
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'dashboard'
  })
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false)
  const [newBuilding, setNewBuilding] = useState({
    name: '',
    code: '',
    type: 'Pédagogique',
    floors: 1,
    spaces: 0,
  })

  // États pour la navigation hiérarchique (Bâtiments)
  const [viewLevel, setViewLevel] = useState('buildings') // 'buildings' | 'floors' | 'spaces'
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)

  // États pour la page Équipements
  const [selectedEquipments, setSelectedEquipments] = useState([])
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    model: '',
    value: '',
    space: '',
    type: '',
    brand: '',
    lifespan: '',
    description: '',
    state: 'bon etat',
    status: 'Activé',
  })

  // États pour la page Occupants
  const [selectedOccupants, setSelectedOccupants] = useState([])
  const [showAddOccupantModal, setShowAddOccupantModal] = useState(false)
  const [apiOccupants, setApiOccupants] = useState([])
  const [loadingOccupants, setLoadingOccupants] = useState(false)
  const [newOccupant, setNewOccupant] = useState({
    roomName: '',
    email: '',
    password: '',
    building: '',
    phone: '',
    occupantType: '',
    status: 'Activé',
  })

  // États pour la page Agents
  const [selectedAgents, setSelectedAgents] = useState([])
  const [showAddAgentModal, setShowAddAgentModal] = useState(false)
  const [apiAgents, setApiAgents] = useState([])
  const [loadingAgents, setLoadingAgents] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: '',
    firstName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    specialty: '',
    status: 'Activé',
  })

  // États pour la page Incidents
  const [selectedIncidents, setSelectedIncidents] = useState([])
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false)
  const [newIncident, setNewIncident] = useState({
    building: '',
    roomNumber: '',
    assignedAgent: '',
    date: '',
    state: 'En cours',
  })

  const handleLogout = () => {
    // Supprimer l'état de connexion du localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('activeMenu')

    // Redirection vers la page de login
    navigate('/login')
  }

  // Fonction pour charger les occupants depuis l'API
  const loadOccupants = async () => {
    setLoadingOccupants(true)
    try {
      const response = await getOccupants()
      console.log('Données occupants reçues:', response)
      // Gérer différentes structures de réponse
      const data = response.data || response || []
      setApiOccupants(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erreur lors du chargement des occupants:', error)
      setApiOccupants([])
    } finally {
      setLoadingOccupants(false)
    }
  }

  // Fonction pour charger les agents depuis l'API
  const loadAgents = async () => {
    setLoadingAgents(true)
    try {
      const response = await getAgents()
      console.log('Données agents reçues:', response)
      const data = response.data || response || []
      setApiAgents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error)
      setApiAgents([])
    } finally {
      setLoadingAgents(false)
    }
  }

  // Charger automatiquement les données quand on accède aux sections
  useEffect(() => {
    if (activeMenu === 'occupant' && apiOccupants.length === 0) {
      loadOccupants()
    }
    if (activeMenu === 'agent' && apiAgents.length === 0) {
      loadAgents()
    }
  }, [activeMenu])

  // Charger les données au montage pour le tableau de bord
  useEffect(() => {
    if (apiOccupants.length === 0) loadOccupants()
    if (apiAgents.length === 0) loadAgents()
  }, [])

  const statsData = [
    {
      title: 'Incidents',
      count: 35,
      description: 'Voici tous les incidents de tous les bâtiments',
      icon: IoWarningOutline,
      bgColor: '#ff4757',
    },
    {
      title: 'Agents',
      count: apiAgents.length,
      description: 'Voici tous les Agents de tous les bâtiments',
      icon: IoPeopleOutline,
      bgColor: '#3b82f6',
    },
    {
      title: 'Occupants',
      count: apiOccupants.length,
      description: 'Voici tous les Occupants de tous les bâtiments',
      icon: IoPersonOutline,
      bgColor: '#10b981',
    },
    {
      title: 'Equipements',
      count: 35,
      description: 'Voici tous les équipements de tous les bâtiments',
      icon: IoConstructOutline,
      bgColor: '#1f2937',
    },
  ]

  const buildingStats = [
    {
      title: 'Bâtiments',
      count: 4,
      description: 'Nombre total de bâtiments sur le site',
      icon: IoBusinessOutline,
      bgColor: '#3b82f6',
    },
    {
      title: 'Étages',
      count: 12,
      description: 'Nombre total d’étages configurés',
      icon: IoGridOutline,
      bgColor: '#10b981',
    },
    {
      title: 'Espaces',
      count: 215,
      description: 'Chambres, salles de classe et bureaux',
      icon: IoConstructOutline,
      bgColor: '#6366f1',
    },
  ]

  const buildings = [
    {
      id: 1,
      name: 'Bâtiment A',
      code: 'BA',
      type: 'Pédagogique',
      floors: 3,
      spaces: 42,
      incidents: 18,
    },
    {
      id: 2,
      name: 'Bâtiment B',
      code: 'BB',
      type: 'Pédagogique',
      floors: 2,
      spaces: 28,
      incidents: 9,
    },
    {
      id: 3,
      name: 'Cité Universitaire',
      code: 'CU',
      type: 'Résidentiel',
      floors: 4,
      spaces: 96,
      incidents: 32,
    },
    {
      id: 4,
      name: 'Bâtiment des Pères',
      code: 'BP',
      type: 'Résidentiel',
      floors: 3,
      spaces: 24,
      incidents: 6,
    },
  ]

  // Données simulées pour les étages (générées dynamiquement)
  const getFloorsForBuilding = (buildingId) => {
    const building = buildings.find((b) => b.id === buildingId)
    if (!building) return []

    const floors = []
    for (let i = 0; i < building.floors; i++) {
      floors.push({
        id: `${buildingId}-floor-${i}`,
        buildingId: buildingId,
        number: i,
        name: i === 0 ? 'Rez-de-chaussée' : `Étage ${i}`,
        spaces: Math.floor(building.spaces / building.floors),
        incidents: Math.floor(Math.random() * 10),
      })
    }
    return floors
  }

  // Données simulées pour les espaces
  const getSpacesForFloor = (buildingId, floorId) => {
    const building = buildings.find((b) => b.id === buildingId)
    if (!building) return []

    const floors = getFloorsForBuilding(buildingId)
    const floor = floors.find((f) => f.id === floorId)
    if (!floor) return []

    const spaces = []
    const spaceTypes =
      building.type === 'Résidentiel'
        ? ['Chambre', 'Salle commune', 'Bureau']
        : ['Salle de classe', 'Laboratoire', 'Bureau', 'Amphithéâtre']

    for (let i = 1; i <= floor.spaces; i++) {
      const type = spaceTypes[Math.floor(Math.random() * spaceTypes.length)]
      spaces.push({
        id: `${floorId}-space-${i}`,
        floorId: floorId,
        code: `${building.code}${floor.number}${String(i).padStart(2, '0')}`,
        name: `${type} ${building.code}${floor.number}${String(i).padStart(2, '0')}`,
        type: type,
        area: Math.floor(Math.random() * 50) + 20,
        occupants: Math.floor(Math.random() * 30),
        equipment: Math.floor(Math.random() * 15),
        incidents: Math.floor(Math.random() * 5),
      })
    }
    return spaces
  }

  const recentIncidents = [
    {
      building: 'Batiment A - Ch A01 - 07/11/2025',
      equipment: 'Frigo',
      description: 'Le moteur ne ronfle plus',
      status: 'A remplacer',
      statusColor: '#ff4757',
    },
    {
      building: 'Batiment A - Ch A01 - 07/11/2025',
      equipment: 'Frigo',
      description: 'Le moteur ne ronfle plus',
      status: 'Bon Etat',
      statusColor: '#10b981',
    },
    {
      building: 'Batiment A - Ch A01 - 07/11/2025',
      equipment: 'Frigo',
      description: 'Le moteur ne ronfle plus',
      status: 'A remplacer',
      statusColor: '#ff9800',
    },
  ]

  // Données simulées pour les équipements
  const equipments = [
    {
      id: 1,
      name: 'Réfrigérateur LG 450L',
      type: 'Réfrigérateur',
      state: 'bon etat',
      lastMaintenance: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 2,
      name: 'Climatiseur Samsung',
      type: 'Climatiseur',
      state: 'à remplacer',
      lastMaintenance: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 3,
      name: 'Ordinateur HP ProDesk',
      type: 'Ordinateur',
      state: 'bon etat',
      lastMaintenance: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 4,
      name: 'Imprimante Canon',
      type: 'Imprimante',
      state: 'à réparer',
      lastMaintenance: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 5,
      name: 'Table de Bureau',
      type: 'Mobilier',
      state: 'en maintenance',
      lastMaintenance: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 6,
      name: 'Ventilateur Plafond',
      type: 'Ventilateur',
      state: 'bon etat',
      lastMaintenance: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 7,
      name: 'Projecteur Epson',
      type: 'Projecteur',
      state: 'hors service',
      lastMaintenance: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 8,
      name: 'Machine à Café',
      type: 'Machine à Café',
      state: 'en attente de piece',
      lastMaintenance: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 9,
      name: 'Lampe LED Bureau',
      type: 'Éclairage',
      state: 'bon etat',
      lastMaintenance: '6 98 76 54 32',
      status: 'Activé',
    },
  ]

  // Données simulées pour les occupants
  const occupants = [
    {
      id: 1,
      roomNumber: 'A01',
      building: 'Bâtiment A',
      role: 'Agent',
      phone: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 2,
      roomNumber: 'B12',
      building: 'Bâtiment B',
      role: 'Client',
      phone: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 3,
      roomNumber: 'CU05',
      building: 'Cité Universitaire',
      role: 'Client',
      phone: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 4,
      roomNumber: 'A03',
      building: 'Bâtiment A',
      role: 'Agent',
      phone: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 5,
      roomNumber: 'BP08',
      building: 'Bâtiment des Pères',
      role: 'Client',
      phone: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 6,
      roomNumber: 'B15',
      building: 'Bâtiment B',
      role: 'Client',
      phone: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 7,
      roomNumber: 'CU20',
      building: 'Cité Universitaire',
      role: 'Agent',
      phone: '6 98 76 54 32',
      status: 'Activé',
    },
    {
      id: 8,
      roomNumber: 'A07',
      building: 'Bâtiment A',
      role: 'Client',
      phone: '6 98 76 54 32',
      status: 'Désactivé',
    },
    {
      id: 9,
      roomNumber: 'BP12',
      building: 'Bâtiment des Pères',
      role: 'Agent',
      phone: '6 98 76 54 32',
      status: 'Activé',
    },
  ]

  // Données simulées pour les agents (commentées - utilisation de l'API)
  // const agents = [
  //   { id: 1, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Activé' },
  //   { id: 2, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Désactivé' },
  //   { id: 3, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Activé' },
  //   { id: 4, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Activé' },
  //   { id: 5, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Désactivé' },
  //   { id: 6, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Activé' },
  //   { id: 7, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Activé' },
  //   { id: 8, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Désactivé' },
  //   { id: 9, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Activé' },
  //   { id: 10, name: 'Jon Snow', email: 'jonsnow@example.com', specialty: 'Electricien', phone: '6 98 76 54 32', status: 'Désactivé' }
  // ]

  // Données simulées pour les incidents
  const incidents = [
    {
      id: 1,
      building: 'Batiment A',
      roomNumber: 'A01',
      assignedAgent: 'Jon Snow',
      date: '25-09-2025',
      state: 'En cours',
    },
    {
      id: 2,
      building: 'Batiment B',
      roomNumber: 'B11',
      assignedAgent: 'Jack Bauer',
      date: '25-09-2025',
      state: 'A Reparer',
    },
    {
      id: 3,
      building: 'Batiment A',
      roomNumber: 'A04',
      assignedAgent: 'Luis Suarez',
      date: '25-09-2025',
      state: 'Bon Etat',
    },
    {
      id: 4,
      building: 'Batiment A',
      roomNumber: 'A14',
      assignedAgent: 'Pablo Escobar',
      date: '25-09-2025',
      state: 'En cours',
    },
    {
      id: 5,
      building: 'Batiment A',
      roomNumber: 'A08',
      assignedAgent: 'Jane Smith',
      date: '25-09-2025',
      state: 'En cours',
    },
    {
      id: 6,
      building: 'Batiment D',
      roomNumber: 'D04',
      assignedAgent: 'Will Smith',
      date: '25-09-2025',
      state: 'Bon Etat',
    },
    {
      id: 7,
      building: 'Batiment C',
      roomNumber: 'C04',
      assignedAgent: 'Lebron James',
      date: '25-09-2025',
      state: 'A Reparer',
    },
    {
      id: 8,
      building: 'Batiment B',
      roomNumber: 'B02',
      assignedAgent: 'Steph Curry',
      date: '25-09-2025',
      state: 'A Reparer',
    },
    {
      id: 9,
      building: 'Batiment D',
      roomNumber: 'D10',
      assignedAgent: 'Lionel Messi',
      date: '25-09-2025',
      state: 'En cours',
    },
  ]

  const pageTitle =
    activeMenu === 'batiment'
      ? 'Bâtiment'
      : activeMenu === 'equipement'
        ? 'Equipement'
        : activeMenu === 'occupant'
          ? 'Occupant'
          : activeMenu === 'agent'
            ? 'Agent'
            : activeMenu === 'incident'
              ? 'Incident'
              : 'Tableau de Bord'

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
  }

  const handleBackClick = () => {
    if (viewLevel === 'spaces') {
      setViewLevel('floors')
      setSelectedFloor(null)
      setSearchQuery('')
    } else if (viewLevel === 'floors') {
      setViewLevel('buildings')
      setSelectedBuilding(null)
      setSearchQuery('')
    }
  }

  // Filtrer les bâtiments selon la recherche
  const filteredBuildings = buildings.filter((building) => {
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
      return floors.filter(
        (floor) =>
          floor.name.toLowerCase().includes(query) || floor.number.toString().includes(query)
      )
    } else if (viewLevel === 'spaces' && selectedBuilding && selectedFloor) {
      const spaces = getSpacesForFloor(selectedBuilding.id, selectedFloor.id)
      const query = searchQuery.toLowerCase()
      return spaces.filter(
        (space) =>
          space.name.toLowerCase().includes(query) ||
          space.code.toLowerCase().includes(query) ||
          space.type.toLowerCase().includes(query)
      )
    }
    return []
  }

  const currentData = getCurrentData()

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

  // Fonction pour gérer l'ajout d'un bâtiment
  const handleAddBuilding = (e) => {
    e.preventDefault()

    // Simuler l'ajout du bâtiment (remplacer par l'appel API quand disponible)
    console.log('Bâtiment créé:', newBuilding)

    // Réinitialiser le formulaire et fermer le modal
    setNewBuilding({
      name: '',
      code: '',
      type: 'Pédagogique',
      floors: 1,
      spaces: 0,
    })
    setShowAddBuildingModal(false)
  }

  // Fonction pour réinitialiser le formulaire (Bâtiments)
  const handleCancelAdd = () => {
    setNewBuilding({
      name: '',
      code: '',
      type: 'Pédagogique',
      floors: 1,
      spaces: 0,
    })
    setShowAddBuildingModal(false)
  }

  // Gestion des équipements
  const handleSelectEquipment = (equipmentId) => {
    setSelectedEquipments((prev) => {
      if (prev.includes(equipmentId)) {
        return prev.filter((id) => id !== equipmentId)
      } else {
        return [...prev, equipmentId]
      }
    })
  }

  const handleSelectAllEquipments = () => {
    if (selectedEquipments.length === filteredEquipments.length) {
      setSelectedEquipments([])
    } else {
      setSelectedEquipments(filteredEquipments.map((eq) => eq.id))
    }
  }

  const handleAddEquipment = async (e) => {
    e.preventDefault()

    try {
      const equipmentData = {
        ...newEquipment,
        value: parseFloat(newEquipment.value),
        lifespan: parseInt(newEquipment.lifespan),
      }

      await createEquipment(equipmentData)

      // Réinitialiser le formulaire et fermer le modal
      setNewEquipment({
        name: '',
        model: '',
        value: '',
        space: '',
        type: '',
        brand: '',
        lifespan: '',
        description: '',
        state: 'bon etat',
        status: 'Activé',
      })
      setShowAddEquipmentModal(false)
    } catch (error) {
      console.error("Erreur lors de la création de l'équipement:", error)
    }
  }

  const handleCancelAddEquipment = () => {
    setNewEquipment({
      name: '',
      model: '',
      value: '',
      space: '',
      type: '',
      brand: '',
      lifespan: '',
      description: '',
      state: 'bon etat',
      status: 'Activé',
    })
    setShowAddEquipmentModal(false)
  }

  // Filtrer les équipements selon la recherche
  const filteredEquipments = equipments.filter((equipment) => {
    const query = searchQuery.toLowerCase()
    return (
      equipment.name.toLowerCase().includes(query) ||
      equipment.type.toLowerCase().includes(query) ||
      equipment.state.toLowerCase().includes(query) ||
      equipment.status.toLowerCase().includes(query)
    )
  })

  // Fonction pour obtenir la classe CSS du badge selon l'état
  const getStateBadgeClass = (state) => {
    const stateMap = {
      'bon etat': 'badge-bon-etat',
      'à remplacer': 'badge-a-remplacer',
      'à réparer': 'badge-a-reparer',
      'en maintenance': 'badge-en-maintenance',
      'hors service': 'badge-hors-service',
      'en attente de piece': 'badge-en-attente-de-piece',
    }
    return stateMap[state] || 'badge-bon-etat'
  }

  // Gestion des occupants
  const handleSelectOccupant = (occupantId) => {
    setSelectedOccupants((prev) => {
      if (prev.includes(occupantId)) {
        return prev.filter((id) => id !== occupantId)
      } else {
        return [...prev, occupantId]
      }
    })
  }

  const handleSelectAllOccupants = () => {
    if (selectedOccupants.length === filteredOccupants.length) {
      setSelectedOccupants([])
    } else {
      setSelectedOccupants(filteredOccupants.map((occ) => occ.id))
    }
  }

  const handleAddOccupant = (e) => {
    e.preventDefault()

    // Simuler la création (désactivé temporairement à cause de l'erreur 500)
    console.log('Occupant créé:', newOccupant)

    // Réinitialiser le formulaire et fermer le modal
    setNewOccupant({
      roomName: '',
      email: '',
      password: '',
      building: '',
      phone: '',
      occupantType: '',
      status: 'Activé',
    })
    setShowAddOccupantModal(false)
  }

  const handleCancelAddOccupant = () => {
    setNewOccupant({
      roomName: '',
      email: '',
      password: '',
      building: '',
      phone: '',
      occupantType: '',
      status: 'Activé',
    })
    setShowAddOccupantModal(false)
  }

  // Debug: afficher l'état des données
  console.log('apiOccupants dans le rendu:', apiOccupants)
  console.log('loadingOccupants:', loadingOccupants)

  // Filtrer les occupants selon la recherche (uniquement les données API)
  const filteredOccupants = Array.isArray(apiOccupants)
    ? apiOccupants.filter((occupant) => {
        if (!occupant) return false
        const query = searchQuery.toLowerCase()
        return (
          (occupant.roomNumber || occupant.roomName || '').toLowerCase().includes(query) ||
          (occupant.building || '').toLowerCase().includes(query) ||
          (occupant.role || occupant.occupantType || '').toLowerCase().includes(query) ||
          (occupant.phone || '').toLowerCase().includes(query) ||
          (occupant.status || '').toLowerCase().includes(query)
        )
      })
    : []

  console.log('filteredOccupants:', filteredOccupants)
  console.log('filteredOccupants.length:', filteredOccupants.length)

  // Gestion des agents
  const handleSelectAgent = (agentId) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId)
      } else {
        return [...prev, agentId]
      }
    })
  }

  const handleSelectAllAgents = () => {
    if (selectedAgents.length === filteredAgents.length) {
      setSelectedAgents([])
    } else {
      setSelectedAgents(filteredAgents.map((ag) => ag.id))
    }
  }

  const handleAddAgent = (e) => {
    e.preventDefault()

    // Simuler la création (désactivé temporairement à cause de l'erreur 500)
    console.log('Agent créé:', newAgent)

    // Réinitialiser le formulaire et fermer le modal
    setNewAgent({
      name: '',
      firstName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      specialty: '',
      status: 'Activé',
    })
    setShowAddAgentModal(false)
  }

  const handleCancelAddAgent = () => {
    setNewAgent({
      name: '',
      firstName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      specialty: '',
      status: 'Activé',
    })
    setShowAddAgentModal(false)
  }

  // Filtrer les agents selon la recherche (uniquement les données API)
  const filteredAgents = Array.isArray(apiAgents)
    ? apiAgents.filter((agent) => {
        if (!agent) return false
        const query = searchQuery.toLowerCase()
        return (
          (agent.name || '').toLowerCase().includes(query) ||
          (agent.email || '').toLowerCase().includes(query) ||
          (agent.specialty || '').toLowerCase().includes(query) ||
          (agent.phone || '').toLowerCase().includes(query) ||
          (agent.status || '').toLowerCase().includes(query)
        )
      })
    : []

  // Gestion des incidents
  const handleSelectIncident = (incidentId) => {
    setSelectedIncidents((prev) => {
      if (prev.includes(incidentId)) {
        return prev.filter((id) => id !== incidentId)
      } else {
        return [...prev, incidentId]
      }
    })
  }

  const handleSelectAllIncidents = () => {
    if (selectedIncidents.length === filteredIncidents.length) {
      setSelectedIncidents([])
    } else {
      setSelectedIncidents(filteredIncidents.map((inc) => inc.id))
    }
  }

  const handleAddIncident = async (e) => {
    e.preventDefault()

    try {
      await createIncident(newIncident)

      // Réinitialiser le formulaire et fermer le modal
      setNewIncident({
        building: '',
        roomNumber: '',
        assignedAgent: '',
        date: '',
        state: 'En cours',
      })
      setShowAddIncidentModal(false)
    } catch (error) {
      console.error("Erreur lors de la création de l'incident:", error)
    }
  }

  const handleCancelAddIncident = () => {
    setNewIncident({
      building: '',
      roomNumber: '',
      assignedAgent: '',
      date: '',
      state: 'En cours',
    })
    setShowAddIncidentModal(false)
  }

  // Filtrer les incidents selon la recherche
  const filteredIncidents = incidents.filter((incident) => {
    const query = searchQuery.toLowerCase()
    return (
      incident.building.toLowerCase().includes(query) ||
      incident.roomNumber.toLowerCase().includes(query) ||
      incident.assignedAgent.toLowerCase().includes(query) ||
      incident.date.toLowerCase().includes(query) ||
      incident.state.toLowerCase().includes(query)
    )
  })

  // Fonction pour obtenir la classe CSS du badge selon l'état de l'incident
  const getIncidentStateBadgeClass = (state) => {
    const stateMap = {
      'En cours': 'badge-en-cours',
      'A Reparer': 'badge-a-reparer',
      'Bon Etat': 'badge-bon-etat',
    }
    return stateMap[state] || 'badge-en-cours'
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="IMMO360" className="sidebar-logo" />
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('dashboard')
              localStorage.setItem('activeMenu', 'dashboard')
            }}
          >
            <IoGridOutline className="menu-icon" />
            <span className="menu-text">Tableau de Bord</span>
          </button>

          <button
            className={`menu-item ${activeMenu === 'batiment' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('batiment')
              localStorage.setItem('activeMenu', 'batiment')
              setViewLevel('buildings')
              setSelectedBuilding(null)
              setSelectedFloor(null)
              setSearchQuery('')
            }}
          >
            <IoBusinessOutline className="menu-icon" />
            <span className="menu-text">Batiment</span>
          </button>

          <button
            className={`menu-item ${activeMenu === 'equipement' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('equipement')
              localStorage.setItem('activeMenu', 'equipement')
              setSearchQuery('')
            }}
          >
            <IoConstructOutline className="menu-icon" />
            <span className="menu-text">Equipement</span>
          </button>

          <button
            className={`menu-item ${activeMenu === 'occupant' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('occupant')
              localStorage.setItem('activeMenu', 'occupant')
              setSearchQuery('')
            }}
          >
            <IoPersonOutline className="menu-icon" />
            <span className="menu-text">Occupant</span>
          </button>

          <button
            className={`menu-item ${activeMenu === 'agent' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('agent')
              localStorage.setItem('activeMenu', 'agent')
              setSearchQuery('')
            }}
          >
            <IoPeopleOutline className="menu-icon" />
            <span className="menu-text">Agent</span>
          </button>

          <button
            className={`menu-item ${activeMenu === 'incident' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('incident')
              localStorage.setItem('activeMenu', 'incident')
              setSearchQuery('')
            }}
          >
            <IoWarningOutline className="menu-icon" />
            <span className="menu-text">Incident</span>
          </button>

          <button
            className={`menu-item ${activeMenu === 'analyse' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu('analyse')
              localStorage.setItem('activeMenu', 'analyse')
            }}
          >
            <IoStatsChartOutline className="menu-icon" />
            <span className="menu-text">Analyse</span>
          </button>
        </nav>

        <button className="menu-item logout-btn" onClick={handleLogout}>
          <IoLogOutOutline className="menu-icon" />
          <span className="menu-text">Deconnexion</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">{pageTitle}</h1>
          <div className="header-actions">
            <span className="user-name">{localStorage.getItem('username') || 'Utilisateur'}</span>
            <button className="header-icon-btn">
              <IoPersonOutline />
            </button>
            <button className="header-icon-btn">
              <IoNotificationsOutline />
            </button>
            <button className="header-icon-btn">
              <IoSettingsOutline />
            </button>
          </div>
        </header>

        {/* Contenu Tableau de Bord */}
        {activeMenu === 'dashboard' && (
          <>
            <div className="stats-grid">
              {statsData.map((stat, index) => {
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

            <div className="charts-row">
              {/* Bar Chart */}
              <div className="chart-card">
                <h3 className="chart-title">Incidents par Batiment</h3>
                <div className="bar-chart">
                  <div className="chart-y-axis">
                    <span>60</span>
                    <span>50</span>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                  </div>
                  <div className="chart-bars">
                    <div className="chart-grid-lines">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{ height: '83%' }}></div>
                      <span className="bar-label">Batiment A</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{ height: '50%' }}></div>
                      <span className="bar-label">Batiment B</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{ height: '17%' }}></div>
                      <span className="bar-label">Batiment C</span>
                    </div>
                    <div className="bar-group">
                      <div className="bar" style={{ height: '0%' }}></div>
                      <span className="bar-label">Batiment B</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Chart with Dots */}
              <div className="chart-card">
                <h3 className="chart-title">Incidents par Mois</h3>
                <div className="line-chart">
                  <div className="chart-y-axis">
                    <span>300</span>
                    <span>250</span>
                    <span>200</span>
                    <span>150</span>
                    <span>100</span>
                    <span>50</span>
                  </div>
                  <div className="chart-dots-container">
                    <div className="chart-grid-lines">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>
                    <svg className="dots-svg" viewBox="0 0 600 200">
                      <circle cx="50" cy="150" r="4" fill="#2563eb" />
                      <circle cx="100" cy="180" r="4" fill="#2563eb" />
                      <circle cx="150" cy="120" r="4" fill="#2563eb" />
                      <circle cx="200" cy="140" r="4" fill="#2563eb" />
                      <circle cx="250" cy="100" r="4" fill="#2563eb" />
                      <circle cx="300" cy="20" r="4" fill="#2563eb" />
                      <circle cx="350" cy="100" r="4" fill="#2563eb" />
                      <circle cx="400" cy="90" r="4" fill="#2563eb" />
                      <circle cx="450" cy="120" r="4" fill="#2563eb" />
                      <circle cx="500" cy="110" r="4" fill="#2563eb" />
                      <circle cx="550" cy="140" r="4" fill="#2563eb" />
                    </svg>
                    <div className="chart-x-labels">
                      <span>Aou</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Avr</span>
                      <span>Mai</span>
                      <span>Juin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom-row">
              {/* Wave Chart */}
              <div className="chart-card wave-chart-card">
                <h3 className="chart-title">Incidents par Batiment</h3>
                <div className="wave-chart">
                  <div className="chart-y-axis">
                    <span>60</span>
                    <span>50</span>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                  </div>
                  <div className="wave-container">
                    <div className="chart-grid-lines">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>
                    <svg className="wave-svg" viewBox="0 0 800 200" preserveAspectRatio="none">
                      <path
                        d="M 0 100 Q 100 50, 200 90 T 400 80 T 600 60 T 800 40"
                        stroke="#ff9800"
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recent Incidents */}
              <div className="incidents-card">
                <h3 className="chart-title">Incident Recentes</h3>
                <div className="incidents-list">
                  {recentIncidents.map((incident, index) => (
                    <div key={index} className="incident-item">
                      <div className="incident-info">
                        <div className="incident-building">{incident.building}</div>
                        <div className="incident-equipment">{incident.equipment}</div>
                        <div className="incident-description">{incident.description}</div>
                      </div>
                      <div className="incident-status" style={{ color: incident.statusColor }}>
                        {incident.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contenu Bâtiment */}
        {activeMenu === 'batiment' && (
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
                      <p className="buildings-subtitle">{getSectionSubtitle()}</p>
                    </div>
                    {viewLevel === 'buildings' && (
                      <button
                        className="btn-add-building"
                        onClick={() => setShowAddBuildingModal(true)}
                      >
                        <IoAddOutline />
                        <span>Ajouter un bâtiment</span>
                      </button>
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
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      <>
                        {viewLevel === 'buildings' &&
                          currentData.map((building) => (
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
                                    building.incidents > 20
                                      ? 'badge-danger'
                                      : building.incidents > 10
                                        ? 'badge-warning'
                                        : 'badge-success'
                                  }`}
                                >
                                  {building.incidents}
                                </span>
                              </td>
                            </tr>
                          ))}
                        {viewLevel === 'floors' &&
                          currentData.map((floor) => (
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
                        {viewLevel === 'spaces' &&
                          currentData.map((space) => (
                            <tr key={space.id}>
                              <td>{space.code}</td>
                              <td>{space.name}</td>
                              <td>{space.type}</td>
                              <td>{space.area}</td>
                              <td>{space.occupants}</td>
                              <td>{space.equipment}</td>
                              <td>
                                <span
                                  className={`badge-incidents ${
                                    space.incidents > 2
                                      ? 'badge-danger'
                                      : space.incidents > 0
                                        ? 'badge-warning'
                                        : 'badge-success'
                                  }`}
                                >
                                  {space.incidents}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan={viewLevel === 'buildings' ? 6 : viewLevel === 'floors' ? 4 : 7}
                          className="no-results"
                        >
                          {searchQuery
                            ? `Aucun résultat trouvé pour "${searchQuery}"`
                            : 'Aucune donnée disponible'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="buildings-map-card">
                <h3 className="buildings-title">Carte des bâtiments</h3>
                <p className="buildings-subtitle">
                  La cartographie interactive des bâtiments sera affichée ici.
                </p>
                <div className="buildings-map-placeholder">
                  <span className="map-placeholder-label">
                    Carte interactive bientôt disponible
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu Équipement */}
        {activeMenu === 'equipement' && (
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
                  onClick={() => setShowAddEquipmentModal(true)}
                >
                  <IoAddOutline />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="equipments-table-container">
              <table className="equipments-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <button className="checkbox-btn" onClick={handleSelectAllEquipments}>
                        {selectedEquipments.length === filteredEquipments.length &&
                        filteredEquipments.length > 0 ? (
                          <IoCheckboxOutline />
                        ) : (
                          <IoSquareOutline />
                        )}
                      </button>
                    </th>
                    <th>Nom de l&apos;équipement</th>
                    <th>Type</th>
                    <th>Etat</th>
                    <th>Numero de telephone</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipments.length > 0 ? (
                    filteredEquipments.map((equipment) => (
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
                          <span
                            className={`badge-status ${equipment.status === 'Activé' ? 'badge-active' : 'badge-inactive'}`}
                          >
                            {equipment.status}
                          </span>
                        </td>
                        <td className="actions-column">
                          <button className="btn-actions">
                            <IoEllipsisVerticalOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        {searchQuery
                          ? `Aucun équipement trouvé pour "${searchQuery}"`
                          : 'Aucun équipement disponible'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenu Occupant */}
        {activeMenu === 'occupant' && (
          <div className="occupants-page">
            <div className="occupants-header-bar">
              <h2 className="occupants-page-title">Table des Occupants</h2>
              <div className="search-container search-occupants">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Faites votre recherche ici"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="occupants-actions-right">
                <button className="btn-filter">
                  <IoFilterOutline />
                </button>
                <button className="btn-sort">
                  <IoSwapVerticalOutline />
                </button>
                <button className="btn-import-csv">
                  <IoCloudDownloadOutline />
                  <span>Import csv</span>
                </button>
                <button className="btn-add-occupant" onClick={() => setShowAddOccupantModal(true)}>
                  <IoAddOutline />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="occupants-table-container">
              <table className="occupants-table" key={`occupants-${apiOccupants.length}`}>
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <button className="checkbox-btn" onClick={handleSelectAllOccupants}>
                        {selectedOccupants.length === filteredOccupants.length &&
                        filteredOccupants.length > 0 ? (
                          <IoCheckboxOutline />
                        ) : (
                          <IoSquareOutline />
                        )}
                      </button>
                    </th>
                    <th>N° de Chambre</th>
                    <th>Batiment</th>
                    <th>Role</th>
                    <th>N° de Telephone</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOccupants ? (
                    <tr>
                      <td colSpan="7" className="no-results">
                        Chargement des occupants... (API: {apiOccupants.length} items)
                      </td>
                    </tr>
                  ) : filteredOccupants && filteredOccupants.length > 0 ? (
                    filteredOccupants.map((occupant, index) => (
                      <tr key={occupant.id || occupant._id || index}>
                        <td className="checkbox-column">
                          <button
                            className="checkbox-btn"
                            onClick={() =>
                              handleSelectOccupant(occupant.id || occupant._id || index)
                            }
                          >
                            {selectedOccupants.includes(occupant.id || occupant._id || index) ? (
                              <IoCheckboxOutline />
                            ) : (
                              <IoSquareOutline />
                            )}
                          </button>
                        </td>
                        <td className="occupant-room">
                          {occupant.roomNumber || occupant.roomName || 'N/A'}
                        </td>
                        <td className="occupant-building">{occupant.building || 'N/A'}</td>
                        <td className="occupant-role">
                          {occupant.role || occupant.occupantType || 'N/A'}
                        </td>
                        <td className="occupant-phone">{occupant.phone || 'N/A'}</td>
                        <td>
                          <span
                            className={`badge-status ${occupant.status === 'Activé' ? 'badge-active' : 'badge-inactive'}`}
                          >
                            {occupant.status || 'N/A'}
                          </span>
                        </td>
                        <td className="actions-column">
                          <button className="btn-actions">
                            <IoEllipsisVerticalOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        {loadingOccupants
                          ? 'Chargement...'
                          : searchQuery
                            ? `Aucun occupant trouvé pour "${searchQuery}"`
                            : `Aucune donnée (API: ${apiOccupants.length}, Filtré: ${filteredOccupants.length})`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenu Agent */}
        {activeMenu === 'agent' && (
          <div className="agents-page">
            <div className="agents-header-bar">
              <h2 className="agents-page-title">Table des Agents</h2>
              <div className="search-container search-agents">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Faites votre recherche ici"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="agents-actions-right">
                <button className="btn-filter">
                  <IoFilterOutline />
                </button>
                <button className="btn-sort">
                  <IoSwapVerticalOutline />
                </button>
                <button className="btn-import-csv">
                  <IoCloudDownloadOutline />
                  <span>Import csv</span>
                </button>
                <button className="btn-add-agent" onClick={() => setShowAddAgentModal(true)}>
                  <IoAddOutline />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="agents-table-container">
              <table className="agents-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <button className="checkbox-btn" onClick={handleSelectAllAgents}>
                        {selectedAgents.length === filteredAgents.length &&
                        filteredAgents.length > 0 ? (
                          <IoCheckboxOutline />
                        ) : (
                          <IoSquareOutline />
                        )}
                      </button>
                    </th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Specialité</th>
                    <th>N° de Telephone</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td className="checkbox-column">
                          <button
                            className="checkbox-btn"
                            onClick={() => handleSelectAgent(agent.id)}
                          >
                            {selectedAgents.includes(agent.id) ? (
                              <IoCheckboxOutline />
                            ) : (
                              <IoSquareOutline />
                            )}
                          </button>
                        </td>
                        <td className="agent-name">{agent.name}</td>
                        <td className="agent-email">{agent.email}</td>
                        <td className="agent-specialty">{agent.specialty}</td>
                        <td className="agent-phone">{agent.phone}</td>
                        <td>
                          <span
                            className={`badge-status ${agent.status === 'Activé' ? 'badge-active' : 'badge-inactive'}`}
                          >
                            {agent.status}
                          </span>
                        </td>
                        <td className="actions-column">
                          <button className="btn-actions">
                            <IoEllipsisVerticalOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        {searchQuery
                          ? `Aucun agent trouvé pour "${searchQuery}"`
                          : 'Aucun agent disponible'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenu Incident */}
        {activeMenu === 'incident' && (
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
                <button className="btn-add-incident" onClick={() => setShowAddIncidentModal(true)}>
                  <IoAddOutline />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            <div className="incidents-table-container">
              <table className="incidents-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <button className="checkbox-btn" onClick={handleSelectAllIncidents}>
                        {selectedIncidents.length === filteredIncidents.length &&
                        filteredIncidents.length > 0 ? (
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.length > 0 ? (
                    filteredIncidents.map((incident) => (
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
                          <span
                            className={`badge-state ${getIncidentStateBadgeClass(incident.state)}`}
                          >
                            {incident.state}
                          </span>
                        </td>
                        <td className="actions-column">
                          <button className="btn-actions">
                            <IoEllipsisVerticalOutline />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        {searchQuery
                          ? `Aucun incident trouvé pour "${searchQuery}"`
                          : 'Aucun incident disponible'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Ajouter un bâtiment */}
        {showAddBuildingModal && (
          <div className="modal-overlay" onClick={handleCancelAdd}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Ajouter un nouveau bâtiment</h2>
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
                    onChange={(e) =>
                      setNewBuilding({ ...newBuilding, code: e.target.value.toUpperCase() })
                    }
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
                      onChange={(e) =>
                        setNewBuilding({ ...newBuilding, floors: parseInt(e.target.value) || 1 })
                      }
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
                      onChange={(e) =>
                        setNewBuilding({ ...newBuilding, spaces: parseInt(e.target.value) || 0 })
                      }
                      min="0"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancelAdd}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-submit">
                    Ajouter le bâtiment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                        onChange={(e) =>
                          setNewEquipment({ ...newEquipment, model: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewEquipment({ ...newEquipment, value: e.target.value })
                        }
                        placeholder="Entrez sa Valeur"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="equipment-space">Espace</label>
                      <input
                        type="text"
                        id="equipment-space"
                        value={newEquipment.space}
                        onChange={(e) =>
                          setNewEquipment({ ...newEquipment, space: e.target.value })
                        }
                        placeholder="Entrez son espace"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="equipment-description">Description</label>
                      <textarea
                        id="equipment-description"
                        value={newEquipment.description}
                        onChange={(e) =>
                          setNewEquipment({ ...newEquipment, description: e.target.value })
                        }
                        placeholder=""
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="form-column-right">
                    <div className="form-group">
                      <label htmlFor="equipment-type">Type d&apos;equipement</label>
                      <select
                        id="equipment-type"
                        value={newEquipment.type}
                        onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                        required
                      >
                        <option value="">Selectionner le type d&apos;equipement</option>
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
                        onChange={(e) =>
                          setNewEquipment({ ...newEquipment, brand: e.target.value })
                        }
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
                        onChange={(e) =>
                          setNewEquipment({ ...newEquipment, lifespan: e.target.value })
                        }
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

        {/* Modal Créer un Occupant */}
        {showAddOccupantModal && (
          <div className="modal-overlay" onClick={handleCancelAddOccupant}>
            <div className="modal-content modal-occupant" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Creer Un(e) Occupant(e)</h2>
                <button className="modal-close-btn" onClick={handleCancelAddOccupant}>
                  <IoCloseOutline />
                </button>
              </div>
              <form onSubmit={handleAddOccupant} className="modal-form modal-form-occupant">
                <div className="form-row-equipment">
                  <div className="form-column-left">
                    <div className="form-group">
                      <label htmlFor="occupant-room-name">Nom de Chambre</label>
                      <input
                        type="text"
                        id="occupant-room-name"
                        value={newOccupant.roomName}
                        onChange={(e) =>
                          setNewOccupant({ ...newOccupant, roomName: e.target.value })
                        }
                        placeholder="Entrez le nom de la chambre"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="occupant-email">Email</label>
                      <input
                        type="email"
                        id="occupant-email"
                        value={newOccupant.email}
                        onChange={(e) => setNewOccupant({ ...newOccupant, email: e.target.value })}
                        placeholder="Entrez vôtre Email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="occupant-password">Mot de Passe</label>
                      <input
                        type="password"
                        id="occupant-password"
                        value={newOccupant.password}
                        onChange={(e) =>
                          setNewOccupant({ ...newOccupant, password: e.target.value })
                        }
                        placeholder="Entrez le mot de passe"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-column-right">
                    <div className="form-group">
                      <label htmlFor="occupant-building">Batiment</label>
                      <select
                        id="occupant-building"
                        value={newOccupant.building}
                        onChange={(e) =>
                          setNewOccupant({ ...newOccupant, building: e.target.value })
                        }
                        required
                      >
                        <option value="">Selectionner le Batiment</option>
                        {buildings.map((building) => (
                          <option key={building.id} value={building.name}>
                            {building.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="occupant-phone">Telephone</label>
                      <input
                        type="text"
                        id="occupant-phone"
                        value={newOccupant.phone}
                        onChange={(e) => setNewOccupant({ ...newOccupant, phone: e.target.value })}
                        placeholder="Entrez vôtre numero de téléphone"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="occupant-type">Type d&apos;Occupant</label>
                      <select
                        id="occupant-type"
                        value={newOccupant.occupantType}
                        onChange={(e) =>
                          setNewOccupant({ ...newOccupant, occupantType: e.target.value })
                        }
                        required
                      >
                        <option value="">Selectionner le type d&apos;occupant</option>
                        <option value="Agent">Agent</option>
                        <option value="Client">Client</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-submit">
                    Creer
                  </button>
                  <button type="button" className="btn-cancel" onClick={handleCancelAddOccupant}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Créer un Agent */}
        {showAddAgentModal && (
          <div className="modal-overlay" onClick={handleCancelAddAgent}>
            <div className="modal-content modal-agent" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Creer Un(e) Agent(e)</h2>
                <button className="modal-close-btn" onClick={handleCancelAddAgent}>
                  <IoCloseOutline />
                </button>
              </div>
              <form onSubmit={handleAddAgent} className="modal-form modal-form-agent">
                <div className="form-row-equipment">
                  <div className="form-column-left">
                    <div className="form-group">
                      <label htmlFor="agent-name">Nom</label>
                      <input
                        type="text"
                        id="agent-name"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                        placeholder="Entrez vôtre nom"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="agent-email">Email</label>
                      <input
                        type="email"
                        id="agent-email"
                        value={newAgent.email}
                        onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                        placeholder="Entrez vôtre Email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="agent-username">Pseudo</label>
                      <input
                        type="text"
                        id="agent-username"
                        value={newAgent.username}
                        onChange={(e) => setNewAgent({ ...newAgent, username: e.target.value })}
                        placeholder="Entrez son Pseudo"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="agent-password">Mot de Passe</label>
                      <input
                        type="password"
                        id="agent-password"
                        value={newAgent.password}
                        onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                        placeholder="Entrez son mot de passe"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-column-right">
                    <div className="form-group">
                      <label htmlFor="agent-firstname">Prenom</label>
                      <input
                        type="text"
                        id="agent-firstname"
                        value={newAgent.firstName}
                        onChange={(e) => setNewAgent({ ...newAgent, firstName: e.target.value })}
                        placeholder="Entrez vôtre Prenom"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="agent-phone">Telephone</label>
                      <input
                        type="text"
                        id="agent-phone"
                        value={newAgent.phone}
                        onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                        placeholder="Entrez vôtre numero de téléphone"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="agent-specialty">Specialité</label>
                      <select
                        id="agent-specialty"
                        value={newAgent.specialty}
                        onChange={(e) => setNewAgent({ ...newAgent, specialty: e.target.value })}
                        required
                      >
                        <option value="">Selectionner la spécialité</option>
                        <option value="Electricien">Electricien</option>
                        <option value="Plombier">Plombier</option>
                        <option value="Menuisier">Menuisier</option>
                        <option value="Peintre">Peintre</option>
                        <option value="Technicien">Technicien</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-submit">
                    Creer
                  </button>
                  <button type="button" className="btn-cancel" onClick={handleCancelAddAgent}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
