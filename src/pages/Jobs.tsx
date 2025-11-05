import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/jobs/JobCard'

interface Job {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  sector: string
  salary: string
  description: string
  createdAt: string
}

const JOB_SECTORS = ['All', 'IT', 'Finance', 'Sales', 'Logistics', 'Agriculture', 'Other']

export default function Jobs() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('All')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [appliedJobs, setAppliedJobs] = useState(new Set<string>())

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/jobs')
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

    fetchJobs()
  }, [])

  // Fetch user applications if logged in
  useEffect(() => {
    if (user?.id && user?.role === 'user') {
      const fetchApplications = async () => {
        try {
          const response = await fetch(`/api/applications/user/${user.id}`)
          const data = await response.json()
          
          if (data.success) {
            setAppliedJobs(new Set(data.applications.map((a: any) => a.jobId)))
          }
        } catch (err) {
          console.error('Error fetching applications:', err)
        }
      }
      fetchApplications()
    }
  }, [user?.id, user?.role])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSector = selectedSector === 'All' || job.sector === selectedSector
    
    return matchesSearch && matchesSector
  })

  const handleApply = async (jobId: string) => {
    if (!user) {
      alert('Please log in to apply for jobs')
      return
    }

    if (user.role !== 'user') {
      alert('Only job seekers can apply for jobs')
      return
    }

    if (appliedJobs.has(jobId)) {
      alert('You have already applied for this job')
      return
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          coverLetter: ''
        })
      })

      const data = await response.json()

      if (data.success) {
        setAppliedJobs(new Set([...appliedJobs, jobId]))
        alert('Application submitted successfully!')
        
        // Refetch applications to keep UI in sync
        const appsResponse = await fetch(`/api/applications/user/${user.id}`)
        const appsData = await appsResponse.json()
        if (appsData.success) {
          setAppliedJobs(new Set(appsData.applications.map((a: any) => a.jobId)))
        }
      } else {
        alert(data.message || 'Failed to apply for job')
      }
    } catch (err: any) {
      alert(err.message || 'Error applying for job')
    }
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Next Opportunity</h1>
        <p className="text-gray-600 text-lg">Search from hundreds of jobs, internships and training programs</p>
      </div>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-100 text-lg transition"
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-4">Filter by Sector:</p>
        <div className="flex flex-wrap gap-3">
          {JOB_SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-6 py-2.5 rounded-full font-semibold transition ${
                selectedSector === sector
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center py-12 bg-red-50 rounded-xl">
          <p className="text-xl text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      )}
      
      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-600 font-medium">No jobs found</p>
          <p className="text-gray-500 mt-2">Try a different search or sector filter</p>
        </div>
      )}

      {!loading && filteredJobs.length > 0 && (
        <>
          <p className="text-sm font-semibold text-gray-600 mb-6">Found <span className="text-gray-800">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}</p>
          <div className="space-y-4">
            {filteredJobs.map((job: Job) => {
              const jobId = job._id || job.id
              return (
                <div key={jobId} className="relative">
                  <JobCard job={{...job, _id: jobId}} />
                  
                  {/* Action Buttons Below Card */}
                  <div className="flex gap-3 mt-2 px-5">
                    {user?.role === 'user' ? (
                      <>
                        <button
                          onClick={() => handleApply(jobId)}
                          disabled={appliedJobs.has(jobId)}
                          className={`px-6 py-2 rounded-lg font-semibold transition ${
                            appliedJobs.has(jobId)
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-md'
                          }`}
                        >
                          {appliedJobs.has(jobId) ? '✓ Applied' : 'Apply Now'}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
