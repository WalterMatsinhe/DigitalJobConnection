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
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const redirectTo = searchParams.get('from') || null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post('/login', { email, password })
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
        addToast(res.data?.message || 'Login failed', 'error')
      }
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Server error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}
