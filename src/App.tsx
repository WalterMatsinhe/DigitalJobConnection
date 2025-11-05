import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Profile from './pages/Profile'
import PostJob from './pages/PostJob'
import Mentors from './pages/Mentors'
import Register from './pages/Register'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import ToastContainer from './components/layout/ToastContainer'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />

          <main className="flex-1 py-10">
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Protected Routes */}
                <Route path="/user-dashboard" element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/company-dashboard" element={
                  <ProtectedRoute requiredRole="company">
                    <CompanyDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/post-job" element={
                  <ProtectedRoute requiredRole="company">
                    <PostJob />
                  </ProtectedRoute>
                } />
              </Routes>
            </Container>
          </main>

          <Footer />
          <ToastContainer />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
