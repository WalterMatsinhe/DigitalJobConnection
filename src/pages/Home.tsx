import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}! 🎉</h1>
          <p className="text-gray-600 text-lg">You're logged in as a {user?.role === 'company' ? 'Company' : 'Job Seeker'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to={user?.role === 'company' ? '/company-dashboard' : '/user-dashboard'} className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Go to Dashboard</h2>
            <p className="text-gray-600">Access your personalized dashboard</p>
          </Link>

          <Link to={user?.role === 'company' ? '/post-job' : '/jobs'} className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.role === 'company' ? 'Post a Job' : 'Browse Jobs'}</h2>
            <p className="text-gray-600">{user?.role === 'company' ? 'Create new job postings' : 'Explore available opportunities'}</p>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 rounded-lg overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Digital Job Connection</h1>
          <p className="text-xl text-gray-200 mb-8">Connecting Kenyan youth with employers, mentors, and entrepreneurship resources</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="px-6 py-3 bg-white text-gray-800 font-bold rounded-lg hover:bg-gray-100 transition">
              Get Started
            </Link>
            <Link to="/jobs" className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-gray-900 transition">
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">For Job Seekers</h3>
          <p className="text-gray-600">Find your dream job, connect with mentors, and grow your career in Kenya's tech industry.</p>
          <Link to="/register" className="text-gray-800 font-medium mt-4 inline-block hover:text-gray-600">Join as Job Seeker →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">For Companies</h3>
          <p className="text-gray-600">Post jobs, find top talent, and build your dream team with qualified candidates.</p>
          <Link to="/register?role=company" className="text-gray-800 font-medium mt-4 inline-block hover:text-gray-600">Register Company →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mentorship</h3>
          <p className="text-gray-600">Learn from experienced professionals and get guidance to accelerate your career.</p>
          <Link to={isAuthenticated ? "/mentors" : "/login?from=/mentors"} className="text-gray-800 font-medium mt-4 inline-block hover:text-gray-600">Find Mentors →</Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 p-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-6">Join thousands of professionals in Kenya</p>
        <Link to="/register" className="inline-block px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition">
          Sign Up Now
        </Link>
      </div>
    </div>
  )
}
