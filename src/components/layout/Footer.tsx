import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-gray-800 font-bold text-xs">DJC</span>
            </div>
            <span className="text-sm font-bold hidden sm:inline">Digital Job Connection</span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs">
            <a href="#" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms</a>
            <a href="#" className="hover:text-gray-300 transition">Contact</a>
          </nav>

          {/* Social & Copyright */}
          <div className="flex items-center space-x-4">
            <div className="flex gap-2 text-xs">
              <a href="#" className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition">f</a>
              <a href="#" className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition">in</a>
              <a href="#" className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition">𝕏</a>
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">© {new Date().getFullYear()} DJC</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
