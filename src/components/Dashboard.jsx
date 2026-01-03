import { useEffect, useRef, useState } from 'react'
import {
  IoBusinessOutline,
  IoConstructOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoWarningOutline,
  IoGridOutline,
  IoNotificationsOutline,
  IoSearchOutline,
  IoAddOutline,
  IoCheckboxOutline,
  IoCalendarOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoStatsChartOutline,
  IoLogOutOutline,
  IoOptionsOutline,
  IoCloseOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLanguageOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoVolumeHighOutline,
  IoCheckmarkOutline,
  IoRefreshOutline
} from 'react-icons/io5'
import '../styles/Dashboard.css'
import Sidebar from './Sidebar'
import Agents from './Agents'
import Occupants from './Occupants'
import Buildings from './Buildings'
import Equipments from './Equipments'
import Incidents from './Incidents'
import Spinner from './Spinner'
import NotificationsPanel from './NotificationsPanel'
import { useNotifications } from '../contexts/NotificationsContext'
import { listUsers } from '../services/users'

function Dashboard() {
  // Récupérer l'état du menu actif depuis localStorage ou utiliser 'dashboard' par défaut
  const [activeMenu, setActiveMenu] = useState(() => {
    return localStorage.getItem('activeMenu') || 'dashboard'
  })
  // searchQuery est utilisé comme filtre dans les pages (incidents/équipements/utilisateurs)
  const [searchQuery, setSearchQuery] = useState('')
  // recherche globale depuis le dashboard (ne filtre pas les cartes du dashboard)
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('')
  const [showDashboardSearchDropdown, setShowDashboardSearchDropdown] = useState(false)
  const [period, setPeriod] = useState('Mensuel') // Journalier, Hebdomadaire, Mensuel, Semestriel, Annuel
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false) // conserver état mais bouton retiré
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openCreateModalRequest, setOpenCreateModalRequest] = useState(null) // { menuId, token }
  const [backendAgentsCount, setBackendAgentsCount] = useState(null)
  const [backendOccupantsCount, setBackendOccupantsCount] = useState(null)
  const [backendUsers, setBackendUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [usersMessage, setUsersMessage] = useState('')
  
  // Utilisation du contexte de notifications
  const { unreadCount, getRecentNotifications } = useNotifications()
  
  // Données du profil utilisateur (pour l'instant simulées, à remplacer par les vraies données)
  const [userProfile, setUserProfile] = useState({
    firstName: 'Paul',
    lastName: 'BABODO',
    email: 'paul.babodo@iusjc.cm',
    phone: '+237 6XX XXX XXX',
    position: 'Administrateur Système',
    department: 'Direction Informatique',
    location: 'Yaoundé, Cameroun',
    avatar: null // Pour l'instant pas d'avatar
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)

  // Préférences utilisateur
  const [userPreferences, setUserPreferences] = useState({
    language: 'fr',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    dashboard: {
      itemsPerPage: 10,
      defaultPeriod: 'Mensuel',
      showCharts: true
    },
    privacy: {
      showEmail: true,
      showPhone: false
    }
  })

  const [editedPreferences, setEditedPreferences] = useState(userPreferences)

  // Initialiser editedProfile quand userProfile change
  useEffect(() => {
    setEditedProfile(userProfile)
  }, [userProfile])

  // Fonction pour gérer l'ouverture du modal
  const handleOpenProfileModal = () => {
    setShowProfileModal(true)
    setShowProfileMenu(false)
    setIsEditing(false)
    setEditedProfile(userProfile)
  }

  // Fonction pour activer le mode édition
  const handleEditProfile = () => {
    setIsEditing(true)
  }

  // Fonction pour annuler l'édition
  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(userProfile)
  }

  // Fonction pour sauvegarder les modifications
  const handleSaveProfile = (e) => {
    e.preventDefault()
    // TODO: Implémenter l'appel API pour sauvegarder le profil
    setUserProfile(editedProfile)
    setIsEditing(false)
    // Optionnel: Afficher un message de succès
    console.log('Profil mis à jour:', editedProfile)
  }

  // Fonction pour fermer le modal
  const handleCloseProfileModal = () => {
    setShowProfileModal(false)
    setIsEditing(false)
    setEditedProfile(userProfile)
  }

  // Fonction pour gérer l'ouverture du modal de préférences
  const handleOpenPreferencesModal = () => {
    setShowPreferencesModal(true)
    setShowProfileMenu(false)
    setEditedPreferences(userPreferences)
  }

  // Fonction pour sauvegarder les préférences
  const handleSavePreferences = (e) => {
    e.preventDefault()
    // TODO: Implémenter l'appel API pour sauvegarder les préférences
    setUserPreferences(editedPreferences)
    console.log('Préférences mises à jour:', editedPreferences)
    setShowPreferencesModal(false)
  }

  // Fonction pour fermer le modal de préférences
  const handleClosePreferencesModal = () => {
    setShowPreferencesModal(false)
    setEditedPreferences(userPreferences)
  }

  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const settingsRef = useRef(null) // laissé pour compat futur, bouton retiré
  const dashboardSearchRef = useRef(null)

  // Callback pour réinitialiser certains états quand on change de menu
  const handleMenuChange = (menuId) => {
    setSearchQuery('')
  }

  const triggerCreateModal = (menuId) => {
    const token = Date.now()
    setActiveMenu(menuId)
    localStorage.setItem('activeMenu', menuId)
    handleMenuChange(menuId)
    setOpenCreateModalRequest({ menuId, token })
  }

  const handleRefreshUsersStats = async () => {
    // Vérifier si on utilise le backdoor (faux token)
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken === 'backdoor-access-token') {
      setUsersMessage('⚠️ Mode backdoor actif - données simulées uniquement. Connectez-vous avec un vrai compte pour les données backend.')
      return
    }

    setIsLoadingUsers(true)
    setUsersMessage('')
    try {
      // Note: le backend limite à 100 éléments max par page
      const [agentsRes, occupantsRes] = await Promise.all([
        listUsers({ role: 'AGENT_TERRAIN', page: 1, limit: 100 }),
        listUsers({ role: 'OCCUPANT', page: 1, limit: 100 })
      ])

      const agentsCount = agentsRes?.total ?? agentsRes?.data?.length ?? 0
      const occupantsCount = occupantsRes?.total ?? occupantsRes?.data?.length ?? 0

      const mappedAgents =
        agentsRes?.data?.map((u) => ({
          id: u.id,
          type: 'agent',
          name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          email: u.email
        })) || []
      const mappedOccupants =
        occupantsRes?.data?.map((u) => ({
          id: u.id,
          type: 'occupant',
          name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          email: u.email
        })) || []

      setBackendAgentsCount(agentsCount)
      setBackendOccupantsCount(occupantsCount)
      setBackendUsers([...mappedAgents, ...mappedOccupants])
      setUsersMessage(`✅ Stats mises à jour (Agents: ${agentsCount}, Occupants: ${occupantsCount})`)
    } catch (error) {
      setUsersMessage(`❌ Erreur stats: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const baseStatsData = [
    { 
      title: 'Incidents', 
      count: 35, 
      description: 'Voici tous les incidents de tous les bâtiments',
      icon: IoWarningOutline,
      bgColor: '#ff4757'
    },
    { 
      title: 'Agents', 
      count: 26, 
      description: 'Voici tous les Agents de tous les bâtiments',
      icon: IoPeopleOutline,
      bgColor: '#3b82f6'
    },
    { 
      title: 'Occupants', 
      count: 35, 
      description: 'Voici tous les Occupants de tous les bâtiments',
      icon: IoPersonOutline,
      bgColor: '#10b981'
    },
    { 
      title: 'Equipements', 
      count: 35, 
      description: 'Voici tous les équipements de tous les bâtiments',
      icon: IoConstructOutline,
      bgColor: '#1f2937'
    }
  ]

  const statsData = baseStatsData.map((stat) => {
    if (stat.title === 'Agents' && backendAgentsCount !== null) {
      return { ...stat, count: backendAgentsCount }
    }
    if (stat.title === 'Occupants' && backendOccupantsCount !== null) {
      return { ...stat, count: backendOccupantsCount }
    }
    return stat
  })

  const topDefectiveRooms = [
    { code: 'CU101', building: 'Cité U', floor: 'RDC', defects: 5 },
    { code: 'CU205', building: 'Cité U', floor: '2ème', defects: 4 },
    { code: 'BP102', building: 'Bât. Pères', floor: '1er', defects: 3 },
    { code: 'BA304', building: 'Bâtiment A', floor: '3ème', defects: 3 },
    { code: 'BB201', building: 'Bâtiment B', floor: '2ème', defects: 2 },
  ]

  const roomsWithoutIncidents = [
    { code: 'CU301', building: 'Cité U', floor: '3ème' },
    { code: 'CU302', building: 'Cité U', floor: '3ème' },
    { code: 'BP201', building: 'Bât. Pères', floor: '2ème' },
    { code: 'BA101', building: 'Bâtiment A', floor: 'RDC' },
    { code: 'BB105', building: 'Bâtiment B', floor: '1er' },
  ]

  const equipmentStatsByBuilding = [
    { building: 'Bâtiment A', total: 120, active: 110, defective: 10 },
    { building: 'Bâtiment B', total: 85, active: 80, defective: 5 },
    { building: 'Cité U', total: 210, active: 190, defective: 20 },
    { building: 'Bât. Pères', total: 65, active: 60, defective: 5 },
  ]


  // Fonction pour obtenir l'icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'incident_created':
        return IoAddOutline
      case 'incident_updated':
        return IoConstructOutline
      case 'incident_resolved':
        return IoCheckboxOutline
      case 'user_added':
        return IoPersonOutline
      default:
        return IoNotificationsOutline
    }
  }

  // Fonction pour obtenir les couleurs selon le type
  const getNotificationColors = (type) => {
    switch (type) {
      case 'incident_created':
        return { bg: '#fee2e2', color: '#dc2626' }
      case 'incident_updated':
        return { bg: '#fef3c7', color: '#92400e' }
      case 'incident_resolved':
        return { bg: '#dcfce7', color: '#166534' }
      case 'user_added':
        return { bg: '#dbeafe', color: '#1d4ed8' }
      default:
        return { bg: '#f3f4f6', color: '#6b7280' }
    }
  }

  // Fonction pour formater le temps relatif
  const formatRelativeTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'il y a quelques secondes'
    if (minutes < 60) return `il y a ${minutes}m`
    if (hours < 24) return `il y a ${hours}h`
    if (days < 7) return `il y a ${days}j`
    return timestamp.toLocaleDateString('fr-FR')
  }

  // Transformer les notifications du contexte pour le dashboard
  const recentActivity = getRecentNotifications(4).map(notification => {
    const Icon = getNotificationIcon(notification.type)
    const colors = getNotificationColors(notification.type)

    return {
      id: notification.id,
      icon: Icon,
      iconBg: colors.bg,
      iconColor: colors.color,
      text: notification.message,
      time: formatRelativeTime(notification.timestamp)
    }
  })

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

  // ---------------------------------------------------------------------------
  // Recherche globale (mock) : Incidents / Équipements / Utilisateurs
  // -> prêt à être remplacé par un appel backend plus tard
  // ---------------------------------------------------------------------------
  const normalizedDashboardQuery = dashboardSearchQuery.trim().toLowerCase()

  const globalIncidents = [
    { id: 'INC-123', title: "Incident #123 - Serveur Principal", building: 'Bâtiment A', status: 'Nouveau' },
    { id: 'INC-121', title: "Incident #121 - Climatisation", building: 'Cité U', status: 'En cours' },
    { id: 'INC-119', title: "Incident #119 - Éclairage", building: 'Bât. Pères', status: 'Résolu' }
  ]

  const globalEquipments = [
    { id: 'EQ-001', name: 'Serveur Principal', location: 'Bâtiment A - Local Serveur' },
    { id: 'EQ-014', name: 'Climatiseur LG', location: 'Cité U - RDC' },
    { id: 'EQ-022', name: 'Imprimante Canon', location: 'Siège Administratif - 1er' }
  ]

  const globalUsers = [
    { id: 'USR-AG-01', type: 'agent', name: 'Jon Snow', email: 'jon.snow@iusjc.cm' },
    { id: 'USR-AG-02', type: 'agent', name: 'Jane Smith', email: 'jane.smith@iusjc.cm' },
    { id: 'USR-OC-01', type: 'occupant', name: 'Alice Martin', email: 'alice.martin@iusjc.cm' }
  ]

  const combinedUsers = [
    ...backendUsers,
    ...globalUsers.filter(
      (u) => !backendUsers.find((bu) => bu.email === u.email || bu.name === u.name)
    )
  ]

  const globalSearchResults = (() => {
    if (normalizedDashboardQuery.length < 2) {
      return { incidents: [], equipments: [], users: [] }
    }
    const incidents = globalIncidents.filter(
      (i) =>
        i.id.toLowerCase().includes(normalizedDashboardQuery) ||
        i.title.toLowerCase().includes(normalizedDashboardQuery) ||
        i.building.toLowerCase().includes(normalizedDashboardQuery) ||
        i.status.toLowerCase().includes(normalizedDashboardQuery)
    )
    const equipments = globalEquipments.filter(
      (e) =>
        e.id.toLowerCase().includes(normalizedDashboardQuery) ||
        e.name.toLowerCase().includes(normalizedDashboardQuery) ||
        e.location.toLowerCase().includes(normalizedDashboardQuery)
    )
    const users = combinedUsers.filter(
      (u) =>
        u.id.toLowerCase().includes(normalizedDashboardQuery) ||
        u.name.toLowerCase().includes(normalizedDashboardQuery) ||
        u.email.toLowerCase().includes(normalizedDashboardQuery)
    )
    return { incidents, equipments, users }
  })()

  const navigateToMenuWithSearch = (menuId, queryValue) => {
    setActiveMenu(menuId)
    localStorage.setItem('activeMenu', menuId)
    handleMenuChange(menuId)
    setSearchQuery(queryValue)
    setDashboardSearchQuery('')
    setShowDashboardSearchDropdown(false)
  }

  // Simuler le chargement du dashboard (3 secondes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // fermer les menus si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotificationsMenu(false)
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettingsMenu(false)
      }
      if (dashboardSearchRef.current && !dashboardSearchRef.current.contains(event.target)) {
        setShowDashboardSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <div className="dashboard-container">
      {/* Spinner de chargement */}
      {isLoading && (
        <div className="dashboard-loading-overlay">
          <Spinner size="large" color="#2563eb" />
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        onMenuChange={handleMenuChange}
      />

      {/* Main Content */}
      <main className={`main-content ${isLoading ? 'loading' : ''}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">{pageTitle}</h1>
            {activeMenu === 'dashboard' && (
              <div className="header-search" ref={dashboardSearchRef}>
                <IoSearchOutline className="header-search-icon" />
                <input
                  type="search"
                  value={dashboardSearchQuery}
                  onChange={(e) => {
                    setDashboardSearchQuery(e.target.value)
                    setShowDashboardSearchDropdown(true)
                  }}
                  onFocus={() => setShowDashboardSearchDropdown(true)}
                  placeholder="Rechercher un incident, un équipement..."
                  aria-label="Recherche globale"
                />

                {showDashboardSearchDropdown && (
                  <div className="header-search-dropdown">
                    {normalizedDashboardQuery.length < 2 ? (
                      <div className="search-dropdown-empty">
                        Saisissez au moins 2 caractères pour lancer la recherche.
                      </div>
                    ) : (
                      <>
                        <div className="search-dropdown-section">
                          <div className="search-dropdown-section-title">
                            Incidents ({globalSearchResults.incidents.length})
                          </div>
                          {globalSearchResults.incidents.slice(0, 5).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="search-dropdown-item"
                              onClick={() => navigateToMenuWithSearch('incident', item.id)}
                            >
                              <span className="search-item-primary">{item.title}</span>
                              <span className="search-item-secondary">
                                {item.building} • {item.status}
                              </span>
                            </button>
                          ))}
                          {globalSearchResults.incidents.length === 0 && (
                            <div className="search-dropdown-empty">Aucun incident trouvé.</div>
                          )}
                        </div>

                        <div className="search-dropdown-section">
                          <div className="search-dropdown-section-title">
                            Équipements ({globalSearchResults.equipments.length})
                          </div>
                          {globalSearchResults.equipments.slice(0, 5).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="search-dropdown-item"
                              onClick={() => navigateToMenuWithSearch('equipement', item.id)}
                            >
                              <span className="search-item-primary">{item.name}</span>
                              <span className="search-item-secondary">
                                {item.id} • {item.location}
                              </span>
                            </button>
                          ))}
                          {globalSearchResults.equipments.length === 0 && (
                            <div className="search-dropdown-empty">Aucun équipement trouvé.</div>
                          )}
                        </div>

                        <div className="search-dropdown-section">
                          <div className="search-dropdown-section-title">
                            Utilisateurs ({globalSearchResults.users.length})
                          </div>
                          {globalSearchResults.users.slice(0, 5).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="search-dropdown-item"
                              onClick={() =>
                                navigateToMenuWithSearch(
                                  item.type === 'agent' ? 'agent' : 'occupant',
                                  item.email
                                )
                              }
                            >
                              <span className="search-item-primary">
                                {item.name}
                                <span className="search-item-badge">
                                  {item.type === 'agent' ? 'Agent' : 'Occupant'}
                                </span>
                              </span>
                              <span className="search-item-secondary">{item.email}</span>
                            </button>
                          ))}
                          {globalSearchResults.users.length === 0 && (
                            <div className="search-dropdown-empty">Aucun utilisateur trouvé.</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="header-actions">
            <span className="user-name">Paul BABODO</span>
            <div className="header-action-group" ref={profileRef}>
              <button
                className="header-icon-btn"
                onClick={() => {
                  setShowProfileMenu((v) => !v)
                  setShowNotificationsMenu(false)
                  setShowSettingsMenu(false)
                }}
                title="Profil"
                aria-haspopup="true"
                aria-expanded={showProfileMenu}
              >
                <IoPersonOutline />
              </button>
              {showProfileMenu && (
                <div className="header-dropdown">
                  <div className="header-dropdown-section">
                    <p className="header-dropdown-title">Mon compte</p>
                    <button 
                      className="header-dropdown-item"
                      onClick={handleOpenProfileModal}
                    >
                      <IoPersonOutline />
                      <span>Profil</span>
                    </button>
                    <button 
                      className="header-dropdown-item"
                      onClick={handleOpenPreferencesModal}
                    >
                      <IoOptionsOutline />
                      <span>Préférences</span>
                    </button>
                  </div>
                  <div className="header-dropdown-section">
                    <button className="header-dropdown-item danger">
                      <IoLogOutOutline />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="header-action-group" ref={notifRef}>
              <button
                className="header-icon-btn badge-btn"
                onClick={() => {
                  setShowNotificationsPanel(true)
                  setShowNotificationsMenu(false)
                  setShowProfileMenu(false)
                  setShowSettingsMenu(false)
                }}
                title="Notifications"
                aria-haspopup="true"
                aria-expanded={showNotificationsPanel}
              >
                <IoNotificationsOutline />
                {unreadCount > 0 && <span className="header-badge">{unreadCount}</span>}
              </button>
              {showNotificationsMenu && (
                <div className="header-dropdown header-dropdown-wide">
                  <div className="header-dropdown-section">
                    <p className="header-dropdown-title">Notifications récentes</p>
                    {recentActivity.slice(0, 4).map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.id} className="notification-item">
                          <div
                            className="notification-icon"
                            style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                          >
                            <Icon />
                          </div>
                          <div className="notification-content">
                            <p className="notification-text">{item.text}</p>
                            <span className="notification-time">{item.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Contenu Tableau de Bord */}
        {activeMenu === 'dashboard' && (
          <>
            <div className="stats-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <button
                className="btn-add-agent-header"
                onClick={handleRefreshUsersStats}
                disabled={isLoadingUsers}
                style={{ backgroundColor: '#f0f0f0', color: '#333' }}
              >
                <IoRefreshOutline />
                <span>{isLoadingUsers ? 'Chargement...' : 'Rafraîchir Agents/Occupants'}</span>
              </button>
              {usersMessage && <span style={{ fontSize: '0.9rem' }}>{usersMessage}</span>}
            </div>
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

            <div className="incident-status-row">
            <div className="incident-status-card">
                <h3 className="incident-status-title">Status des Incidents</h3>
                <div className="incident-status-chart">
                  <div className="incident-status-bars">
                    <div className="incident-status-bar">
                      <div className="incident-status-bar-fill bar-nouveau"></div>
                      <span className="incident-status-label">Nouveau</span>
                    </div>
                    <div className="incident-status-bar">
                      <div className="incident-status-bar-fill bar-en-cours"></div>
                      <span className="incident-status-label">En cours</span>
                    </div>
                    <div className="incident-status-bar">
                      <div className="incident-status-bar-fill bar-resolu"></div>
                      <span className="incident-status-label">Résolu</span>
                    </div>
                    <div className="incident-status-bar">
                      <div className="incident-status-bar-fill bar-ferme"></div>
                      <span className="incident-status-label">Fermé</span>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="quick-actions-card">
                <h3 className="quick-actions-title">Accès Rapide</h3>
                <div className="quick-actions-list">
                  <button
                    type="button"
                    className="quick-action-item"
                    onClick={() => triggerCreateModal('occupant')}
                  >
                    <span className="quick-action-icon-wrap">
                      <IoPersonOutline className="quick-action-icon" />
                    </span>
                    <span className="quick-action-label">Créer un Occupant</span>
                  </button>

                  <button
                    type="button"
                    className="quick-action-item"
                    onClick={() => triggerCreateModal('agent')}
                  >
                    <span className="quick-action-icon-wrap">
                      <IoPeopleOutline className="quick-action-icon" />
                    </span>
                    <span className="quick-action-label">Créer un Agent</span>
                  </button>

                  <button
                    type="button"
                    className="quick-action-item"
                    onClick={() => triggerCreateModal('equipement')}
                  >
                    <span className="quick-action-icon-wrap">
                      <IoConstructOutline className="quick-action-icon" />
                    </span>
                    <span className="quick-action-label">Ajouter un Équipement</span>
                  </button>

                  <button type="button" className="quick-action-item">
                    <span className="quick-action-icon-wrap">
                      <IoGridOutline className="quick-action-icon" />
                    </span>
                    <span className="quick-action-label">Voir les Rapports</span>
                  </button>
                </div>
              </aside>
            </div>

            <div className="charts-row">
              {/* Bar Chart - Incidents par Bâtiment */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Incidents par Batiment</h3>
                  <div className="period-selector">
                    <IoCalendarOutline />
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                      <option value="Journalier">Journalier</option>
                      <option value="Hebdomadaire">Hebdomadaire</option>
                      <option value="Mensuel">Mensuel</option>
                      <option value="Semestriel">Semestriel</option>
                      <option value="Annuel">Annuel</option>
                    </select>
                  </div>
                </div>
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
                      <div className="bar" style={{ height: '40%' }}></div>
                      <span className="bar-label">Cité U</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Chart - Évolution temporelle */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Incidents par Période</h3>
                  <div className="period-selector">
                    <IoCalendarOutline />
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                      <option value="Journalier">Journalier</option>
                      <option value="Hebdomadaire">Hebdomadaire</option>
                      <option value="Mensuel">Mensuel</option>
                      <option value="Semestriel">Semestriel</option>
                      <option value="Annuel">Annuel</option>
                    </select>
                  </div>
                </div>
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
                      <span>P-10</span>
                      <span>P-9</span>
                      <span>P-8</span>
                      <span>P-7</span>
                      <span>P-6</span>
                      <span>P-5</span>
                      <span>P-4</span>
                      <span>P-3</span>
                      <span>P-2</span>
                      <span>P-1</span>
                      <span>Actuel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-advanced-row">
               {/* Top Chambres Défectueuses */}
              <div className="advanced-stat-card">
                <div className="card-header-flex">
                  <h3 className="card-title-small">Top Chambres Défectueuses</h3>
                  <div className="badge-period">{period}</div>
                </div>
                <div className="list-compact">
                  {topDefectiveRooms.map((room, idx) => (
                    <div key={idx} className="list-item-row">
                      <div className="list-item-icon bg-red-100 text-red-600">
                        <IoAlertCircleOutline />
                      </div>
                      <div className="list-item-details">
                        <span className="list-item-title">{room.code}</span>
                        <span className="list-item-subtitle">{room.building} - {room.floor}</span>
                      </div>
                      <div className="list-item-value text-red-600">
                        {room.defects}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chambres sans incident */}
              <div className="advanced-stat-card">
                <div className="card-header-flex">
                  <h3 className="card-title-small">Chambres Sans Incident</h3>
                  <div className="badge-period">{period}</div>
                </div>
                <div className="list-compact">
                  {roomsWithoutIncidents.map((room, idx) => (
                    <div key={idx} className="list-item-row">
                      <div className="list-item-icon bg-green-100 text-green-600">
                        <IoCheckmarkCircleOutline />
                      </div>
                      <div className="list-item-details">
                        <span className="list-item-title">{room.code}</span>
                        <span className="list-item-subtitle">{room.building} - {room.floor}</span>
                      </div>
                      <div className="list-item-value text-green-600">
                        OK
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Équipements par Bâtiment */}
              <div className="advanced-stat-card">
                <div className="card-header-flex">
                  <h3 className="card-title-small">Équipements par Bâtiment</h3>
                  <div className="badge-period text-gray-500"><IoStatsChartOutline /></div>
                </div>
                <div className="equipment-stats-list">
                  {equipmentStatsByBuilding.map((stat, idx) => (
                    <div key={idx} className="equipment-stat-item">
                      <div className="equipment-stat-header">
                        <span className="equipment-stat-building">{stat.building}</span>
                        <span className="equipment-stat-total">{stat.total} Total</span>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill bg-green-500" 
                          style={{ width: `${(stat.active / stat.total) * 100}%` }}
                          title={`Actifs: ${stat.active}`}
                        ></div>
                        <div 
                          className="progress-bar-fill bg-red-500" 
                          style={{ width: `${(stat.defective / stat.total) * 100}%` }}
                          title={`Défectueux: ${stat.defective}`}
                        ></div>
                      </div>
                      <div className="equipment-stat-legend">
                        <span className="text-green-600">{stat.active} Actifs</span>
                        <span className="text-red-600">{stat.defective} Défaut</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bottom-row">
              <div className="incidents-card">
                <h3 className="chart-title">Activité Récente</h3>
                <div className="incidents-list">
                  {recentActivity.map((item, index) => {
                    const Icon = item.icon
                    const isLast = index === recentActivity.length - 1
                    return (
                      <div
                        key={item.id}
                        className={`incident-item ${isLast ? 'incident-item-last' : ''}`}
                      >
                        <div className="incident-timeline">
                          <div
                            className="incident-timeline-icon"
                            style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                          >
                            <Icon />
                          </div>
                        </div>
                        <div className="incident-info">
                          <p className="incident-text">{item.text}</p>
                        </div>
                        <div className="incident-time">{item.time}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Contenu Bâtiment */}
        {activeMenu === 'batiment' && (
          <Buildings searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}

        {/* Contenu Équipement */}
        {activeMenu === 'equipement' && (
          <Equipments
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openCreateModalToken={
              openCreateModalRequest?.menuId === 'equipement'
                ? openCreateModalRequest.token
                : null
            }
          />
        )}

        {/* Contenu Occupant */}
        {activeMenu === 'occupant' && (
          <Occupants
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openCreateModalToken={
              openCreateModalRequest?.menuId === 'occupant'
                ? openCreateModalRequest.token
                : null
            }
          />
        )}

        {/* Contenu Agent */}
        {activeMenu === 'agent' && (
          <Agents
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openCreateModalToken={
              openCreateModalRequest?.menuId === 'agent'
                ? openCreateModalRequest.token
                : null
            }
          />
        )}

        {/* Contenu Incident */}
        {activeMenu === 'incident' && (
          <Incidents searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}

      </main>

      {/* Modal Profil */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={handleCloseProfileModal}>
          <div className="modal-content modal-profile" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Mon Profil</h2>
              <button className="modal-close-btn" onClick={handleCloseProfileModal}>
                <IoCloseOutline />
              </button>
            </div>

            <form className="modal-form modal-profile-form" onSubmit={handleSaveProfile}>
              {/* Avatar Section */}
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Avatar" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      <IoPersonOutline />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button type="button" className="btn-change-avatar">
                    Changer la photo
                  </button>
                )}
              </div>

              {/* Informations personnelles */}
              <div className="profile-section">
                <h3 className="profile-section-title">Informations personnelles</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile-firstname">Prénom</label>
                    <input
                      type="text"
                      id="profile-firstname"
                      value={editedProfile.firstName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-lastname">Nom</label>
                    <input
                      type="text"
                      id="profile-lastname"
                      value={editedProfile.lastName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="profile-email">
                    <IoMailOutline className="form-label-icon" />
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    id="profile-email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-phone">
                    <IoCallOutline className="form-label-icon" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="profile-phone"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Informations professionnelles */}
              <div className="profile-section">
                <h3 className="profile-section-title">Informations professionnelles</h3>
                <div className="form-group">
                  <label htmlFor="profile-position">Poste</label>
                  <input
                    type="text"
                    id="profile-position"
                    value={editedProfile.position}
                    onChange={(e) => setEditedProfile({ ...editedProfile, position: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-department">Département</label>
                  <input
                    type="text"
                    id="profile-department"
                    value={editedProfile.department}
                    onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="profile-location">
                    <IoLocationOutline className="form-label-icon" />
                    Localisation
                  </label>
                  <input
                    type="text"
                    id="profile-location"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                {!isEditing ? (
                  <>
                    <button type="button" className="btn-cancel" onClick={handleCloseProfileModal}>
                      Fermer
                    </button>
                    <button type="button" className="btn-submit" onClick={handleEditProfile}>
                      Modifier le profil
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                      Annuler
                    </button>
                    <button type="submit" className="btn-submit">
                      Enregistrer les modifications
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Préférences */}
      {showPreferencesModal && (
        <div className="modal-overlay" onClick={handleClosePreferencesModal}>
          <div className="modal-content modal-preferences" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Préférences</h2>
              <button className="modal-close-btn" onClick={handleClosePreferencesModal}>
                <IoCloseOutline />
              </button>
            </div>

            <form className="modal-form modal-preferences-form" onSubmit={handleSavePreferences}>
              {/* Langue */}
              <div className="preferences-section">
                <h3 className="preferences-section-title">
                  <IoLanguageOutline className="preferences-section-icon" />
                  Langue
                </h3>
                <div className="form-group">
                  <label htmlFor="preferences-language">Langue de l'interface</label>
                  <select
                    id="preferences-language"
                    value={editedPreferences.language}
                    onChange={(e) => setEditedPreferences({ ...editedPreferences, language: e.target.value })}
                    className="form-select"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              {/* Thème */}
              <div className="preferences-section">
                <h3 className="preferences-section-title">
                  {editedPreferences.theme === 'light' ? (
                    <IoSunnyOutline className="preferences-section-icon" />
                  ) : (
                    <IoMoonOutline className="preferences-section-icon" />
                  )}
                  Apparence
                </h3>
                <div className="form-group">
                  <label htmlFor="preferences-theme">Thème</label>
                  <div className="theme-selector">
                    <button
                      type="button"
                      className={`theme-option ${editedPreferences.theme === 'light' ? 'active' : ''}`}
                      onClick={() => setEditedPreferences({ ...editedPreferences, theme: 'light' })}
                    >
                      <IoSunnyOutline />
                      <span>Clair</span>
                    </button>
                    <button
                      type="button"
                      className={`theme-option ${editedPreferences.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setEditedPreferences({ ...editedPreferences, theme: 'dark' })}
                    >
                      <IoMoonOutline />
                      <span>Sombre</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="preferences-section">
                <h3 className="preferences-section-title">
                  <IoNotificationsOutline className="preferences-section-icon" />
                  Notifications
                </h3>
                <div className="preferences-checkbox-group">
                  <label className="preferences-checkbox-item">
                    <input
                      type="checkbox"
                      checked={editedPreferences.notifications.email}
                      onChange={(e) => setEditedPreferences({
                        ...editedPreferences,
                        notifications: { ...editedPreferences.notifications, email: e.target.checked }
                      })}
                    />
                    <div className="checkbox-content">
                      <IoMailOutline className="checkbox-icon" />
                      <div>
                        <span className="checkbox-label">Notifications par e-mail</span>
                        <span className="checkbox-description">Recevoir les notifications importantes par e-mail</span>
                      </div>
                    </div>
                  </label>

                  <label className="preferences-checkbox-item">
                    <input
                      type="checkbox"
                      checked={editedPreferences.notifications.push}
                      onChange={(e) => setEditedPreferences({
                        ...editedPreferences,
                        notifications: { ...editedPreferences.notifications, push: e.target.checked }
                      })}
                    />
                    <div className="checkbox-content">
                      <IoNotificationsOutline className="checkbox-icon" />
                      <div>
                        <span className="checkbox-label">Notifications push</span>
                        <span className="checkbox-description">Recevoir des notifications dans le navigateur</span>
                      </div>
                    </div>
                  </label>

                  <label className="preferences-checkbox-item">
                    <input
                      type="checkbox"
                      checked={editedPreferences.notifications.sms}
                      onChange={(e) => setEditedPreferences({
                        ...editedPreferences,
                        notifications: { ...editedPreferences.notifications, sms: e.target.checked }
                      })}
                    />
                    <div className="checkbox-content">
                      <IoCallOutline className="checkbox-icon" />
                      <div>
                        <span className="checkbox-label">Notifications SMS</span>
                        <span className="checkbox-description">Recevoir des alertes importantes par SMS</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tableau de bord */}
              <div className="preferences-section">
                <h3 className="preferences-section-title">
                  <IoGridOutline className="preferences-section-icon" />
                  Tableau de bord
                </h3>
                <div className="form-group">
                  <label htmlFor="preferences-items-per-page">Éléments par page</label>
                  <select
                    id="preferences-items-per-page"
                    value={editedPreferences.dashboard.itemsPerPage}
                    onChange={(e) => setEditedPreferences({
                      ...editedPreferences,
                      dashboard: { ...editedPreferences.dashboard, itemsPerPage: parseInt(e.target.value) }
                    })}
                    className="form-select"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="preferences-default-period">Période par défaut</label>
                  <select
                    id="preferences-default-period"
                    value={editedPreferences.dashboard.defaultPeriod}
                    onChange={(e) => setEditedPreferences({
                      ...editedPreferences,
                      dashboard: { ...editedPreferences.dashboard, defaultPeriod: e.target.value }
                    })}
                    className="form-select"
                  >
                    <option value="Journalier">Journalier</option>
                    <option value="Hebdomadaire">Hebdomadaire</option>
                    <option value="Mensuel">Mensuel</option>
                    <option value="Semestriel">Semestriel</option>
                    <option value="Annuel">Annuel</option>
                  </select>
                </div>

                <label className="preferences-checkbox-item">
                  <input
                    type="checkbox"
                    checked={editedPreferences.dashboard.showCharts}
                    onChange={(e) => setEditedPreferences({
                      ...editedPreferences,
                      dashboard: { ...editedPreferences.dashboard, showCharts: e.target.checked }
                    })}
                  />
                  <div className="checkbox-content">
                    <IoStatsChartOutline className="checkbox-icon" />
                    <div>
                      <span className="checkbox-label">Afficher les graphiques</span>
                      <span className="checkbox-description">Afficher les graphiques sur le tableau de bord</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Confidentialité */}
              <div className="preferences-section">
                <h3 className="preferences-section-title">
                  <IoPersonOutline className="preferences-section-icon" />
                  Confidentialité
                </h3>
                <label className="preferences-checkbox-item">
                  <input
                    type="checkbox"
                    checked={editedPreferences.privacy.showEmail}
                    onChange={(e) => setEditedPreferences({
                      ...editedPreferences,
                      privacy: { ...editedPreferences.privacy, showEmail: e.target.checked }
                    })}
                  />
                  <div className="checkbox-content">
                    <IoMailOutline className="checkbox-icon" />
                    <div>
                      <span className="checkbox-label">Afficher mon e-mail</span>
                      <span className="checkbox-description">Permettre aux autres utilisateurs de voir mon adresse e-mail</span>
                    </div>
                  </div>
                </label>

                <label className="preferences-checkbox-item">
                  <input
                    type="checkbox"
                    checked={editedPreferences.privacy.showPhone}
                    onChange={(e) => setEditedPreferences({
                      ...editedPreferences,
                      privacy: { ...editedPreferences.privacy, showPhone: e.target.checked }
                    })}
                  />
                  <div className="checkbox-content">
                    <IoCallOutline className="checkbox-icon" />
                    <div>
                      <span className="checkbox-label">Afficher mon téléphone</span>
                      <span className="checkbox-description">Permettre aux autres utilisateurs de voir mon numéro de téléphone</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleClosePreferencesModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Enregistrer les préférences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Panneau de Notifications */}
      <NotificationsPanel
        isOpen={showNotificationsPanel}
        onClose={() => setShowNotificationsPanel(false)}
      />
    </div>
  )
}

export default Dashboard

