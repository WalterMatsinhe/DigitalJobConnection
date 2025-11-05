import React, { useState, useEffect } from 'react'
import client from '../api/client'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const [searchParams] = useSearchParams()
  const initialRole = (searchParams.get('role') as 'user' | 'company') || 'user'
  const [role, setRole] = useState<'user' | 'company'>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        location,
        ...(role === 'company' && { companyName, industry, website, description })
      }
      const res = await client.post('/register', payload)
      if (res.data?.success) {
        addToast('Registration successful! Redirecting to login...', 'success', 1500)
        setTimeout(() => navigate('/login'), 1500)
      } else {
        addToast(res.data?.message || 'Registration failed', 'error')
      }
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Server error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create an account</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder={role === 'company' ? 'Contact person name' : 'Your name'}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="mt-1 block w-full border rounded p-2"
            placeholder="+254 0000000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="user"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value as 'user' | 'company')}
                className="mr-2"
              />
              <span>Job Seeker</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="company"
                checked={role === 'company'}
                onChange={(e) => setRole(e.target.value as 'user' | 'company')}
                className="mr-2"
              />
              <span>Company</span>
            </label>
          </div>
        </div>

        {role === 'company' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                type="url"
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                rows={3}
              />
            </div>
          </>
        )}

        <div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  )
}

