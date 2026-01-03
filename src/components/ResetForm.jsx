import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../styles/ResetForm.css'
import resetFormImage from '../assets/img4.png'

function ResetForm() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hidePassword, setHidePassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    // Exemple : si un token était réellement requis côté backend,
    // on pourrait bloquer l'accès ici si absent.
    // Pour l'instant, on laisse la page accessible même sans token.
    console.log('Token de réinitialisation (simulé) :', token)
  }, [token])

  const validatePasswordStrength = (value) => {
    if (!value || value.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères.'
    }
    return ''
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isLoading) return

    setErrorMessage('')

    const pwdError = validatePasswordStrength(newPassword)
    if (pwdError) {
      setErrorMessage(pwdError)
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.')
      return
    }

    setIsLoading(true)

    // Simulation de l'appel backend de réinitialisation avec token
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }, 1200)
  }

  return (
    <div className="resetform-page">
      <div className="resetform-container">
        {/* Colonne gauche - image */}
        <section className="resetform-image-section" aria-label="Sécurité du nouveau mot de passe">
          <div className="resetform-image-card">
            <img
              src={resetFormImage}
              alt="Illustration de sécurité"
              className="resetform-hero-image"
            />
            <div className="resetform-image-overlay">
              <div className="resetform-image-content">
                <h3>Nouveau départ</h3>
                <p>Votre sécurité, notre priorité.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Colonne droite - formulaire */}
        <section className="resetform-form-section">
          <div className="resetform-card">
            <div className="resetform-logo-section">
              <div className="resetform-logo">
                <span className="resetform-logo-icon">🔒</span>
              </div>
              <h1 className="resetform-title">Nouveau mot de passe</h1>
              <p className="resetform-subtitle">Finalisation de la récupération</p>
            </div>

            <div className="resetform-success-message">
              <span className="resetform-success-icon">✔</span>
              <span>
                Votre demande a été validée. Créez maintenant un mot de passe sécurisé
                pour votre compte{email ? ` (${email})` : ''}.
              </span>
            </div>

            <form className="resetform-form" onSubmit={handleSubmit}>
              <div className="resetform-input-group">
                <label className="resetform-input-label" htmlFor="new-password">
                  Nouveau mot de passe
                </label>
                <div className="resetform-input-wrapper">
                  <input
                    id="new-password"
                    type={hidePassword ? 'password' : 'text'}
                    className="resetform-input"
                    placeholder="Créez un mot de passe robuste"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="resetform-toggle-password"
                    onClick={() => setHidePassword((prev) => !prev)}
                    aria-label={hidePassword ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
                  >
                    {hidePassword ? '👁‍🗨' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="resetform-input-group">
                <label className="resetform-input-label" htmlFor="confirm-password">
                  Confirmer le mot de passe
                </label>
                <div className="resetform-input-wrapper">
                  <input
                    id="confirm-password"
                    type={hideConfirmPassword ? 'password' : 'text'}
                    className="resetform-input"
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="resetform-toggle-password"
                    onClick={() => setHideConfirmPassword((prev) => !prev)}
                    aria-label={
                      hideConfirmPassword
                        ? 'Afficher la confirmation du mot de passe'
                        : 'Masquer la confirmation du mot de passe'
                    }
                  >
                    {hideConfirmPassword ? '👁‍🗨' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="resetform-tips-box">
                <h3>Conseils de sécurité</h3>
                <ul>
                  <li>• Utilisez un mot de passe unique pour ce compte.</li>
                  <li>• Évitez les informations personnelles faciles à deviner.</li>
                  <li>• Changez votre mot de passe régulièrement.</li>
                  <li>• Ne partagez jamais vos identifiants.</li>
                </ul>
              </div>

              <button
                type="submit"
                className="resetform-primary-button"
                disabled={isLoading}
              >
                {isLoading && <span className="resetform-spinner" aria-hidden="true" />}
                {!isLoading && !isSuccess && 'Confirmer le nouveau mot de passe'}
                {!isLoading && isSuccess && 'Mot de passe mis à jour ✔'}
              </button>

              {errorMessage && (
                <div className="resetform-error-message">
                  <span className="resetform-error-icon">!</span>
                  <p>{errorMessage}</p>
                </div>
              )}

              <p className="resetform-footer-note">
                Après confirmation, vous serez automatiquement redirigé vers la page de connexion.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ResetForm


