import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ForgotPassword.css'
import resetImage from '../assets/img6.png'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleRequestCode = (event) => {
    event.preventDefault()
    if (isLoading) return

    setErrorMessage('')

    if (!email || !isValidEmail(email)) {
      setErrorMessage('Veuillez saisir une adresse e-mail valide.')
      return
    }

    setIsLoading(true)

    // Simulation de l’envoi du code par e-mail
    setTimeout(() => {
      setIsLoading(false)
      setStep('code')
    }, 1200)
  }

  const handleVerifyCode = (event) => {
    event.preventDefault()
    if (isLoading) return

    setErrorMessage('')

    if (!code || code.trim().length < 4) {
      setErrorMessage('Veuillez saisir le code à 4 caractères reçu par e-mail.')
      return
    }

    setIsLoading(true)

    // Simulation de la vérification du code puis redirection vers la page de nouveau mot de passe
    setTimeout(() => {
      setIsLoading(false)
      navigate(`/reset-form?email=${encodeURIComponent(email)}`)
    }, 1200)
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="reset-page">
      <div className="reset-container">
        {/* Colonne gauche : image + message de sécurité */}
        <section className="reset-image-section" aria-label="Sécurité et confidentialité">
          <div className="reset-image-card">
            <img src={resetImage} alt="Sécurité des infrastructures" className="reset-hero-image" />
            <div className="reset-image-overlay">
              <div className="reset-image-content">
                <h3>Réinitialisation sécurisée</h3>
                <p>
                  Pour protéger votre compte, un code de vérification est envoyé à votre adresse e-mail.
                  Ne le partagez jamais avec une autre personne.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Colonne droite : formulaire */}
        <section className="reset-form-section">
          <div className="reset-card">
            <div className="reset-logo-section">
              <div className="reset-logo">
                <span className="reset-logo-icon">🔐</span>
              </div>
              <h1 className="reset-title">Mot de passe oublié</h1>
              <p className="reset-subtitle">
                Saisissez votre adresse e-mail pour recevoir un code de vérification
                puis entrez ce code ci‑dessous pour confirmer votre identité.
              </p>
              <div className="reset-info-box">
                <p>
                  Utilisez de préférence votre adresse institutionnelle afin de garantir
                  une meilleure traçabilité et sécurité de vos accès.
                </p>
              </div>
            </div>

            <form className="reset-form">
                <label className="reset-input-group">
                  <span className="reset-input-label">Adresse e-mail</span>
                  <input
                    type="email"
                    className="reset-input"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={step === 'code'}
                    autoComplete="email"
                    required
                  />
                </label>

                <div className="reset-warning-box">
                  <span className="reset-warning-icon">⚠</span>
                  <div>
                    <p className="reset-warning-title">Vérifiez votre boîte de réception</p>
                    <p className="reset-warning-text">
                      Un code temporaire sera envoyé à cette adresse. Si vous ne
                      voyez pas l’e-mail, pensez à vérifier vos dossiers &laquo; Spam &raquo; ou &laquo; Courrier indésirable &raquo;.
                    </p>
                  </div>
                </div>

                {step === 'code' && (
                  <label className="reset-input-group">
                    <span className="reset-input-label">Code de vérification</span>
                    <input
                      type="text"
                      className="reset-input"
                      placeholder="Entrez le code reçu"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      autoComplete="one-time-code"
                      required
                    />
                    <p className="reset-helper-text">
                      Saisissez le code que vous avez reçu par e-mail pour continuer la
                      réinitialisation de votre mot de passe.
                    </p>
                  </label>
                )}

                <button
                  type="button"
                  className="reset-primary-button"
                  onClick={step === 'email' ? handleRequestCode : handleVerifyCode}
                  disabled={isLoading}
                >
                  {isLoading && <span className="reset-spinner" aria-hidden="true" />}
                  {!isLoading && step === 'email' && 'Envoyer le code de réinitialisation'}
                  {!isLoading && step === 'code' && 'Valider le code'}
                </button>

                {errorMessage && (
                  <div className="reset-error-message">
                    <span className="reset-error-icon">!</span>
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button
                  type="button"
                  className="reset-back-link"
                  onClick={handleBackToLogin}
                >
                  &larr; Retour à la connexion
                </button>
              </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ForgotPassword


