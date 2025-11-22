import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

describe('ProtectedRoute Component', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    const TestComponent = () => <div data-testid="protected-content">Protected Content</div>

    it('devrait afficher le contenu protégé si l\'utilisateur est authentifié', () => {
        localStorage.setItem('isAuthenticated', 'true')

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })

    it('devrait rediriger vers /login si l\'utilisateur n\'est pas authentifié', () => {
        localStorage.setItem('isAuthenticated', 'false')

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })

    it('devrait rediriger vers /login si localStorage est vide', () => {
        // localStorage est déjà vide grâce au beforeEach

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div data-testid="login-page">Login</div>} />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
})