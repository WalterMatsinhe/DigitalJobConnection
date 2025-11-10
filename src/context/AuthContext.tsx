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
        const parsedUser = JSON.parse(stored)
        console.log('🔄 Restoring user from localStorage:', parsedUser)
        // Ensure user has id field
        if (!parsedUser.id && parsedUser._id) {
          parsedUser.id = parsedUser._id
          localStorage.setItem('user', JSON.stringify(parsedUser))
        }
        setUser(parsedUser)
      } catch (err) {
        console.error('❌ Failed to parse stored user:', err)
        localStorage.removeItem('user')
      }
    } else {
      console.log('ℹ️ No user found in localStorage')
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    console.log('🔐 Login: storing user with id:', userData.id)
    // Ensure id field exists
    const userWithId = {
      ...userData,
      id: userData.id || userData._id || (userData as any)._id
    }
    if (!userWithId.id) {
      console.error('❌ User object missing id field:', userData)
      throw new Error('User object must have an id field')
    }
    setUser(userWithId)
    localStorage.setItem('user', JSON.stringify(userWithId))
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      // Ensure id is never removed
      if (!updatedUser.id && user.id) {
        updatedUser.id = user.id
      }
      console.log('📝 Updating profile with id:', updatedUser.id)
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } else {
      console.warn('⚠️ Cannot update profile - no user logged in')
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
