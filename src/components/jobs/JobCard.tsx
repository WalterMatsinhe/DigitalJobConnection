import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'

const jobImages: { [key: string]: string } = {
  'IT': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop',
  'Finance': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
  'Sales': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop',
  'Logistics': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
  'Agriculture': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?q=80&w=300&auto=format&fit=crop'
}

export default function JobCard({ job }: { job: any }) {
  // Ensure we have a valid job ID
  const jobId = job._id
  if (!jobId) {
    console.error('JobCard: No valid job ID found', job)
    return null
  }
  
  console.log('JobCard rendering job:', { id: jobId, title: job.title })
  
  const jobImageUrl = jobImages[job.sector] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop'
  
  // Handle different data structures for company logo
  let companyLogo = jobImageUrl
  if (job.companyId) {
    if (typeof job.companyId === 'object' && job.companyId.logo) {
      companyLogo = job.companyId.logo
    } else if (typeof job.companyId === 'string') {
      // If companyId is just a string, use sector image as fallback
      companyLogo = jobImageUrl
    }
  }

  // Parse requirements - handle both string and array formats
  const requirementsArray = typeof job.requirements === 'string' 
    ? job.requirements.split(',').map((r: string) => r.trim()).filter(Boolean)
    : Array.isArray(job.requirements) 
    ? job.requirements 
    : []
  
  return (
    <Card className="transition hover:shadow-xl overflow-hidden border border-gray-200">
      <div className="flex gap-5 items-start p-5">
        {/* Company Logo - Large */}
        <div className="shrink-0 pt-1">
          <img 
            src={companyLogo} 
            alt={job.company} 
            className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
            onError={(e) => {
              // Fallback to sector image if logo fails to load
              (e.target as HTMLImageElement).src = jobImageUrl
            }}
          />
        </div>

        {/* Job Details - Well Organized */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">
                <Link to={`/jobs/${jobId}`} className="hover:text-blue-600 transition">
                  {job.title}
                </Link>
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                <span>📍 {job.location?.county || job.location?.town || job.location}</span>
                <span>•</span>
                <span>💼 {job.jobType || 'Full-time'}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{job.company}</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full shrink-0 whitespace-nowrap bg-green-100 text-green-800">
              Active
            </span>
          </div>

          {/* Job Description */}
          <p className="mt-3 text-sm text-gray-700 line-clamp-2">{job.description}</p>

          {/* Skills/Requirements */}
          <div className="mt-3 flex gap-2 text-xs flex-wrap">
            {requirementsArray.slice(0, 3).map((r: string) => (
              <span key={r} className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                {r}
              </span>
            ))}
            {requirementsArray.length > 3 && (
              <span className="px-2.5 py-1 text-gray-600 font-medium">
                +{requirementsArray.length - 3} more
              </span>
            )}
          </div>

          {/* Salary if available */}
          {job.salary && (
            <div className="mt-3 p-3  bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-900 font-medium">
                💰 {job.salary}
              </p>
            </div>
          )}

          {/* Action Button */}
          <Link 
            to={`/jobs/${jobId}`} 
            className="inline-block mt-4 px-4 py-2 text-sm border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium text-blue-600"
          >
            View Details →
          </Link>
        </div>
      </div>
    </Card>
  )
}
