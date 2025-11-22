import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoPersonOutline, IoLockClosedOutline, IoCallOutline, IoIdCardOutline } from 'react-icons/io5'
import { register } from '../api/auth'
import '../styles/Register.css'
import logo from '../assets/logo 1.png'
import backgroundImage from '../assets/saintjean 1.png'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
    nom: '',
    prenom: '',
    phone: '',
    access: 'ADMIN'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        nom: formData.nom,
        prenom: formData.prenom,
        phone: formData.phone,
        access: formData.access
      }
      
      await register(userData)
      navigate('/login')
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-background">
        <img src={backgroundImage} alt="Bâtiment IUSJ" className="background-image" />
        <div className="cyber-overlay">
          <div className="cyber-square cyber-square-1"></div>
          <div className="cyber-square cyber-square-2"></div>
          <div className="cyber-square cyber-square-3"></div>
          <div className="cyber-square cyber-square-4"></div>
          <div className="cyber-square cyber-square-5"></div>
          <div className="cyber-square cyber-square-6"></div>
        </div>
      </div>
      
      <div className="register-content">
        <div className="logo-section">
          <img src={logo} alt="IMMO360 CAMEROUN" className="logo-image" />
        </div>

        <div className="register-form-container">
          <h1 className="register-title">Créer un compte administrateur</h1>
          <p className="register-subtitle">Gestions d&apos;équipements de IUSJ</p>

          {error && (
            <div className="error-message" style={{color: '#ff4444', marginBottom: '1rem', textAlign: 'center'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="username">Nom d&apos;utilisateur</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nom d'utilisateur"
                    required
                  />
                  <IoPersonOutline className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Téléphone</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Numéro de téléphone"
                    required
                  />
                  <IoCallOutline className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="nom">Nom</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom de famille"
                    required
                  />
                  <IoIdCardOutline className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="prenom">Prénom</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                  />
                  <IoIdCardOutline className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required
                  />
                  <IoLockClosedOutline className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                  <IoLockClosedOutline className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="role">Rôle</label>
                <div className="input-wrapper">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="access">Accès</label>
                <div className="input-wrapper">
                  <select
                    id="access"
                    name="access"
                    value={formData.access}
                    onChange={handleChange}
                    required
                  >
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>

            <div className="login-link">
              <p>Déjà un compte ? <button type="button" onClick={() => navigate('/login')} className="link-button">Se connecter</button></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register