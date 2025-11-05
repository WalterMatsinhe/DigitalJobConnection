import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'company'
  companyName?: string
  phone?: string
  location?: string
  headline?: string
  bio?: string
  skills?: string[]
  experience?: string
  education?: string
  portfolio?: string
  avatar?: string
  industry?: string
  website?: string
  description?: string
  logo?: string
  employees?: number
  foundedYear?: number
  social?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
