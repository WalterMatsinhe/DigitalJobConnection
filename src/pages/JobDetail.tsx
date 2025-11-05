import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

interface Job {
  _id: string
  title: string
  company: string
  description: string
  requirements: string
  location: string
  jobType: string
  sector: string
  salary: string
  createdAt: string
  deadline: string
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        console.log('🔍 JobDetail: Fetching job with ID:', id)
        const response = await fetch(`/api/jobs/${id}`)
        const data = await response.json()
        console.log('📦 JobDetail: API Response:', data)
        
        if (data.success) {
          setJob(data.job)
          
          // Check if user has already applied
          if (user?.id && user?.role === 'user') {
            const appsResponse = await fetch(`/api/applications/user/${user.id}`)
            const appsData = await appsResponse.json()
            if (appsData.success) {
              const applied = appsData.applications.some((a: any) => a.jobId === id)
              setHasApplied(applied)
            }
          }
        } else {
          setError(data.message || 'Job not found')
        }
      } catch (err: any) {
        setError(err.message || 'Error loading job')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id, user?.id, user?.role])

  const handleApply = async () => {
    if (!user) {
      addToast('Please log in to apply for jobs', 'info')
      return
    }

    if (user.role !== 'user') {
      addToast('Only job seekers can apply for jobs', 'warning')
      return
    }

    if (hasApplied) {
      addToast('You have already applied for this job', 'info')
      return
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: job?._id,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          coverLetter: ''
        })
      })

      const data = await response.json()

      if (data.success) {
        setHasApplied(true)
        addToast('Application submitted successfully!', 'success', 2000)
      } else {
        addToast(data.message || 'Failed to apply for job', 'error')
      }
    } catch (err: any) {
      addToast(err.message || 'Error applying for job', 'error')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading job details...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{error || 'Job not found'}</h2>
        <button onClick={() => navigate('/jobs')} className="text-gray-800 hover:underline font-medium">
          ← Back to jobs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/jobs')} className="mb-6 text-gray-800 hover:text-gray-600 font-medium">
        ← Back to jobs
      </button>

      <div className="bg-white rounded-lg shadow p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-lg text-gray-600 mt-1">{job.company}</p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded font-medium">{job.sector}</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded font-medium">{job.jobType}</span>
            {job.salary && <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded font-medium">{job.salary}</span>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-600">📍 Location</p>
            <p className="font-semibold">{job.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">📅 Posted</p>
            <p className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">⏰ Application Deadline</p>
            <p className="font-semibold">{new Date(job.deadline).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">About this role</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.requirements.split('\n').map((req, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-2">
                <span className="inline-block w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0"></span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {user && user.role === 'user' ? (
            <>
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`px-6 py-3 font-semibold rounded-lg transition ${
                  hasApplied
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-lg'
                }`}
              >
                {hasApplied ? '✓ Already Applied' : 'Apply Now'}
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                Save for later
              </button>
            </>
          ) : user && user.role === 'company' ? (
            <div className="w-full">
              <p className="text-gray-600 mb-3">Companies cannot apply for jobs. Switch to a job seeker account to apply.</p>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-gray-600 mb-3">Log in as a job seeker to apply</p>
              <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:shadow-lg transition">
                Log In to Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
