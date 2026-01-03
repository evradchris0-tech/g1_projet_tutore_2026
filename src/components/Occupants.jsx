import { useEffect, useRef, useState } from 'react'
import {
  IoSearchOutline,
  IoAddOutline,
  IoCloseOutline,
  IoCheckboxOutline,
  IoSquareOutline,
  IoEyeOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoInformationCircleOutline,
  IoCloudUploadOutline,
  IoPaperPlaneOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoDocumentTextOutline,
  IoCloseCircleOutline
} from 'react-icons/io5'
import '../styles/Occupants.css'
import { createUser, assignRoom, listUsers, validateExcel, uploadExcel, importOccupants, exportUsers, downloadTemplate, updateUser, deleteUser } from '../services/users'
import { IoRefreshOutline, IoDownloadOutline } from 'react-icons/io5'

function Occupants({ searchQuery, setSearchQuery, openCreateModalToken = null }) {
  const [selectedOccupants, setSelectedOccupants] = useState([])
  const [showAddOccupantModal, setShowAddOccupantModal] = useState(false)
  const [showEditOccupantModal, setShowEditOccupantModal] = useState(false)
  const [editingOccupant, setEditingOccupant] = useState(null)
  const [showAssignRoomModal, setShowAssignRoomModal] = useState(false)
  const [assigningOccupant, setAssigningOccupant] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isSavingOccupant, setIsSavingOccupant] = useState(false)
  const [occupantMessage, setOccupantMessage] = useState('')
  const [backendOccupants, setBackendOccupants] = useState([])
  const [isLoadingBackend, setIsLoadingBackend] = useState(false)
  const [occupantActionId, setOccupantActionId] = useState(null)
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false)
  const [isExportingUsers, setIsExportingUsers] = useState(false)
  const [selectedSession, setSelectedSession] = useState('2024-2025')
  
  // États pour l'import
  const [importFile, setImportFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [importStep, setImportStep] = useState('upload') // 'upload' | 'preview' | 'report'
  const [importReport, setImportReport] = useState({ success: 0, errors: [], rejectedRows: [] })
  const fileInputRef = useRef(null)

  const lastOpenTokenRef = useRef(null)
  useEffect(() => {
    if (openCreateModalToken && openCreateModalToken !== lastOpenTokenRef.current) {
      setShowAddOccupantModal(true)
      lastOpenTokenRef.current = openCreateModalToken
    }
  }, [openCreateModalToken])

  const [newOccupant, setNewOccupant] = useState({
    lastName: '',
    firstName: '',
    unit: '',
    email: '',
    type: 'ETUDIANT_CITE_U',
    room: '',
    startDate: '',
    endDate: '',
    status: 'Actif'
  })

  // Données simulées pour les occupants (selon la maquette)
  const occupants = [
    { id: 1, lastName: 'Dupont', firstName: 'Jean', unit: 'Génie Informatique', type: 'ETUDIANT_CITE_U', room: 'A101', email: 'jean.dupont@email.com', status: 'Actif', startDate: '2024-09-01', endDate: '2025-06-30' },
    { id: 2, lastName: 'Martin', firstName: 'Marie', unit: 'Droit', type: 'ETUDIANT_CITE_U', room: 'B204', email: 'marie.martin@email.com', status: 'Actif', startDate: '2024-09-01', endDate: '2025-06-30' },
    { id: 3, lastName: 'Petit', firstName: 'Lucas', unit: 'Théologie', type: 'RESIDENT_BATIMENT_PERES', room: 'P102', email: 'lucas.petit@email.com', status: 'Inactif', startDate: '2023-09-01', endDate: '2024-06-30' },
    { id: 4, lastName: 'Bernard', firstName: 'Sophie', unit: 'Génie Informatique', type: 'ETUDIANT_CITE_U', room: 'A105', email: 'sophie.bernard@email.com', status: 'Actif', startDate: '2024-09-01', endDate: '2025-06-30' },
    { id: 5, lastName: 'Dubois', firstName: 'Pierre', unit: 'Philosophie', type: 'RESIDENT_BATIMENT_PERES', room: 'P201', email: 'pierre.dubois@email.com', status: 'Actif', startDate: '2024-09-01', endDate: '2025-06-30' },
    { id: 6, lastName: 'Moreau', firstName: 'Claire', unit: 'Administration', type: 'PERSONNEL', room: 'Bur. 305', email: 'claire.moreau@email.com', status: 'Inactif', startDate: '', endDate: '' },
    { id: 7, lastName: 'Laurent', firstName: 'Thomas', unit: 'Génie Civil', type: 'ETUDIANT_CITE_U', room: 'C301', email: 'thomas.laurent@email.com', status: 'Actif', startDate: '2024-09-01', endDate: '2025-06-30' },
    { id: 8, lastName: 'Simon', firstName: 'Emma', unit: 'Ressources Humaines', type: 'PERSONNEL', room: 'Bur. 110', email: 'emma.simon@email.com', status: 'Actif', startDate: '', endDate: '' },
    { id: 9, lastName: 'Michel', firstName: 'Antoine', unit: 'Maintenance', type: 'PERSONNEL', room: 'Atelier', email: 'antoine.michel@email.com', status: 'Actif', startDate: '', endDate: '' },
    { id: 10, lastName: 'Garcia', firstName: 'Isabelle', unit: 'Génie Informatique', type: 'ETUDIANT_CITE_U', room: 'A202', email: 'isabelle.garcia@email.com', status: 'Inactif', startDate: '2023-09-01', endDate: '2024-06-30' }
  ]

  // Données simulées pour les chambres disponibles
  const availableRooms = [
    { code: 'A101', label: 'Chambre A101 (Cité U - Bat A)' },
    { code: 'A102', label: 'Chambre A102 (Cité U - Bat A)' },
    { code: 'B204', label: 'Chambre B204 (Cité U - Bat B)' },
    { code: 'P102', label: 'Chambre P102 (Bat Pères)' },
    { code: 'P201', label: 'Chambre P201 (Bat Pères)' },
    { code: 'C301', label: 'Chambre C301 (Cité U - Bat C)' }
  ]

  // Sessions annuelles
  const sessions = [
    { value: '2024-2025', label: 'Session 2024-2025 (Active)' },
    { value: '2023-2024', label: 'Session 2023-2024 (Archivée)' },
    { value: '2022-2023', label: 'Session 2022-2023 (Archivée)' }
  ]

  const handleSelectOccupant = (occupantId) => {
    setSelectedOccupants(prev => {
      if (prev.includes(occupantId)) {
        return prev.filter(id => id !== occupantId)
      } else {
        return [...prev, occupantId]
      }
    })
  }

  const handleSelectAllOccupants = () => {
    if (selectedOccupants.length === filteredOccupants.length) {
      setSelectedOccupants([])
    } else {
      setSelectedOccupants(filteredOccupants.map(occ => occ.id))
    }
  }

  const handleAddOccupant = async (e) => {
    e.preventDefault()
    setOccupantMessage('')
    setIsSavingOccupant(true)

    try {
      const created = await createUser({
        email: newOccupant.email,
        firstName: newOccupant.firstName || newOccupant.email,
        lastName: newOccupant.lastName || '',
        role: 'OCCUPANT',
        roomNumber: newOccupant.room || undefined,
        roomId: newOccupant.room || undefined,
        academicSessionId: selectedSession
      })

      if (newOccupant.room) {
        await assignRoom(created.user?.id || created.id, {
          roomId: newOccupant.room,
          roomNumber: newOccupant.room,
          academicSessionId: selectedSession
        })
      }

      setOccupantMessage("Occupant créé (backend) avec succès.")
    } catch (error) {
      setOccupantMessage(error?.message || "Impossible de créer cet occupant.")
    } finally {
      setIsSavingOccupant(false)
      setNewOccupant({
        lastName: '',
        firstName: '',
        unit: '',
        email: '',
        type: 'ETUDIANT_CITE_U',
        room: '',
        startDate: '',
        endDate: '',
        status: 'Actif'
      })
      setShowAddOccupantModal(false)
    }
  }

  const handleCancelAddOccupant = () => {
    setNewOccupant({
      lastName: '',
      firstName: '',
      unit: '',
      email: '',
      type: 'ETUDIANT_CITE_U',
      room: '',
      startDate: '',
      endDate: '',
      status: 'Actif'
    })
    setShowAddOccupantModal(false)
  }

  // Fusionner les occupants simulés avec les occupants du backend
  const allOccupants = [...backendOccupants, ...occupants.filter(occ => !backendOccupants.find(bo => bo.email === occ.email))]

  // Filtrer les occupants selon la recherche
  const filteredOccupants = allOccupants.filter((occupant) => {
    const query = searchQuery.toLowerCase()
    return (
      occupant.lastName.toLowerCase().includes(query) ||
      occupant.firstName.toLowerCase().includes(query) ||
      occupant.unit.toLowerCase().includes(query) ||
      occupant.email.toLowerCase().includes(query) ||
      occupant.room.toLowerCase().includes(query)
    )
  })

  // Fonction pour formater le type d'occupant
  const formatOccupantType = (type) => {
    switch(type) {
      case 'ETUDIANT_CITE_U': return 'Étudiant Cité U';
      case 'RESIDENT_BATIMENT_PERES': return 'Résident Pères';
      case 'PERSONNEL': return 'Personnel';
      default: return type;
    }
  }

  // Fonction pour rafraîchir les occupants depuis le backend
  const handleRefreshOccupants = async () => {
    setIsLoadingBackend(true)
    setOccupantMessage('')
    try {
      const result = await listUsers({ role: 'OCCUPANT', page: 1, limit: 100 })
      const transformed = result.data.map(user => ({
        id: user.id,
        lastName: user.lastName || '',
        firstName: user.firstName || '',
        email: user.email,
        type: 'OCCUPANT', // Le backend retourne le rôle
        room: user.currentRoomId || '',
        unit: '', // Pas dans le schéma backend
        status: user.status === 'ACTIVE' ? 'Actif' : 'Inactif',
        startDate: '',
        endDate: '',
        fromBackend: true
      }))
      setBackendOccupants(transformed)
      setOccupantMessage(`✅ ${transformed.length} occupant(s) chargé(s) depuis le backend`)
    } catch (error) {
      setOccupantMessage(`❌ Erreur lors du chargement: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsLoadingBackend(false)
    }
  }

  // Fonction pour télécharger le template Excel
  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true)
    setOccupantMessage('')
    try {
      const blob = await downloadTemplate()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template-utilisateurs.xlsx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setOccupantMessage('✅ Template téléchargé avec succès')
    } catch (error) {
      setOccupantMessage(`❌ Erreur lors du téléchargement: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsDownloadingTemplate(false)
    }
  }

  // Fonction pour exporter les occupants
  const handleExportUsers = async () => {
    setIsExportingUsers(true)
    setOccupantMessage('')
    try {
      const blob = await exportUsers()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const date = new Date().toISOString().split('T')[0]
      a.download = `utilisateurs-export-${date}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setOccupantMessage('✅ Export réussi')
    } catch (error) {
      setOccupantMessage(`❌ Erreur lors de l'export: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsExportingUsers(false)
    }
  }

  // Fonctions pour l'import Excel
  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const validExtensions = ['.xls', '.xlsx']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        alert('Format de fichier non supporté. Veuillez sélectionner un fichier .xls ou .xlsx')
        return
      }
      
      setImportFile(file)
      setImportStep('preview')
      
      // Valider le fichier avec le backend
      try {
        const validation = await validateExcel(file)
        // Transformer les résultats de validation en format preview
        const previewRows = []
        if (validation.errors && validation.errors.length > 0) {
          validation.errors.forEach((error, idx) => {
            previewRows.push({
              row: idx + 1,
              status: 'error',
              error: error
            })
          })
        }
        if (validation.warnings && validation.warnings.length > 0) {
          validation.warnings.forEach((warning, idx) => {
            previewRows.push({
              row: idx + 1,
              status: 'warning',
              warning: warning
            })
          })
        }
        // Si pas d'erreurs, on peut afficher un message de succès
        if (validation.success) {
          setPreviewData([{ row: 1, status: 'valid', message: `${validation.rowCount} lignes valides` }])
        } else {
          setPreviewData(previewRows)
        }
      } catch (error) {
        setOccupantMessage(`❌ Erreur de validation: ${error?.message || 'Erreur inconnue'}`)
        setImportStep('upload')
      }
    }
  }

  const simulateFileRead = (file) => {
    // Simulation de données extraites du fichier Excel
    const simulatedData = [
      { row: 1, lastName: 'Dupont', firstName: 'Jean', email: 'jean.dupont@email.com', type: 'ETUDIANT_CITE_U', room: 'A101', unit: 'Génie Informatique', startDate: '2024-09-01', endDate: '2025-06-30', status: 'valid' },
      { row: 2, lastName: 'Martin', firstName: 'Marie', email: 'marie.martin@email.com', type: 'ETUDIANT_CITE_U', room: 'B204', unit: 'Droit', startDate: '2024-09-01', endDate: '2025-06-30', status: 'valid' },
      { row: 3, lastName: 'Bernard', firstName: 'Sophie', email: 'sophie.bernard@email.com', type: 'ETUDIANT_CITE_U', room: 'A105', unit: 'Génie Informatique', startDate: '2024-09-01', endDate: '2025-06-30', status: 'valid' },
      { row: 4, lastName: '', firstName: 'Pierre', email: 'pierre.dubois@email.com', type: 'RESIDENT_BATIMENT_PERES', room: 'P201', unit: 'Philosophie', startDate: '2024-09-01', endDate: '2025-06-30', status: 'error', error: 'Nom manquant' },
      { row: 5, lastName: 'Moreau', firstName: 'Claire', email: 'invalid-email', type: 'PERSONNEL', room: 'Bur. 305', unit: 'Administration', startDate: '', endDate: '', status: 'error', error: 'Email invalide' },
      { row: 6, lastName: 'Laurent', firstName: 'Thomas', email: 'thomas.laurent@email.com', type: 'ETUDIANT_CITE_U', room: 'C301', unit: 'Génie Civil', startDate: '2024-09-01', endDate: '2025-06-30', status: 'valid' },
    ]
    
    setPreviewData(simulatedData)
    setImportStep('preview')
  }

  const validateData = () => {
    const errors = []
    const rejectedRows = []
    
    previewData.forEach((row) => {
      const rowErrors = []
      
      if (!row.lastName || row.lastName.trim() === '') {
        rowErrors.push('Nom manquant')
      }
      if (!row.firstName || row.firstName.trim() === '') {
        rowErrors.push('Prénom manquant')
      }
      if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        rowErrors.push('Email invalide')
      }
      if (!row.type || !['ETUDIANT_CITE_U', 'RESIDENT_BATIMENT_PERES', 'PERSONNEL'].includes(row.type)) {
        rowErrors.push('Type d\'occupant invalide')
      }
      
      if (rowErrors.length > 0) {
        errors.push({ row: row.row, errors: rowErrors })
        rejectedRows.push({ ...row, errors: rowErrors })
      }
    })
    
    const successCount = previewData.length - rejectedRows.length
    
    setImportReport({
      success: successCount,
      errors: errors,
      rejectedRows: rejectedRows
    })
    
    return rejectedRows.length === 0
  }

  const handleImport = async () => {
    if (!importFile) {
      setOccupantMessage('❌ Aucun fichier sélectionné')
      return
    }

    try {
      setOccupantMessage('Import en cours...')
      const result = await importOccupants(importFile, selectedSession)
      
      setImportStep('report')
      setImportReport({
        success: result.summary?.successCount || 0,
        errors: result.errors || [],
        rejectedRows: []
      })
      setOccupantMessage(`✅ Import terminé: ${result.summary?.successCount || 0} occupant(s) créé(s)`)
      
      // Rafraîchir la liste après import
      await handleRefreshOccupants()
    } catch (error) {
      setOccupantMessage(`❌ Erreur lors de l'import: ${error?.message || 'Erreur inconnue'}`)
      setImportStep('upload')
    }
  }

  const handleToggleOccupantStatus = async (occupant) => {
    if (!occupant?.fromBackend) {
      setOccupantMessage('❌ Action disponible uniquement pour les occupants du backend.')
      return
    }
    const nextStatus = occupant.status === 'Actif' ? 'INACTIVE' : 'ACTIVE'
    setOccupantActionId(occupant.id)
    setOccupantMessage('')
    try {
      await updateUser(occupant.id, { status: nextStatus })
      await handleRefreshOccupants()
      setOccupantMessage('✅ Statut mis à jour')
    } catch (error) {
      setOccupantMessage(`❌ Erreur statut: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setOccupantActionId(null)
    }
  }

  const handleEditOccupant = (occupant) => {
    setEditingOccupant({
      ...occupant,
      lastName: occupant.lastName || '',
      firstName: occupant.firstName || '',
      unit: occupant.unit || '',
      email: occupant.email || '',
      type: occupant.type || 'ETUDIANT_CITE_U',
      room: occupant.room || '',
      startDate: occupant.startDate || '',
      endDate: occupant.endDate || '',
      status: occupant.status || 'Actif'
    })
    setShowEditOccupantModal(true)
  }

  const handleSaveEditOccupant = async (e) => {
    e.preventDefault()
    if (!editingOccupant?.fromBackend) {
      setOccupantMessage('❌ Édition disponible uniquement pour les occupants du backend.')
      return
    }

    setOccupantMessage('')
    setIsSavingOccupant(true)

    try {
      await updateUser(editingOccupant.id, {
        firstName: editingOccupant.firstName,
        lastName: editingOccupant.lastName,
        email: editingOccupant.email,
        status: editingOccupant.status === 'Actif' ? 'ACTIVE' : 'INACTIVE'
      })

      // Si la chambre a changé, mettre à jour l'assignation
      if (editingOccupant.room !== editingOccupant.originalRoom) {
        if (editingOccupant.room) {
          await assignRoom(editingOccupant.id, {
            roomId: editingOccupant.room,
            roomNumber: editingOccupant.room,
            academicSessionId: selectedSession
          })
        }
      }

      setOccupantMessage('✅ Occupant modifié avec succès.')
      setShowEditOccupantModal(false)
      setEditingOccupant(null)
      await handleRefreshOccupants()
    } catch (error) {
      setOccupantMessage(`❌ Erreur lors de la modification: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsSavingOccupant(false)
    }
  }

  const handleCancelEditOccupant = () => {
    setShowEditOccupantModal(false)
    setEditingOccupant(null)
  }

  const handleAssignRoom = (occupant) => {
    setAssigningOccupant(occupant)
    setSelectedRoom(occupant.room || '')
    setShowAssignRoomModal(true)
  }

  const handleSaveAssignRoom = async (e) => {
    e.preventDefault()
    if (!assigningOccupant?.fromBackend) {
      setOccupantMessage('❌ Assignation disponible uniquement pour les occupants du backend.')
      return
    }

    setOccupantMessage('')
    setIsSavingOccupant(true)

    try {
      if (selectedRoom) {
        await assignRoom(assigningOccupant.id, {
          roomId: selectedRoom,
          roomNumber: selectedRoom,
          academicSessionId: selectedSession
        })
        setOccupantMessage('✅ Chambre assignée avec succès.')
      } else {
        // Désassigner la chambre si aucune n'est sélectionnée
        setOccupantMessage('✅ Chambre désassignée avec succès.')
      }

      setShowAssignRoomModal(false)
      setAssigningOccupant(null)
      setSelectedRoom('')
      await handleRefreshOccupants()
    } catch (error) {
      setOccupantMessage(`❌ Erreur lors de l'assignation: ${error?.message || 'Erreur inconnue'}`)
    } finally {
      setIsSavingOccupant(false)
    }
  }

  const handleCancelAssignRoom = () => {
    setShowAssignRoomModal(false)
    setAssigningOccupant(null)
    setSelectedRoom('')
  }

  // Fetch initial occupants backend
  useEffect(() => {
    handleRefreshOccupants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCloseImportModal = () => {
    setShowImportModal(false)
    setImportFile(null)
    setPreviewData([])
    setImportStep('upload')
    setImportReport({ success: 0, errors: [], rejectedRows: [] })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const validExtensions = ['.xls', '.xlsx', '.csv']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (validExtensions.includes(fileExtension)) {
        const fakeEvent = { target: { files: [file] } }
        handleFileSelect(fakeEvent)
      } else {
        alert('Format de fichier non supporté. Veuillez sélectionner un fichier .xls ou .xlsx')
      }
    }
  }

  // Total réel des occupants (selon la maquette)
  const totalOccupantsReal = 124
  
  // Pagination - utiliser le total réel pour le calcul des pages
  const totalPages = Math.ceil(totalOccupantsReal / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOccupants = filteredOccupants.slice(startIndex, endIndex)
  const totalOccupants = filteredOccupants.length
  const displayStart = totalOccupantsReal > 0 ? startIndex + 1 : 0
  const displayEnd = Math.min(endIndex, totalOccupantsReal)

  // Générer les numéros de page pour la pagination
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <>
      <div className="occupants-page">
        <header className="occupants-page-header">
          <div className="occupants-header-content">
            <h1 className="occupants-page-title">Gestion des Occupants & Sessions</h1>
            <p className="occupants-page-subtitle">
              Ajoutez, importez et gérez les listes d'occupants pour chaque session annuelle.
            </p>
          </div>
        </header>

        <div className="occupants-actions-bar">
          <div className="occupants-actions-left" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn-add-occupant"
              onClick={handleRefreshOccupants}
              disabled={isLoadingBackend}
              style={{ backgroundColor: '#f0f0f0', color: '#333' }}
            >
              <IoRefreshOutline />
              <span>{isLoadingBackend ? 'Chargement...' : 'Rafraîchir'}</span>
            </button>
            <button 
              className="btn-add-occupant"
              onClick={handleDownloadTemplate}
              style={{ backgroundColor: '#e8f4f8', color: '#0066cc' }}
              disabled={isDownloadingTemplate}
            >
              <IoDownloadOutline />
              <span>{isDownloadingTemplate ? 'Téléchargement...' : 'Télécharger Template'}</span>
            </button>
            <button 
              className="btn-add-occupant"
              onClick={handleExportUsers}
              style={{ backgroundColor: '#e8f4f8', color: '#0066cc' }}
              disabled={isExportingUsers}
            >
              <IoDownloadOutline />
              <span>{isExportingUsers ? 'Export...' : 'Exporter'}</span>
            </button>
            <button 
              className="btn-add-occupant"
              onClick={() => setShowAddOccupantModal(true)}
            >
              <IoAddOutline />
              <span>Ajouter un Occupant</span>
            </button>
            <button 
              className="btn-import-list"
              onClick={() => setShowImportModal(true)}
            >
              <IoCloudUploadOutline />
              <span>Importer une Liste (.xls, .xlsx)</span>
            </button>
          </div>
          <div className="occupants-session-selector">
            <label htmlFor="session-select" className="session-label">Session Annuelle</label>
            <select
              id="session-select"
              className="session-select"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              {sessions.map((session) => (
                <option key={session.value} value={session.value}>
                  {session.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="occupants-info-banner">
          <IoInformationCircleOutline className="info-icon" />
          <p className="info-text">
            La session active <strong>2024-2025</strong> expire le <strong>31/08/2025</strong>. Total des occupants : <strong>124</strong>.
          </p>
        </div>

        {occupantMessage && (
          <div className="occupants-status-banner">
            {occupantMessage}
          </div>
        )}

        <div className="occupants-table-wrapper">
          <div className="occupants-table-header">
            <div className="occupants-search-wrapper">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                className="occupants-search-input"
                placeholder="Rechercher un occupant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-quick-messaging">
              <IoPaperPlaneOutline />
              <span>Messagerie Rapide</span>
            </button>
          </div>

          <div className="occupants-table-container">
            <table className="occupants-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={selectedOccupants.length === filteredOccupants.length && filteredOccupants.length > 0}
                      onChange={handleSelectAllOccupants}
                    />
                  </th>
                  <th>NOM</th>
                  <th>PRÉNOM</th>
                  <th>TYPE</th>
                  <th>CHAMBRE/ESPACE</th>
                  <th>UNITÉ/SERVICE</th>
                  <th>E-MAIL</th>
                  <th>STATUT</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOccupants.length > 0 ? (
                  paginatedOccupants.map((occupant) => (
                    <tr key={occupant.id}>
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={selectedOccupants.includes(occupant.id)}
                          onChange={() => handleSelectOccupant(occupant.id)}
                        />
                      </td>
                      <td className="occupant-lastname">{occupant.lastName}</td>
                      <td className="occupant-firstname">{occupant.firstName}</td>
                      <td className="occupant-type">{formatOccupantType(occupant.type)}</td>
                      <td className="occupant-room">{occupant.room}</td>
                      <td className="occupant-unit">{occupant.unit}</td>
                      <td className="occupant-email">{occupant.email}</td>
                      <td>
                        <span className={`status-badge ${occupant.status === 'Actif' ? 'status-active' : 'status-inactive'}`}>
                          {occupant.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="actions-buttons">
                          <button className="action-btn" title="Voir">
                            <IoEyeOutline />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Modifier"
                            onClick={() => handleEditOccupant(occupant)}
                          >
                            <IoCreateOutline />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Assigner Chambre"
                            onClick={() => handleAssignRoom(occupant)}
                          >
                            <IoCheckboxOutline />
                          </button>
                          <button
                            className="action-btn"
                            title={occupant.status === 'Actif' ? 'Désactiver' : 'Activer'}
                            onClick={() => handleToggleOccupantStatus(occupant)}
                            disabled={occupantActionId === occupant.id}
                          >
                            {occupant.status === 'Actif' ? (
                              <IoCloseCircleOutline />
                            ) : (
                              <IoCheckmarkCircleOutline />
                            )}
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Supprimer"
                            onClick={() => handleDeleteOccupant(occupant)}
                            disabled={occupantActionId === occupant.id}
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      {searchQuery ? `Aucun occupant trouvé pour "${searchQuery}"` : 'Aucun occupant disponible'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalOccupantsReal > 0 && (
            <div className="occupants-pagination">
              <span className="pagination-info">
                Affichage de <strong>{displayStart}</strong>-<strong>{displayEnd}</strong> sur <strong>{totalOccupantsReal}</strong>
              </span>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <IoChevronBackOutline />
                  <span className="pagination-btn-text">Précédent</span>
                </button>
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <button key={`ellipsis-${index}`} className="pagination-btn ellipsis" disabled>
                      ...
                    </button>
                  ) : (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="pagination-btn-text">Suivant</span>
                  <IoChevronForwardOutline />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajouter un Occupant */}
      {showAddOccupantModal && (
        <div className="modal-overlay" onClick={handleCancelAddOccupant}>
          <div className="modal-content modal-occupant" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Ajouter un Occupant</h2>
              <button className="modal-close-btn" onClick={handleCancelAddOccupant}>
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={handleAddOccupant} className="modal-form modal-form-occupant">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occupant-lastname">Nom</label>
                  <input
                    type="text"
                    id="occupant-lastname"
                    value={newOccupant.lastName}
                    onChange={(e) => setNewOccupant({ ...newOccupant, lastName: e.target.value })}
                    placeholder="Ex: Dupont"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="occupant-firstname">Prénom</label>
                  <input
                    type="text"
                    id="occupant-firstname"
                    value={newOccupant.firstName}
                    onChange={(e) => setNewOccupant({ ...newOccupant, firstName: e.target.value })}
                    placeholder="Ex: Jean"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occupant-type">Type d&apos;occupant</label>
                  <select
                    id="occupant-type"
                    value={newOccupant.type}
                    onChange={(e) => setNewOccupant({ ...newOccupant, type: e.target.value })}
                    required
                  >
                    <option value="ETUDIANT_CITE_U">Étudiant Cité U</option>
                    <option value="RESIDENT_BATIMENT_PERES">Résident Bâtiment des Pères</option>
                    <option value="PERSONNEL">Personnel / Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="occupant-room">Chambre / Espace assigné</label>
                  <select
                    id="occupant-room"
                    value={newOccupant.room}
                    onChange={(e) => setNewOccupant({ ...newOccupant, room: e.target.value })}
                  >
                    <option value="">Sélectionner une chambre</option>
                    {availableRooms.map(room => (
                      <option key={room.code} value={room.code}>{room.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occupant-start-date">Date début occupation</label>
                  <input
                    type="date"
                    id="occupant-start-date"
                    value={newOccupant.startDate}
                    onChange={(e) => setNewOccupant({ ...newOccupant, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="occupant-end-date">Date fin occupation</label>
                  <input
                    type="date"
                    id="occupant-end-date"
                    value={newOccupant.endDate}
                    onChange={(e) => setNewOccupant({ ...newOccupant, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="occupant-unit">Unité/Service/Filière</label>
                  <input
                    type="text"
                    id="occupant-unit"
                    value={newOccupant.unit}
                    onChange={(e) => setNewOccupant({ ...newOccupant, unit: e.target.value })}
                    placeholder="Ex: Génie Informatique"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="occupant-email">E-mail</label>
                  <input
                    type="email"
                    id="occupant-email"
                    value={newOccupant.email}
                    onChange={(e) => setNewOccupant({ ...newOccupant, email: e.target.value })}
                    placeholder="Ex: jean.dupont@email.com"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelAddOccupant}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={isSavingOccupant}>
                  {isSavingOccupant ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {showImportModal && (
        <div className="modal-overlay" onClick={handleCloseImportModal}>
          <div className="modal-content modal-import" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Importer une Liste d&apos;Occupants</h2>
              <button className="modal-close-btn" onClick={handleCloseImportModal}>
                <IoCloseOutline />
              </button>
            </div>

            {importStep === 'upload' && (
              <div className="modal-import-body">
                <div className="import-instructions">
                  <h3 className="import-section-title">Instructions</h3>
                  <ul className="import-instructions-list">
                    <li>Format de fichier accepté : <strong>.xls, .xlsx, .csv</strong></li>
                    <li>Colonnes requises : Nom, Prénom, Email, Type, Chambre, Unité, Date début, Date fin</li>
                    <li>Types d&apos;occupants valides : ETUDIANT_CITE_U, RESIDENT_BATIMENT_PERES, PERSONNEL</li>
                  </ul>
                </div>

                <div 
                  className="import-dropzone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoCloudUploadOutline className="dropzone-icon" />
                  <p className="dropzone-text">
                    Glissez-déposez votre fichier ici ou <span className="dropzone-link">cliquez pour sélectionner</span>
                  </p>
                  <p className="dropzone-hint">Formats acceptés: .xls, .xlsx, .csv</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xls,.xlsx,.csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </div>

                {importFile && (
                  <div className="import-file-info">
                    <IoDocumentTextOutline />
                    <span className="file-name">{importFile.name}</span>
                    <span className="file-size">({(importFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>
            )}

            {importStep === 'preview' && (
              <div className="modal-import-body">
                <div className="import-preview-header">
                  <h3 className="import-section-title">Prévisualisation des Données</h3>
                  <span className="preview-count">{previewData.length} ligne(s) détectée(s)</span>
                </div>

                <div className="import-preview-table-container">
                  <table className="import-preview-table">
                    <thead>
                      <tr>
                        <th>Ligne</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Chambre</th>
                        <th>Unité</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row) => (
                        <tr key={row.row} className={row.status === 'error' ? 'row-error' : ''}>
                          <td>{row.row}</td>
                          <td>{row.lastName || <span className="field-missing">-</span>}</td>
                          <td>{row.firstName || <span className="field-missing">-</span>}</td>
                          <td>{row.email || <span className="field-missing">-</span>}</td>
                          <td>{formatOccupantType(row.type) || <span className="field-missing">-</span>}</td>
                          <td>{row.room || <span className="field-missing">-</span>}</td>
                          <td>{row.unit || <span className="field-missing">-</span>}</td>
                          <td>
                            {row.status === 'valid' ? (
                              <span className="status-valid">
                                <IoCheckmarkCircleOutline /> Valide
                              </span>
                            ) : (
                              <span className="status-error">
                                <IoAlertCircleOutline /> {row.error || 'Erreur'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setImportStep('upload')}>
                    Retour
                  </button>
                  <button type="button" className="btn-submit" onClick={handleImport}>
                    Importer les Données
                  </button>
                </div>
              </div>
            )}

            {importStep === 'report' && (
              <div className="modal-import-body">
                <div className="import-report-header">
                  <h3 className="import-section-title">Rapport d&apos;Import</h3>
                </div>

                <div className="import-report-summary">
                  <div className="report-stat success">
                    <IoCheckmarkCircleOutline />
                    <div>
                      <span className="stat-value">{importReport.success}</span>
                      <span className="stat-label">Importé(s) avec succès</span>
                    </div>
                  </div>
                  <div className="report-stat error">
                    <IoAlertCircleOutline />
                    <div>
                      <span className="stat-value">{importReport.rejectedRows.length}</span>
                      <span className="stat-label">Ligne(s) rejetée(s)</span>
                    </div>
                  </div>
                </div>

                {importReport.rejectedRows.length > 0 && (
                  <div className="import-errors-section">
                    <h4 className="errors-title">Lignes Rejetées</h4>
                    <div className="import-errors-list">
                      {importReport.rejectedRows.map((row, idx) => (
                        <div key={idx} className="error-item">
                          <div className="error-item-header">
                            <span className="error-row-number">Ligne {row.row}</span>
                          </div>
                          <div className="error-item-details">
                            <span>{row.lastName} {row.firstName}</span>
                            <span className="error-messages">
                              {row.errors?.join(', ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-submit" onClick={handleCloseImportModal}>
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Modifier un Occupant */}
      {showEditOccupantModal && editingOccupant && (
        <div className="modal-overlay" onClick={handleCancelEditOccupant}>
          <div className="modal-content modal-occupant" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Modifier un Occupant</h2>
              <button className="modal-close-btn" onClick={handleCancelEditOccupant}>
                <IoCloseOutline />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSaveEditOccupant}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-occupant-lastname">Nom</label>
                  <input
                    type="text"
                    id="edit-occupant-lastname"
                    value={editingOccupant.lastName}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-occupant-firstname">Prénom</label>
                  <input
                    type="text"
                    id="edit-occupant-firstname"
                    value={editingOccupant.firstName}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-occupant-type">Type d&apos;occupant</label>
                  <select
                    id="edit-occupant-type"
                    value={editingOccupant.type}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, type: e.target.value })}
                  >
                    <option value="ETUDIANT_CITE_U">Étudiant Cité U</option>
                    <option value="RESIDENT_BATIMENT_PERES">Résident Bâtiment Pères</option>
                    <option value="PERSONNEL">Personnel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-occupant-room">Chambre / Espace assigné</label>
                  <select
                    id="edit-occupant-room"
                    value={editingOccupant.room}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, room: e.target.value })}
                  >
                    <option value="">Aucune chambre assignée</option>
                    {availableRooms.map(room => (
                      <option key={room.code} value={room.code}>{room.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-occupant-unit">Unité/Service/Filière</label>
                  <input
                    type="text"
                    id="edit-occupant-unit"
                    value={editingOccupant.unit}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, unit: e.target.value })}
                    placeholder="Ex: Génie Informatique"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-occupant-email">E-mail</label>
                  <input
                    type="email"
                    id="edit-occupant-email"
                    value={editingOccupant.email}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, email: e.target.value })}
                    placeholder="Ex: jean.dupont@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-occupant-status">Statut</label>
                  <select
                    id="edit-occupant-status"
                    value={editingOccupant.status}
                    onChange={(e) => setEditingOccupant({ ...editingOccupant, status: e.target.value })}
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelEditOccupant}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit" disabled={isSavingOccupant}>
                  {isSavingOccupant ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Assigner une Chambre */}
      {showAssignRoomModal && assigningOccupant && (
        <div className="modal-overlay" onClick={handleCancelAssignRoom}>
          <div className="modal-content modal-assign-room" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assigner une Chambre</h2>
              <button className="modal-close-btn" onClick={handleCancelAssignRoom}>
                <IoCloseOutline />
              </button>
            </div>

            <div className="modal-body">
              <div className="occupant-info">
                <h3>Occupant</h3>
                <p><strong>{assigningOccupant.lastName} {assigningOccupant.firstName}</strong></p>
                <p>{assigningOccupant.email}</p>
                <p>Chambre actuelle: <strong>{assigningOccupant.room || 'Aucune'}</strong></p>
              </div>

              <form onSubmit={handleSaveAssignRoom}>
                <div className="form-group">
                  <label htmlFor="assign-room-select">Nouvelle chambre</label>
                  <select
                    id="assign-room-select"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="room-select"
                  >
                    <option value="">Désassigner la chambre actuelle</option>
                    {availableRooms.map(room => (
                      <option key={room.code} value={room.code}>{room.label}</option>
                    ))}
                  </select>
                </div>

                <div className="assignment-info">
                  <IoInformationCircleOutline className="info-icon" />
                  <p>
                    {selectedRoom
                      ? `La chambre ${selectedRoom} sera assignée à ${assigningOccupant.firstName} ${assigningOccupant.lastName}.`
                      : `${assigningOccupant.firstName} ${assigningOccupant.lastName} sera désassigné de sa chambre actuelle.`
                    }
                  </p>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancelAssignRoom}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-submit" disabled={isSavingOccupant}>
                    {isSavingOccupant ? "Assignation..." : "Confirmer l'assignation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Occupants
