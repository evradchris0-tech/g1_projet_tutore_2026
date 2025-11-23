import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Register from './Register'
import * as authApi from '../api/auth'

// Mock du module auth
vi.mock('../api/auth', () => ({
  register: vi.fn(),
}))

// Mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )
  }

  it("devrait afficher le formulaire d'inscription", () => {
    renderRegister()

    expect(screen.getByText(/Créer un compte administrateur/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Nom d'utilisateur/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Numéro de téléphone/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Nom de famille/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Prénom/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument()
  })

  it('devrait permettre de remplir le formulaire', () => {
    renderRegister()

    const usernameInput = screen.getByPlaceholderText(/Nom d'utilisateur/i)
    const phoneInput = screen.getByPlaceholderText(/Numéro de téléphone/i)
    const nomInput = screen.getByPlaceholderText(/Nom de famille/i)
    const prenomInput = screen.getByPlaceholderText(/Prénom/i)

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(phoneInput, { target: { value: '0123456789' } })
    fireEvent.change(nomInput, { target: { value: 'Doe' } })
    fireEvent.change(prenomInput, { target: { value: 'John' } })

    expect(usernameInput.value).toBe('testuser')
    expect(phoneInput.value).toBe('0123456789')
    expect(nomInput.value).toBe('Doe')
    expect(prenomInput.value).toBe('John')
  })

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    renderRegister()

    // Remplir les champs requis
    fireEvent.change(screen.getByPlaceholderText(/Nom d'utilisateur/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Numéro de téléphone/i), {
      target: { value: '0123456789' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Nom de famille/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: 'John' },
    })

    const passwordInputs = screen.getAllByPlaceholderText(/Mot de passe/i)
    const passwordInput = passwordInputs[0]
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirmer le mot de passe/i)

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })

    const submitButton = screen.getByRole('button', { name: /s'inscrire/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Les mots de passe ne correspondent pas/i)).toBeInTheDocument()
    })
  })

  it("devrait appeler l'API d'inscription avec succès", async () => {
    authApi.register.mockResolvedValueOnce({ data: { success: true } })

    renderRegister()

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText(/Nom d'utilisateur/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Numéro de téléphone/i), {
      target: { value: '0123456789' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Nom de famille/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: 'John' },
    })

    const passwordInputs = screen.getAllByPlaceholderText(/Mot de passe/i)
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText(/Confirmer le mot de passe/i), {
      target: { value: 'password123' },
    })

    const submitButton = screen.getByRole('button', { name: /s'inscrire/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        role: 'ADMIN',
        nom: 'Doe',
        prenom: 'John',
        phone: '0123456789',
        access: 'ADMIN',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it("devrait afficher un message d'erreur en cas d'échec d'inscription", async () => {
    const errorMessage = "Nom d'utilisateur déjà utilisé"
    authApi.register.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    })

    renderRegister()

    // Remplir le formulaire valide
    fireEvent.change(screen.getByPlaceholderText(/Nom d'utilisateur/i), {
      target: { value: 'existinguser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Numéro de téléphone/i), {
      target: { value: '0123456789' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Nom de famille/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: 'John' },
    })

    const passwordInputs = screen.getAllByPlaceholderText(/Mot de passe/i)
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText(/Confirmer le mot de passe/i), {
      target: { value: 'password123' },
    })

    const submitButton = screen.getByRole('button', { name: /s'inscrire/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('devrait naviguer vers la page de connexion', () => {
    renderRegister()

    const loginLink = screen.getByText(/Se connecter/i)
    fireEvent.click(loginLink)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('devrait désactiver le bouton pendant le chargement', async () => {
    authApi.register.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

    renderRegister()

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText(/Nom d'utilisateur/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Numéro de téléphone/i), {
      target: { value: '0123456789' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Nom de famille/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Prénom/i), {
      target: { value: 'John' },
    })

    const passwordInputs = screen.getAllByPlaceholderText(/Mot de passe/i)
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText(/Confirmer le mot de passe/i), {
      target: { value: 'password123' },
    })

    const submitButton = screen.getByRole('button', { name: /s'inscrire/i })
    fireEvent.click(submitButton)

    expect(screen.getByText(/inscription\.\.\./i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})
