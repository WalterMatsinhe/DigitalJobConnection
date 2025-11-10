import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'company'
  redirectTo?: string
}

export default function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const { addToast } = useToast()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    addToast('✗ Please login to access this page', 'error')
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    addToast(`✗ This page is only for ${requiredRole}s`, 'error')
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
