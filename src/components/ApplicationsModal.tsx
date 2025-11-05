import React, { useState, useEffect } from 'react'

interface UserDetail {
  _id: string
  name: string
  email: string
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

interface Application {
  _id: string
  userId: string | UserDetail
  userName: string
  userEmail: string
  jobId: string
  status: string
  coverLetter: string
  appliedAt: string
}

interface ApplicationsModalProps {
  jobId: string
  jobTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function ApplicationsModal({ jobId, jobTitle, isOpen, onClose }: ApplicationsModalProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && jobId) {
      fetchApplications()
    }
  }, [isOpen, jobId])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`/api/applications/job/${jobId}`)
      const data = await response.json()
      
      if (data.success) {
        setApplications(data.applications || [])
      } else {
        setError(data.message || 'Failed to fetch applications')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading applications')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      
      if (data.success) {
        setApplications(applications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        ))
      } else {
        alert(data.message || 'Failed to update application status')
      }
    } catch (err: any) {
      alert('Error updating application status')
    }
  }

  const getUserData = (userId: string | UserDetail): UserDetail | null => {
    if (typeof userId === 'string') {
      return null
    }
    return userId as UserDetail
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Applications</h2>
            <p className="text-gray-200 mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded text-red-600">
              {error}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const userData = getUserData(app.userId)
                const isExpanded = expandedAppId === app._id
                
                return (
                  <div key={app._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    {/* Summary */}
                    <div
                      onClick={() => setExpandedAppId(isExpanded ? null : app._id)}
                      className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{app.userName}</h3>
                          <p className="text-sm text-gray-600">{app.userEmail}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 text-xs font-semibold rounded ${
                            app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            app.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {app.status}
                          </span>
                          <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 p-4 bg-white">
                    {/* Basic Info */}
                    {userData ? (
                      <>
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span>👤</span> User Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                            <div>
                              <p className="text-xs text-gray-600 font-semibold">📧 Email</p>
                              <p className="text-sm text-gray-800 break-all">{userData.email || 'N/A'}</p>
                            </div>
                            {userData.phone && (
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">📞 Phone</p>
                                <p className="text-sm text-gray-800">{userData.phone || 'N/A'}</p>
                              </div>
                            )}
                            {userData.location && (
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">📍 Location</p>
                                <p className="text-sm text-gray-800">{userData.location || 'N/A'}</p>
                              </div>
                            )}
                            {userData.headline && (
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-600 font-semibold">💼 Headline</p>
                                <p className="text-sm text-gray-800">{userData.headline}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {userData.bio && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>📝</span> Bio
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded leading-relaxed">
                              {userData.bio}
                            </p>
                          </div>
                        )}

                        {/* Skills */}
                        {userData.skills && userData.skills.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🎯</span> Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {userData.skills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {userData.experience && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>💼</span> Experience
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded leading-relaxed whitespace-pre-wrap">
                              {userData.experience}
                            </p>
                          </div>
                        )}

                        {/* Education */}
                        {userData.education && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🎓</span> Education
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded leading-relaxed whitespace-pre-wrap">
                              {userData.education}
                            </p>
                          </div>
                        )}

                        {/* Portfolio */}
                        {userData.portfolio && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>🔗</span> Portfolio
                            </h4>
                            <a 
                              href={userData.portfolio} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline break-all"
                            >
                              {userData.portfolio}
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mb-6 p-4 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Applicant profile information not available yet. The user may need to complete their profile to show full details.
                        </p>
                      </div>
                    )}

                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                              <span>✉️</span> Cover Letter
                            </h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded leading-relaxed whitespace-pre-wrap">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => updateApplicationStatus(app._id, 'Accepted')}
                            disabled={app.status === 'Accepted'}
                            className={`px-4 py-2 text-sm font-semibold rounded transition ${
                              app.status === 'Accepted'
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                            }`}
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                            disabled={app.status === 'Rejected'}
                            className={`px-4 py-2 text-sm font-semibold rounded transition ${
                              app.status === 'Rejected'
                                ? 'bg-red-100 text-red-700 cursor-not-allowed'
                                : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                            }`}
                          >
                            ✕ Reject
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app._id, 'Reviewed')}
                            disabled={app.status === 'Reviewed'}
                            className={`px-4 py-2 text-sm font-semibold rounded transition ${
                              app.status === 'Reviewed'
                                ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                            }`}
                          >
                            👁 Review
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
