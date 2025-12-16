import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './components/ForgotPassword'
import ResetForm from './components/ResetForm'
import './App.css'

function App() {
  const hasAccessToken = Boolean(localStorage.getItem('accessToken'))
  const isAuthenticated =
    localStorage.getItem('isAuthenticated') === 'true' && hasAccessToken

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
      <Route path="/reset-form" element={<ResetForm />} />
    </Routes>
  )
}

export default App

