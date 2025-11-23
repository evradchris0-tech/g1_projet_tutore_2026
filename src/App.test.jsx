import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// Mock des composants
vi.mock('./components/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}))

vi.mock('./components/Register', () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}))

vi.mock('./components/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}))

vi.mock('./components/ProtectedRoute', () => ({
  default: ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuthenticated) {
      return <div data-testid="redirect-to-login">Redirecting to login</div>
    }
    return <div data-testid="protected-route">{children}</div>
  },
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('devrait afficher la page de login sur /login quand non authentifié', () => {
    localStorage.setItem('isAuthenticated', 'false')

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it("devrait afficher la page d'inscription sur /register quand non authentifié", () => {
    localStorage.setItem('isAuthenticated', 'false')

    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('register-page')).toBeInTheDocument()
  })

  it('devrait protéger la route /dashboard si non authentifié', () => {
    localStorage.setItem('isAuthenticated', 'false')

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )

    // ProtectedRoute devrait bloquer l'accès
    expect(screen.getByTestId('redirect-to-login')).toBeInTheDocument()
    expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument()
  })

  it('devrait afficher le dashboard quand authentifié', () => {
    localStorage.setItem('isAuthenticated', 'true')

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
  })

  it('devrait avoir les routes configurées correctement', () => {
    // Test simple de la structure de l'application
    localStorage.setItem('isAuthenticated', 'false')

    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )

    expect(container.firstChild).toBeTruthy()
  })
})
