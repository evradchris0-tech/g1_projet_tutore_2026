import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) {
    // Rediriger vers la page de login si non authentifié
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
