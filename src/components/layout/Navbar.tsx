import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <span 
              className="text-3xl font-bold hidden sm:inline" 
              style={{ 
                fontFamily: "'Caveat', cursive", 
                letterSpacing: '0.1em',
                textShadow: '0 0 6px rgba(59, 130, 246, 0.4)',
                filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.25))'
              }}
            >
              Digital Job Connection
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-12">
            {isAuthenticated && (
              <>
                <Link to="/" className="hover:text-gray-300 transition font-medium">Home</Link>
                {user?.role === 'user' && (
                  <>
                    <Link to="/user-dashboard" className="hover:text-gray-300 transition font-medium">Dashboard</Link>
                    <Link to="/jobs" className="hover:text-gray-300 transition font-medium">Jobs</Link>
                  </>
                )}
                {user?.role === 'company' && (
                  <>
                    <Link to="/company-dashboard" className="hover:text-gray-300 transition font-medium">Dashboard</Link>
                    <Link to="/post-job" className="hover:text-gray-300 transition font-medium">Post Job</Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hidden sm:inline-block px-4 py-2 text-blue-600 font-semibold rounded-lg hover:text-blue-700 hover:scale-105 transition">
                  Login
                </Link>
                <Link to="/register" className="hidden sm:inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:scale-105 hover:text-white transition">
                  Register
                </Link>
              </>
            ) : (
              <>

                <Link 
                  to="/profile" 
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition hover:scale-110 group relative overflow-hidden border-2 border-white"
                  title="View Profile"
                >
                  {user?.avatar && user.avatar.startsWith('data:') ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : user?.logo && user.logo.startsWith('data:') ? (
                    <img 
                      src={user.logo} 
                      alt={user?.companyName || 'Company Logo'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                    Profile
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-block px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
