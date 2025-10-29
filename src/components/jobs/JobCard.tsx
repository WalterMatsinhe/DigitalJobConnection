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
  const jobImageUrl = jobImages[job.sector] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&auto=format&fit=crop'
  
  return (
    <Card className="transition hover:shadow-xl hover:-translate-y-1 overflow-hidden">
      <div className="flex flex-col md:flex-row items-start gap-5">
        {/* Image */}
        <div className="w-full md:w-32 md:h-32 shrink-0">
          <img 
            src={jobImageUrl} 
            alt={job.title} 
            className="w-full h-32 md:h-32 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg text-gray-900">
                  <Link to={`/jobs/${job.id}`} className="hover:text-blue-600 transition">
                    {job.title}
                  </Link>
                </h3>
                {job.remote && <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">🌍 Remote</span>}
              </div>
              <p className="text-sm text-gray-600 mt-1.5 font-medium">{job.company}</p>
              <p className="text-sm text-gray-500 mt-0.5">📍 {job.location?.county || job.location?.town}</p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap shrink-0">{job.postedAt}</div>
          </div>

          <p className="mt-4 text-gray-700 text-sm line-clamp-2 leading-relaxed">{job.description}</p>

          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex gap-2 text-xs flex-wrap">
              {(job.requirements || []).slice(0,4).map((r: string) => (
                <span key={r} className="px-2.5 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium">{r}</span>
              ))}
              {job.requirements?.length > 4 && (
                <span className="px-2.5 py-1.5 text-gray-600 font-medium">+{job.requirements.length - 4} more</span>
              )}
            </div>

            <Link to={`/jobs/${job.id}`} className="px-5 py-2 font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition">
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
