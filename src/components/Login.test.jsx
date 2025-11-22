import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'
import * as authApi from '../api/auth'

// Mock du module auth
vi.mock('../api/auth', () => ({
    login: vi.fn(),
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

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    const renderLogin = () => {
        return render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        )
    }

    it('devrait afficher le formulaire de connexion', () => {
        renderLogin()

        expect(screen.getByText(/Connectez-vous à la plateforme/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/nom d'utilisateur/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument()
    })

    it('devrait permettre de saisir le nom d\'utilisateur et le mot de passe', () => {
        renderLogin()

        const usernameInput = screen.getByPlaceholderText(/nom d'utilisateur/i)
        const passwordInput = screen.getByPlaceholderText(/mot de passe/i)

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        expect(usernameInput.value).toBe('testuser')
        expect(passwordInput.value).toBe('password123')
    })

    it('devrait appeler l\'API de connexion avec succès', async () => {
        const mockResponse = {
            data: {
                token: 'fake-token',
                user: { username: 'testuser' },
            },
        }
        authApi.login.mockResolvedValueOnce(mockResponse)

        renderLogin()

        const usernameInput = screen.getByPlaceholderText(/nom d'utilisateur/i)
        const passwordInput = screen.getByPlaceholderText(/mot de passe/i)
        const submitButton = screen.getByRole('button', { name: /connexion/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalledWith('testuser', 'password123')
            expect(localStorage.getItem('isAuthenticated')).toBe('true')
            expect(localStorage.getItem('username')).toBe('testuser')
            expect(localStorage.getItem('token')).toBe('fake-token')
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
        })
    })

    it('devrait afficher un message d\'erreur en cas d\'échec de connexion', async () => {
        const errorMessage = 'Identifiants incorrects'
        authApi.login.mockRejectedValueOnce({
            response: { data: { message: errorMessage } },
        })

        renderLogin()

        const usernameInput = screen.getByPlaceholderText(/nom d'utilisateur/i)
        const passwordInput = screen.getByPlaceholderText(/mot de passe/i)
        const submitButton = screen.getByRole('button', { name: /connexion/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument()
        })
    })

    it('devrait afficher un bouton de chargement pendant la connexion', async () => {
        authApi.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        renderLogin()

        const usernameInput = screen.getByPlaceholderText(/nom d'utilisateur/i)
        const passwordInput = screen.getByPlaceholderText(/mot de passe/i)
        const submitButton = screen.getByRole('button', { name: /connexion/i })

        fireEvent.change(usernameInput, { target: { value: 'testuser' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })
        fireEvent.click(submitButton)

        expect(screen.getByText(/connexion\.\.\./i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
    })

    it('devrait naviguer vers la page d\'inscription', () => {
        renderLogin()

        const signupLink = screen.getByText(/s'inscrire/i)
        fireEvent.click(signupLink)

        expect(mockNavigate).toHaveBeenCalledWith('/register')
    })
})