import { useNavigate } from 'react-router-dom'
import {
  IoGridOutline,
  IoBusinessOutline,
  IoConstructOutline,
  IoPersonOutline,
  IoPeopleOutline,
  IoWarningOutline,
  IoLogOutOutline
} from 'react-icons/io5'
import logoImmo360 from '../assets/logo 1.png'
import '../styles/Sidebar.css'
import { logout as logoutRequest, clearAuthTokens } from '../services/auth'

function Sidebar({ activeMenu, setActiveMenu, onMenuChange }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutRequest()
    } catch (error) {
      // En cas d'échec serveur, on nettoie local et on redirige quand même
      clearAuthTokens()
    } finally {
      localStorage.removeItem('activeMenu')
      navigate('/login')
    }
  }

  const handleMenuClick = (menuId, extraAction) => {
    setActiveMenu(menuId)
    localStorage.setItem('activeMenu', menuId)
    if (onMenuChange) {
      onMenuChange(menuId)
    }
    if (extraAction) {
      extraAction()
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <img src={logoImmo360} alt="IMMO360 Cameroun" />
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">IUSJC</span>
            <span className="sidebar-brand-subtitle">Maintenance</span>
            <span className="sidebar-brand-admin">administration</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-menu">
        <button
          className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleMenuClick('dashboard')}
        >
          <IoGridOutline className="menu-icon" />
          <span className="menu-text">Tableau de bord</span>
        </button>

        <button
          className={`menu-item ${activeMenu === 'agent' ? 'active' : ''}`}
          onClick={() => handleMenuClick('agent')}
        >
          <IoPeopleOutline className="menu-icon" />
          <span className="menu-text">Gestion des agents</span>
        </button>

        <button
          className={`menu-item ${activeMenu === 'occupant' ? 'active' : ''}`}
          onClick={() => handleMenuClick('occupant')}
        >
          <IoPersonOutline className="menu-icon" />
          <span className="menu-text">
            Gestion des occupants
            <br />
            et sessions
          </span>
        </button>

        <button
          className={`menu-item ${activeMenu === 'batiment' ? 'active' : ''}`}
          onClick={() => handleMenuClick('batiment')}
        >
          <IoBusinessOutline className="menu-icon" />
          <span className="menu-text">
            Gestion des
            <br />
            Infrastructures
          </span>
        </button>

        <button
          className={`menu-item ${activeMenu === 'equipement' ? 'active' : ''}`}
          onClick={() => handleMenuClick('equipement')}
        >
          <IoConstructOutline className="menu-icon" />
          <span className="menu-text">
            Gestion des
            <br />
            Équipements
          </span>
        </button>

        <button
          className={`menu-item ${activeMenu === 'incident' ? 'active' : ''}`}
          onClick={() => handleMenuClick('incident')}
        >
          <IoWarningOutline className="menu-icon" />
          <span className="menu-text">Incidents ou Maintenance</span>
        </button>
      </nav>

      <button className="menu-item logout-btn" onClick={handleLogout}>
        <IoLogOutOutline className="menu-icon" />
        <span className="menu-text">Se déconnecter</span>
      </button>
    </aside>
  )
}

export default Sidebar

