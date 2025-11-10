import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <span 
              className="text-2xl sm:text-3xl font-bold" 
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {isAuthenticated && (
              <>
                <Link to="/" className="hover:text-gray-300 transition font-medium text-sm">Home</Link>
                {user?.role === 'user' && (
                  <>
                    <Link to="/user-dashboard" className="hover:text-gray-300 transition font-medium text-sm">Dashboard</Link>
                    <Link to="/jobs" className="hover:text-gray-300 transition font-medium text-sm">Jobs</Link>
                  </>
                )}
                {user?.role === 'company' && (
                  <>
                    <Link to="/company-dashboard" className="hover:text-gray-300 transition font-medium text-sm">Dashboard</Link>
                    <Link to="/post-job" className="hover:text-gray-300 transition font-medium text-sm">Post Job</Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="px-4 py-2 text-blue-400 text-sm hover:text-blue-300 transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition border-2 border-white"
                  title="View Profile"
                >
                  {user?.avatar && user.avatar.startsWith('data:') ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || 'Profile'} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : user?.logo && user.logo.startsWith('data:') ? (
                    <img 
                      src={user.logo} 
                      alt={user?.companyName || 'Company Logo'} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-gray-800 font-semibold text-sm rounded-lg hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-700 rounded transition"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile/Tablet Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900 pb-4 space-y-2 border-t border-gray-700">
            {isAuthenticated && (
              <>
                <Link 
                  to="/" 
                  className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {user?.role === 'user' && (
                  <>
                    <Link 
                      to="/user-dashboard" 
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/jobs" 
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Jobs
                    </Link>
                  </>
                )}
                {user?.role === 'company' && (
                  <>
                    <Link 
                      to="/company-dashboard" 
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/post-job" 
                      className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-700 mt-2 pt-2 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-blue-400 hover:bg-gray-800 rounded transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      navigate('/')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
