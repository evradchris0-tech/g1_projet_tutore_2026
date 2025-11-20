import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoPersonOutline, IoLockClosedOutline } from 'react-icons/io5'
import { login } from '../api/auth'
import '../styles/Login.css'
import logo from '../assets/logo 1.png'
import backgroundImage from '../assets/saintjean 1.png'

function Login() {
  // const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await login(username, password)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', response.data.user?.username || username)
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de connexion. Vérifiez vos identifiants.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
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
      
      <div className="login-content">
        <div className="logo-section">
          <img src={logo} alt="IMMO360 CAMEROUN" className="logo-image" />
        </div>

        <div className="login-form-container">
          <h1 className="login-title">Connectez-vous à la plateforme</h1>
          <p className="login-subtitle">Gestions d'équipements de IUSJ</p>

          {error && (
            <div className="error-message" style={{color: '#ff4444', marginBottom: '1rem', textAlign: 'center'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            <div className="input-group">
              <label htmlFor="username">Nom de l'utilisateur</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  autoComplete="username"
                  required
                />
                <IoPersonOutline className="input-icon user-icon" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  autoComplete="new-password"
                  required
                />
                <IoLockClosedOutline className="input-icon lock-icon" />
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </form>

          <div className="login-links">
            <button 
              type="button" 
              className="link-button forgot-password"
              onClick={() => navigate('/forgot-password')}
            >
              Mot de passe oublié ?
            </button>
            
            <div className="signup-section">
              <span>Pas encore de compte ? </span>
              <button 
                type="button" 
                className="link-button signup-link"
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

