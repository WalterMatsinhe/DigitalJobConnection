import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface JobPosting {
  id: string
  title: string
  company: string
  sector: string
  location: string
  jobType: string
  description: string
  requirements: string
  salary: string
  deadline: string
  postedBy: string
  createdAt: string
}

export default function PostJob() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    sector: 'IT',
    location: '',
    jobType: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    deadline: '',
    postedBy: ''
  })

  const [posted, setPosted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Job title is required')
      return
    }
    if (!formData.company.trim()) {
      setError('Company name is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Job description is required')
      return
    }
    if (!formData.requirements.trim()) {
      setError('Requirements are required')
      return
    }
    if (!formData.deadline) {
      setError('Application deadline is required')
      return
    }

    // Create job posting
    const newJob: JobPosting = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    }

    // Store in localStorage
    try {
      const existingJobs = JSON.parse(localStorage.getItem('djc-posted-jobs') || '[]')
      const updatedJobs = [...existingJobs, newJob]
      localStorage.setItem('djc-posted-jobs', JSON.stringify(updatedJobs))
      
      setPosted(true)
      setTimeout(() => {
        navigate('/jobs')
      }, 2000)
    } catch (err) {
      setError('Failed to post job. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
        <p className="text-white">Fill in the details below to post a job opportunity</p>
      </div>

      {posted && (
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
          <h3 className="text-green-700 font-bold text-lg">✓ Job Posted Successfully!</h3>
          <p className="text-green-600 mt-2">Your job posting has been created. Redirecting to jobs page...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
          <h3 className="text-red-700 font-bold text-lg">✗ Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      )}

      {!posted && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Job Title */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-3">Basic Information</h3>
              
              <label className="block mb-2 font-semibold text-gray-700">Job Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Junior Software Developer"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />

              <label className="block mb-2 font-semibold text-gray-700">Company Name *</label>
              <input
                type="text"
                name="company"
                placeholder="e.g., Tech Innovations Ltd"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />

              <label className="block mb-2 font-semibold text-gray-700">Your Name/Email *</label>
              <input
                type="text"
                name="postedBy"
                placeholder="Your contact information"
                value={formData.postedBy}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-3">Job Details</h3>

              <label className="block mb-2 font-semibold text-gray-700">Sector *</label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="IT">IT & Technology</option>
                <option value="Finance">Finance & Accounting</option>
                <option value="Sales">Sales & Marketing</option>
                <option value="Logistics">Logistics</option>
                <option value="Agriculture">Agriculture & Rural Dev</option>
                <option value="Other">Other</option>
              </select>

              <label className="block mb-2 font-semibold text-gray-700">Job Type *</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>

              <label className="block mb-2 font-semibold text-gray-700">Location *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Nairobi, Kenya"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-3">Job Description</h3>

              <label className="block mb-2 font-semibold text-gray-700">Description *</label>
              <textarea
                name="description"
                placeholder="Describe the job role, responsibilities, and what the successful candidate will do..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mb-4 min-h-24"
                maxLength={1000}
                required
              />
              <p className="text-sm text-gray-600 mb-4">{formData.description.length}/1000 characters</p>

              <label className="block mb-2 font-semibold text-gray-700">Requirements *</label>
              <textarea
                name="requirements"
                placeholder="List the required skills, qualifications, and experience..."
                value={formData.requirements}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded min-h-24"
                maxLength={1000}
                required
              />
              <p className="text-sm text-gray-600">{formData.requirements.length}/1000 characters</p>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-3">Additional Information</h3>

              <label className="block mb-2 font-semibold text-gray-700">Salary (Optional)</label>
              <input
                type="text"
                name="salary"
                placeholder="e.g., 30,000 - 50,000 KES/month"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Deadline */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 border-b pb-3">Application Deadline</h3>

              <label className="block mb-2 font-semibold text-gray-700">Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <p className="text-sm text-gray-600 mt-2">When will applications close?</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              ✓ Post Job
            </button>
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
