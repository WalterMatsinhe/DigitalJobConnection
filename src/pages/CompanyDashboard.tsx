import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import ApplicationsModal from '../components/ApplicationsModal'

interface Job {
  _id: string
  title: string
  company: string
  location: string
  applications: any[]
  createdAt: string
  status: string
  jobType: string
  sector: string
}

interface CompanyProfile {
  name?: string
  email?: string
  companyName?: string
  industry?: string
  website?: string
  description?: string
  location?: string
  phone?: string
  logo?: string
  headline?: string
  bio?: string
}

export default function CompanyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [showApplicationsModal, setShowApplicationsModal] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        if (!user?.id) {
          setProfileLoading(false)
          return
        }

        const response = await fetch(`/api/profile/company/${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          setCompanyProfile(data.company)
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/jobs/company/${user?.id}`)
        const data = await response.json()
        
        if (data.success) {
          setJobs(data.jobs || [])
        } else {
          setError(data.message || 'Failed to fetch jobs')
        }
      } catch (err: any) {
        setError(err.message || 'Error loading jobs')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchJobs()
    }
  }, [user?.id])

  // Refetch jobs when component regains focus (e.g., returning from PostJob page)
  useEffect(() => {
    const handleFocus = async () => {
      try {
        const response = await fetch(`/api/jobs/company/${user?.id}`)
        const data = await response.json()
        
        if (data.success) {
          setJobs(data.jobs || [])
        }
      } catch (err) {
        console.error('Error refetching jobs:', err)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user?.id])

  const activeJobsCount = jobs.filter(j => j.status === 'Active').length
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0)

  // Calculate profile completeness
  const calculateProfileStrength = () => {
    if (!companyProfile) return 0
    let score = 0
    const fields = ['name', 'email', 'companyName', 'industry', 'website', 'location', 'phone', 'description', 'logo']
    const filledFields = fields.filter(field => {
      const value = companyProfile[field as keyof CompanyProfile]
      return value && value !== ''
    }).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const profileStrength = calculateProfileStrength()

  const handleViewApplications = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId)
    setSelectedJobTitle(jobTitle)
    setShowApplicationsModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {companyProfile?.name || user?.name}! 👋</h1>
        <p className="text-gray-600">Manage your company and job postings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 font-medium">Active Jobs</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{activeJobsCount}</div>
          <p className="text-sm text-gray-600 mt-2">Currently posted</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 font-medium">Applications</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{totalApplications}</div>
          <p className="text-sm text-gray-600 mt-2">Received applications</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 font-medium">Profile Completeness</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{profileLoading ? '...' : profileStrength}%</div>
          <p className="text-sm text-gray-600 mt-2">Complete your profile</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Posts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Job Posts</h2>
            <Link to="/post-job" className="text-gray-800 hover:text-gray-600 font-medium">+ New Post</Link>
          </div>
          
          {error && (
            <div className="bg-red-50 p-4 rounded mb-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
              <Link to="/post-job" className="text-gray-800 hover:text-gray-600 font-medium">Post your first job →</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {jobs.map((job) => (
                <div key={job._id} className="border border-gray-200 p-5 rounded-lg hover:shadow-lg transition flex gap-5 items-start">
                  {/* Company Logo - Larger */}
                  <div className="shrink-0 pt-1">
                    <img 
                      src={companyProfile?.logo || '/assets/company-default.png'} 
                      alt={companyProfile?.companyName || 'Company'} 
                      className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                    />
                  </div>
                  
                  {/* Job Details - Well Organized */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                          <span>📍 {job.location}</span>
                          <span>•</span>
                          <span>💼 {job.jobType}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 whitespace-nowrap ${job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    {/* Applications Count */}
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-900 font-medium">
                        📊 <span className="font-bold">{job.applications?.length || 0}</span> application{job.applications?.length !== 1 ? 's' : ''} received
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Link to={`/jobs/${job._id}`} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                        View Job
                      </Link>
                      <button 
                        onClick={() => handleViewApplications(job._id, job.title)}
                        className="px-4 py-2 text-sm border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium text-blue-600"
                      >
                        View Applications
                      </button>
                      <button 
                        onClick={() => navigate(`/post-job?edit=${job._id}`)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                      >
                        Edit Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-4">Company Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-gray-800 font-medium">{companyProfile?.companyName || user?.companyName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium text-sm">{companyProfile?.email || user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800 font-medium text-sm">{companyProfile?.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-800 font-medium text-sm">{companyProfile?.location || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="text-gray-800 font-medium text-sm">{companyProfile?.industry || 'Not set'}</p>
              </div>
              <Link to="/profile" className="block w-full text-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition font-medium">
                Edit Company Profile
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/post-job" className="block p-3 border border-gray-200 rounded hover:bg-gray-100 transition text-sm font-medium text-gray-800">
                Post New Job
              </Link>
              <button className="block w-full p-3 border border-gray-200 rounded hover:bg-gray-100 transition text-sm font-medium text-gray-800">
                View All Applications
              </button>
              <Link to="/profile" className="block p-3 border border-gray-200 rounded hover:bg-gray-100 transition text-sm font-medium text-gray-800">
                Manage Profile
              </Link>
            </div>
          </div>

          {/* Profile Completeness */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-4">Profile Completeness</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gray-800 h-2 rounded-full transition-all"
                style={{ width: `${profileStrength}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">{profileStrength}% Complete</p>
            <p className="text-xs text-gray-500 text-center mt-2">
              {profileStrength === 100 ? '✓ Profile fully completed!' : `${100 - profileStrength}% remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Applications Modal */}
      <ApplicationsModal
        jobId={selectedJobId || ''}
        jobTitle={selectedJobTitle}
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
      />
    </div>
  )
}
