import { createContext, useContext, useState, useEffect } from 'react'

// Structure d'une notification
// {
//   id: string,
//   type: 'incident_created' | 'incident_updated' | 'incident_resolved' | 'user_added' | 'system_alert',
//   title: string,
//   message: string,
//   timestamp: Date,
//   read: boolean,
//   priority: 'low' | 'medium' | 'high',
//   iconBg: string,
//   iconColor: string,
//   actionUrl?: string,
//   metadata?: any
// }

const NotificationsContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        // Convertir les timestamps string en Date objects
        const notificationsWithDates = parsed.map(notification => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }))
        setNotifications(notificationsWithDates)
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error)
        // En cas d'erreur, utiliser les données par défaut
        initializeDefaultNotifications()
      }
    } else {
      initializeDefaultNotifications()
    }
  }, [])

  // Sauvegarder les notifications dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
    // Calculer le nombre de notifications non lues
    const unread = notifications.filter(notification => !notification.read).length
    setUnreadCount(unread)
  }, [notifications])

  // Initialiser avec des notifications par défaut
  const initializeDefaultNotifications = () => {
    const defaultNotifications = [
      {
        id: '1',
        type: 'incident_created',
        title: 'Nouvel incident créé',
        message: "Nouvel incident #123 créé pour 'Serveur Principal'",
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // il y a 2 minutes
        read: false,
        priority: 'high',
        iconBg: '#fee2e2',
        iconColor: '#dc2626',
        actionUrl: '/incident'
      },
      {
        id: '2',
        type: 'incident_updated',
        title: 'Incident mis à jour',
        message: "Le statut de l'incident #121 est passé à 'En cours'",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // il y a 15 minutes
        read: false,
        priority: 'medium',
        iconBg: '#fef3c7',
        iconColor: '#92400e',
        actionUrl: '/incident'
      },
      {
        id: '3',
        type: 'incident_resolved',
        title: 'Incident résolu',
        message: "L'incident #119 a été résolu",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // il y a 1 heure
        read: false,
        priority: 'low',
        iconBg: '#dcfce7',
        iconColor: '#166534',
        actionUrl: '/incident'
      },
      {
        id: '4',
        type: 'user_added',
        title: 'Nouvel utilisateur',
        message: "Un nouvel utilisateur 'Alice Martin' a été ajouté",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // il y a 3 heures
        read: true,
        priority: 'low',
        iconBg: '#dbeafe',
        iconColor: '#1d4ed8',
        actionUrl: '/agent'
      }
    ]
    setNotifications(defaultNotifications)
  }

  // Ajouter une nouvelle notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Marquer une notification comme lue
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  // Supprimer une notification
  const removeNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  // Obtenir les notifications récentes (avec limite)
  const getRecentNotifications = (limit = 10) => {
    return notifications.slice(0, limit)
  }

  // Obtenir les notifications non lues
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read)
  }

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getRecentNotifications,
    getUnreadNotifications
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}