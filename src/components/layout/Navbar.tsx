import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition">
              <span className="text-pink-600 font-bold text-xl">DJC</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline">Digital Job Connection</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-pink-100 transition font-medium">Home</Link>
            <Link to="/jobs" className="hover:text-pink-100 transition font-medium">Jobs</Link>
            <Link to="/mentors" className="hover:text-pink-100 transition font-medium">Mentors</Link>
            <Link to="/profile" className="hover:text-pink-100 transition font-medium">Profile</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/post-job" className="hidden sm:inline-block px-4 py-2 bg-white text-pink-600 font-semibold rounded-lg hover:bg-pink-50 transition">
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
