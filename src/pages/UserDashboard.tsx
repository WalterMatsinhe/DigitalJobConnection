import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'
import JobCard from '../components/jobs/JobCard'

interface Job {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  sector: string
  salary: string
  createdAt: string
}

interface UserProfile {
  name?: string
  email?: string
  phone?: string
  location?: string
  headline?: string
  bio?: string
  skills?: string[]
  experience?: string
  education?: string
  portfolio?: string
  avatar?: string
}

export default function UserDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applications, setApplications] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        if (!user?.id) {
          setProfileLoading(false)
          return
        }

        const response = await fetch(`/api/profile/user/${user.id}`)
        const data = await response.json()
        
        if (data.success) {
          setUserProfile(data.user)
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
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch all jobs
        const jobsResponse = await fetch('/api/jobs')
        const jobsData = await jobsResponse.json()
        
        if (jobsData.success) {
          setJobs(jobsData.jobs || [])
        } else {
          setError(jobsData.message || 'Failed to fetch jobs')
        }

        // Fetch user applications
        const appsResponse = await fetch(`/api/applications/user/${user?.id}`)
        const appsData = await appsResponse.json()
        
        if (appsData.success) {
          setApplications(appsData.applications || [])
        }
      } catch (err: any) {
        setError(err.message || 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  // Refetch applications when component regains focus
  useEffect(() => {
    const handleFocus = async () => {
      try {
        const appsResponse = await fetch(`/api/applications/user/${user?.id}`)
        const appsData = await appsResponse.json()
        
        if (appsData.success) {
          setApplications(appsData.applications || [])
          setAppliedJobs(new Set(appsData.applications.map((a: any) => a.jobId)))
        }
      } catch (err) {
        console.error('Error refetching applications:', err)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user?.id])

  const [appliedJobs, setAppliedJobs] = useState(new Set(applications.map(a => a.jobId)))

  const handleApply = async (jobId: string) => {
    try {
      if (appliedJobs.has(jobId)) {
        addToast('You have already applied for this job', 'info')
        return
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          userId: user?.id,
          userName: user?.name,
          userEmail: user?.email,
          coverLetter: ''
        })
      })

      const data = await response.json()

      if (data.success) {
        setAppliedJobs(new Set([...appliedJobs, jobId]))
        addToast('Application submitted successfully!', 'success', 2000)
        
        // Refetch applications to update the list
        const appsResponse = await fetch(`/api/applications/user/${user?.id}`)
        const appsData = await appsResponse.json()
        if (appsData.success) {
          setApplications(appsData.applications || [])
        }
      } else {
        addToast(data.message || 'Failed to apply for job', 'error')
      }
    } catch (err: any) {
      addToast(err.message || 'Error applying for job', 'error')
    }
  }

  // Calculate profile completeness
  const calculateProfileStrength = () => {
    if (!userProfile) return 0
    let score = 0
    const fields = ['name', 'email', 'phone', 'location', 'headline', 'bio', 'experience', 'education', 'avatar']
    const filledFields = fields.filter(field => {
      const value = userProfile[field as keyof UserProfile]
      return value && value !== ''
    }).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const profileStrength = calculateProfileStrength()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {userProfile?.name || user?.name}! 👋</h1>
        <p className="text-gray-600">Your job seeking journey starts here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 font-medium">Applications</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{applications.length}</div>
          <p className="text-sm text-gray-600 mt-2">Active applications</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 font-medium">Available Jobs</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{jobs.length}</div>
          <p className="text-sm text-gray-600 mt-2">Positions available</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500 font-medium">Profile Strength</div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{profileLoading ? '...' : profileStrength}%</div>
          <p className="text-sm text-gray-600 mt-2">Complete your profile</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Jobs */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Available Jobs</h2>
            <Link to="/jobs" className="text-gray-800 hover:text-gray-600 font-medium">View All</Link>
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
              <p className="text-gray-600 mb-4">No jobs available at the moment</p>
              <p className="text-sm text-gray-500">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => {
                const jobId = job._id || job.id
                return (
                  <div key={jobId} className="relative">
                    <JobCard job={{...job, _id: jobId}} />
                    
                    {/* Apply Button Below Card */}
                    <div className="flex gap-2 mt-2 px-5">
                      <button
                        onClick={() => handleApply(jobId)}
                        disabled={appliedJobs.has(jobId)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          appliedJobs.has(jobId)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-md'
                        }`}
                      >
                        {appliedJobs.has(jobId) ? '✓ Applied' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-800 font-medium">{userProfile?.name || user?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium text-sm">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800 font-medium text-sm">{userProfile?.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-800 font-medium text-sm">{userProfile?.location || 'Not set'}</p>
              </div>
              <Link to="/profile" className="block w-full text-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition font-medium">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/jobs" className="block p-3 border border-gray-200 rounded hover:bg-gray-100 transition text-sm font-medium text-gray-800">
                Browse All Jobs
              </Link>
              <Link to="/profile" className="block p-3 border border-gray-200 rounded hover:bg-gray-100 transition text-sm font-medium text-gray-800">
                Update Profile
              </Link>
              <Link to="/mentors" className="block p-3 border border-gray-200 rounded hover:bg-gray-100 transition text-sm font-medium text-gray-800">
                Find Mentors
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-4">Recent Applications</h3>
            {applications.length === 0 ? (
              <p className="text-sm text-gray-600">No applications yet</p>
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="text-sm border-b pb-2">
                    <p className="font-medium text-gray-700 truncate">{app.jobId?.title || 'Job'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
