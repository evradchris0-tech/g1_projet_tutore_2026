import { useState } from 'react'
import {
  IoNotificationsOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
  IoCheckmarkDoneOutline,
  IoTrashOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5'
import { useNotifications } from '../contexts/NotificationsContext'
import '../styles/NotificationsPanel.css'

function NotificationsPanel({ isOpen, onClose }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getRecentNotifications
  } = useNotifications()

  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'

  // Filtrer les notifications selon le filtre sélectionné
  const getFilteredNotifications = () => {
    const allNotifications = getRecentNotifications(50) // Obtenir plus de notifications pour le panneau

    switch (filter) {
      case 'unread':
        return allNotifications.filter(notification => !notification.read)
      case 'read':
        return allNotifications.filter(notification => notification.read)
      default:
        return allNotifications
    }
  }

  const filteredNotifications = getFilteredNotifications()

  // Fonction pour obtenir l'icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'incident_created':
        return IoAlertCircleOutline
      case 'incident_updated':
        return IoTimeOutline
      case 'incident_resolved':
        return IoCheckmarkCircleOutline
      case 'user_added':
        return IoInformationCircleOutline
      default:
        return IoNotificationsOutline
    }
  }

  // Fonction pour formater le temps relatif
  const formatRelativeTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `il y a ${minutes}m`
    if (hours < 24) return `il y a ${hours}h`
    if (days < 7) return `il y a ${days}j`
    return timestamp.toLocaleDateString('fr-FR')
  }

  // Fonction pour obtenir la classe de priorité
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'notification-high'
      case 'medium':
        return 'notification-medium'
      case 'low':
        return 'notification-low'
      default:
        return 'notification-low'
    }
  }

  if (!isOpen) return null

  return (
    <div className="notifications-overlay" onClick={onClose}>
      <div className="notifications-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notifications-header">
          <div className="notifications-title">
            <IoNotificationsOutline />
            <h3>Centre de Notifications</h3>
            {unreadCount > 0 && (
              <span className="notifications-badge">{unreadCount}</span>
            )}
          </div>
          <button className="notifications-close" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        {/* Actions */}
        <div className="notifications-actions">
          <div className="notifications-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Toutes ({notifications.length})
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </button>
            <button
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Lues
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              className="mark-all-read-btn"
              onClick={markAllAsRead}
              title="Marquer toutes comme lues"
            >
              <IoCheckmarkDoneOutline />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Liste des notifications */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <IoNotificationsOutline />
              <p>
                {filter === 'unread'
                  ? 'Aucune notification non lue'
                  : filter === 'read'
                  ? 'Aucune notification lue'
                  : 'Aucune notification'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type)

              return (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                >
                  {/* Indicateur de non lu */}
                  {!notification.read && <div className="unread-indicator"></div>}

                  {/* Icône */}
                  <div
                    className="notification-icon"
                    style={{
                      backgroundColor: notification.iconBg,
                      color: notification.iconColor
                    }}
                  >
                    <IconComponent />
                  </div>

                  {/* Contenu */}
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.title}</h4>
                      <span className="notification-time">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="notification-message">{notification.message}</p>

                    {/* Actions */}
                    <div className="notification-actions">
                      {!notification.read && (
                        <button
                          className="notification-action mark-read"
                          onClick={() => markAsRead(notification.id)}
                          title="Marquer comme lu"
                        >
                          <IoCheckmarkOutline />
                        </button>
                      )}
                      <button
                        className="notification-action delete"
                        onClick={() => removeNotification(notification.id)}
                        title="Supprimer"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer avec statistiques */}
        <div className="notifications-footer">
          <div className="notifications-stats">
            <span>Total: {notifications.length}</span>
            <span>Non lues: {unreadCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsPanel