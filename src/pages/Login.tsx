import React, { useState } from 'react'
import client from '../api/client'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const redirectTo = searchParams.get('from') || null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password')
      setLoading(false)
      return
    }
    
    try {
      console.log('📝 Login attempt:', { email })
      const res = await client.post('/login', { email: email.trim(), password })
      console.log('✅ Login response:', res.data)
      
      if (res.data?.success) {
        addToast('Login successful!', 'success', 1200)
        // Store user in context
        if (res.data.user) {
          login(res.data.user)
          // Redirect to intended page or dashboard
          setTimeout(() => {
            navigate(redirectTo || (res.data.user.role === 'company' ? '/company-dashboard' : '/user-dashboard'))
          }, 1200)
        }
      } else {
        setError(res.data?.message || 'Login failed')
      }
    } catch (err: any) {
      console.error('❌ Login error:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Server error'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            type="email"
            className="mt-1 block w-full border rounded p-2"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            type="password"
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </div>
      </form>
    </div>
  )
}
