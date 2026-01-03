import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const hasAccessToken = Boolean(localStorage.getItem('accessToken'))
  const isAuthenticated =
    localStorage.getItem('isAuthenticated') === 'true' && hasAccessToken

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
