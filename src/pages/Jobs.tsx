import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import JobCard from '../components/jobs/JobCard'

type JobsResponse = { jobs: any[] }

async function fetchJobs(q?: string): Promise<JobsResponse> {
  const params = q ? `?q=${encodeURIComponent(q)}` : ''
  const res = await axios.get(`/api/jobs${params}`)
  return res.data
}

const JOB_SECTORS = ['All', 'IT', 'Finance', 'Sales', 'Logistics', 'Agriculture']

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('All')
  const { data, isLoading } = useQuery<JobsResponse, Error>({ 
    queryKey: ['jobs', searchQuery], 
    queryFn: () => fetchJobs(searchQuery) 
  })

  const filteredJobs = data?.jobs?.filter((job: any) => {
    if (selectedSector === 'All') return true
    return job.sector === selectedSector
  }) || []

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Next Opportunity</h1>
        <p className="text-gray-600 text-lg">Search from hundreds of jobs, internships and training programs</p>
      </div>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by job title, company, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 text-lg transition"
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
                  ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      )}
      
      {!isLoading && filteredJobs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-600 font-medium">No jobs found</p>
          <p className="text-gray-500 mt-2">Try a different search or sector filter</p>
        </div>
      )}

      {!isLoading && filteredJobs.length > 0 && (
        <>
          <p className="text-sm font-semibold text-gray-600 mb-6">Found <span className="text-blue-600">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}</p>
          <div className="grid gap-4">
            {filteredJobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
