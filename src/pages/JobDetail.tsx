import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Job = {
  id: string
  title: string
  company: string
  logoUrl?: string
  description?: string
  requirements?: string[]
  sector?: string
  location?: { county?: string; town?: string }
  remote?: boolean
  postedAt?: string
}

type JobResponse = { job: Job | null }

async function fetchJob(id: string): Promise<JobResponse> {
  const res = await axios.get(`/api/jobs/${id}`)
  return res.data
}

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery<JobResponse, Error>({ 
    queryKey: ['job', id], 
    queryFn: () => fetchJob(id as string), 
    enabled: !!id 
  })

  if (isLoading) return <div className="text-center py-8">Loading job details...</div>
  
  const job = data?.job
  if (!job) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Job not found</h2>
      <button onClick={() => navigate('/jobs')} className="text-pink-600 hover:underline">
        ← Back to jobs
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate('/jobs')} className="mb-6 text-pink-600 hover:text-pink-800 font-medium">
        ← Back to jobs
      </button>

      <div className="bg-white rounded-lg shadow p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <img src={job.logoUrl} alt={job.company} className="w-20 h-20 rounded object-cover" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded font-medium">{job.sector}</span>
              {job.remote && <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded font-medium">Remote</span>}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-semibold">{job.location?.county || job.location?.town || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Posted</p>
            <p className="font-semibold">{job.postedAt}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Job Type</p>
            <p className="font-semibold">{job.remote ? 'Remote' : 'On-site'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">About this role</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements?.map((req: string) => (
              <li key={req} className="flex items-center gap-3 text-gray-700">
                <span className="inline-block w-2 h-2 bg-pink-600 rounded-full"></span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition">
            Apply Now
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
            Save for later
          </button>
        </div>
      </div>
    </div>
  )
}
