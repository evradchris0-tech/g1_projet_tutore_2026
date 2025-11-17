import React from 'react';
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

function ProtectedRoute({ children }) {
  // const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const { user } = useContext(AuthContext);
  if (!user) {
    // Rediriger vers la page de login si non authentifié
    return <Navigate to="/login" 
    // replace 
    />
  }

  return children;
}

export default ProtectedRoute
