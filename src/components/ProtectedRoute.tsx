import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'company'
  redirectTo?: string
}

export default function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
