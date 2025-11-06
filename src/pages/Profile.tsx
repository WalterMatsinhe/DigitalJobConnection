import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import client from '../api/client'

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  headline: string
  bio: string
  roleTags: string[]
  skills: string[]
  experience: string
  education: string
  portfolio: string
  avatar: string
  cv: string
}

interface CompanyProfile {
  name: string
  email: string
  companyName: string
  industry: string
  website: string
  description: string
  location: string
  phone: string
  logo: string
  headline: string
  bio: string
  employees: number
  foundedYear: number
  social?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
}

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { addToast } = useToast()
  const [isCompany] = useState(user?.role === 'company')
  const [profile, setProfile] = useState<UserProfile | CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Initialize profile based on user role
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true)
        setError('')
        
        if (!user?.id) {
          setLoading(false)
          return
        }

        const endpoint = isCompany 
          ? `/profile/company/${user.id}` 
          : `/profile/user/${user.id}`
        
        const response = await client.get(endpoint)
        const data = response.data
        
        if (data.success) {
          const profileData = data.user || data.company
          if (isCompany) {
            setProfile({
              name: profileData.name || '',
              email: profileData.email || '',
              companyName: profileData.companyName || '',
              industry: profileData.industry || '',
              website: profileData.website || '',
              description: profileData.description || '',
              location: profileData.location || '',
              phone: profileData.phone || '',
              logo: profileData.logo || '/assets/company-default.png',
              headline: profileData.headline || '',
              bio: profileData.bio || '',
              employees: profileData.employees || 0,
              foundedYear: profileData.foundedYear || new Date().getFullYear(),
              social: {
                linkedin: profileData.social?.linkedin,
                twitter: profileData.social?.twitter,
                facebook: profileData.social?.facebook
              }
            } as CompanyProfile)
            // Sync logo to auth context if exists
            if (profileData.logo) {
              updateProfile({ logo: profileData.logo })
            }
          } else {
            setProfile({
              name: profileData.name || '',
              email: profileData.email || '',
              phone: profileData.phone || '',
              location: profileData.location || '',
              headline: profileData.headline || '',
              bio: profileData.bio || '',
              roleTags: profileData.roleTags || ['jobseeker'],
              skills: profileData.skills || [],
              experience: profileData.experience || '',
              education: profileData.education || '',
              portfolio: profileData.portfolio || '',
              avatar: profileData.avatar || '/assets/Black American professionals in career.png',
              cv: profileData.cv || ''
            } as UserProfile)
            // Sync avatar to auth context if exists
            if (profileData.avatar) {
              updateProfile({ avatar: profileData.avatar })
            }
          }
        } else {
          // Initialize with defaults if not found
          if (isCompany) {
            const defaultLogo = user?.logo || '/assets/company-default.png'
            setProfile({
              name: user?.name || '',
              email: user?.email || '',
              companyName: user?.companyName || '',
              industry: user?.industry || '',
              website: user?.website || '',
              description: user?.description || '',
              location: user?.location || '',
              phone: user?.phone || '',
              logo: defaultLogo,
              headline: user?.headline || '',
              bio: user?.bio || '',
              employees: user?.employees || 0,
              foundedYear: user?.foundedYear || new Date().getFullYear(),
              social: {
                linkedin: user?.social?.linkedin,
                twitter: user?.social?.twitter,
                facebook: user?.social?.facebook
              }
            } as CompanyProfile)
            if (defaultLogo) {
              updateProfile({ logo: defaultLogo })
            }
          } else {
            const defaultAvatar = user?.avatar || '/assets/Black American professionals in career.png'
            setProfile({
              name: user?.name || '',
              email: user?.email || '',
              phone: user?.phone || '',
              location: user?.location || '',
              headline: user?.headline || '',
              bio: user?.bio || '',
              roleTags: ['jobseeker'],
              skills: user?.skills || [],
              experience: user?.experience || '',
              education: user?.education || '',
              portfolio: user?.portfolio || '',
              avatar: defaultAvatar,
              cv: ''
            } as UserProfile)
            if (defaultAvatar) {
              updateProfile({ avatar: defaultAvatar })
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    initializeProfile()
  }, [user?.id, isCompany])

  const handleImageUpload = async (file: File, isLogo: boolean = false) => {
    if (!user?.id || !profile) return

    try {
      setUploadingImage(true)
      setError('')

      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageData = event.target?.result as string
        
        try {
          const endpoint = isLogo
            ? `/upload/logo/${user.id}`
            : `/upload/avatar/${user.id}`

          const response = await client.post(endpoint, {
            imageData: imageData,
            imageType: file.type
          })

          const data = response.data

          if (data.success) {
            // Update local profile with the uploaded image
            if (isLogo && isCompany) {
              setProfile({ ...profile as CompanyProfile, logo: data.logo })
              updateProfile({ logo: data.logo })
              addToast('Logo uploaded successfully!', 'success', 1500)
            } else if (!isLogo && !isCompany) {
              setProfile({ ...profile as UserProfile, avatar: data.avatar })
              updateProfile({ avatar: data.avatar })
              addToast('Profile photo uploaded successfully!', 'success', 1500)
            }
            setError('')
          } else {
            addToast(data.message || 'Failed to upload image', 'error')
          }
        } catch (err: any) {
          console.error('Error uploading image:', err)
          addToast('Error uploading image', 'error')
        } finally {
          setUploadingImage(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error('Error reading file:', err)
      addToast('Error reading file', 'error')
      setUploadingImage(false)
    }
  }

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError('')
      if (!user?.id) return

      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        addToast('Please upload a PDF or Word document (.pdf, .doc, .docx)', 'error')
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        addToast('File size must be less than 5MB', 'error')
        return
      }

      setUploadingImage(true)
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          const cvData = reader.result as string

          const response = await client.post(`/upload/cv/${user.id}`, {
            cvData: cvData,
            cvType: file.type,
            cvName: file.name
          })

          const data = response.data

          if (data.success) {
            // Update local profile with the uploaded CV
            setProfile({ ...profile as UserProfile, cv: file.name })
            addToast('CV uploaded successfully!', 'success', 1500)
            setError('')
          } else {
            addToast(data.message || 'Failed to upload CV', 'error')
          }
        } catch (err: any) {
          console.error('Error uploading CV:', err)
          addToast('Error uploading CV', 'error')
        } finally {
          setUploadingImage(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error('Error reading file:', err)
      addToast('Error reading file', 'error')
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    try {
      setError('')
      if (!user?.id || !profile) return

      // Don't send avatar/logo/cv data in profile save, they're uploaded separately
      const dataToSend = { ...profile }
      
      // Remove image/document fields - they're handled by separate upload endpoints
      if (isCompany) {
        delete (dataToSend as any).logo
      } else {
        delete (dataToSend as any).avatar
        delete (dataToSend as any).cv
      }

      const endpoint = isCompany 
        ? `/profile/company/${user.id}` 
        : `/profile/user/${user.id}`
      
      const response = await client.put(endpoint, dataToSend)

      const data = response.data

      if (data.success) {
        setSaved(true)
        addToast('Profile saved successfully!', 'success', 2000)
        setTimeout(() => setSaved(false), 2000)
      } else {
        addToast(data.message || 'Failed to save profile', 'error')
      }
    } catch (err: any) {
      console.error('Error saving profile:', err)
      addToast('Error saving profile', 'error')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    )
  }

  if (isCompany) {
    const companyProfile = profile as CompanyProfile
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Company Profile</h1>
          <p className="text-gray-100">Manage your company information</p>
        </div>

        {saved && (
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-700 font-semibold">✓ Profile saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-red-700 font-semibold">✗ {error}</p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Company Logo Section */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4">Company Logo</h3>
            <div className="flex items-center gap-6">
              <img src={companyProfile.logo} alt={companyProfile.companyName} className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200" />
              <div className="flex-1">
                <label className="block mb-2 font-semibold text-gray-700">Upload Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file, true)
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded mb-2 disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-600">{uploadingImage ? 'Uploading...' : 'JPG or PNG (Max 5MB)'}</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-3">Basic Information</h3>
            
            <label className="block mb-2 font-semibold text-gray-700">Contact Person Name *</label>
            <input
              type="text"
              value={companyProfile.name}
              onChange={(e) => setProfile({ ...companyProfile, name: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />

            <label className="block mb-2 font-semibold text-gray-700">Email *</label>
            <input
              type="email"
              value={companyProfile.email}
              disabled
              className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-100"
            />

            <label className="block mb-2 font-semibold text-gray-700">Phone</label>
            <input
              type="tel"
              value={companyProfile.phone}
              onChange={(e) => setProfile({ ...companyProfile, phone: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="+254 0000000"
            />

            <label className="block mb-2 font-semibold text-gray-700">Location</label>
            <input
              type="text"
              value={companyProfile.location}
              onChange={(e) => setProfile({ ...companyProfile, location: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="City, Country"
            />
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-3">Company Information</h3>
            
            <label className="block mb-2 font-semibold text-gray-700">Company Name *</label>
            <input
              type="text"
              value={companyProfile.companyName}
              onChange={(e) => setProfile({ ...companyProfile, companyName: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />

            <label className="block mb-2 font-semibold text-gray-700">Industry</label>
            <input
              type="text"
              value={companyProfile.industry}
              onChange={(e) => setProfile({ ...companyProfile, industry: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="e.g., Technology, Finance, Healthcare"
            />

            <label className="block mb-2 font-semibold text-gray-700">Website</label>
            <input
              type="url"
              value={companyProfile.website}
              onChange={(e) => setProfile({ ...companyProfile, website: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="https://yourcompany.com"
            />
          </div>

          {/* About Company */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-3">About Your Company</h3>
            
            <label className="block mb-2 font-semibold text-gray-700">Professional Headline</label>
            <input
              type="text"
              value={companyProfile.headline}
              onChange={(e) => setProfile({ ...companyProfile, headline: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="e.g., Leading Tech Innovator"
            />

            <label className="block mb-2 font-semibold text-gray-700">Company Description</label>
            <textarea
              value={companyProfile.description}
              onChange={(e) => setProfile({ ...companyProfile, description: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4 min-h-24"
              maxLength={500}
              placeholder="Tell us about your company, mission, and vision..."
            />
            <p className="text-sm text-gray-600">{(companyProfile.description || '').length}/500 characters</p>

            <label className="block mb-2 font-semibold text-gray-700 mt-4">Company Bio</label>
            <textarea
              value={companyProfile.bio}
              onChange={(e) => setProfile({ ...companyProfile, bio: e.target.value } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4 min-h-24"
              maxLength={500}
              placeholder="Additional information about your company..."
            />
            <p className="text-sm text-gray-600">{(companyProfile.bio || '').length}/500 characters</p>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-3">Additional Information</h3>
            
            <label className="block mb-2 font-semibold text-gray-700">Number of Employees</label>
            <input
              type="number"
              value={companyProfile.employees}
              onChange={(e) => setProfile({ ...companyProfile, employees: parseInt(e.target.value) || 0 } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="e.g., 150"
            />

            <label className="block mb-2 font-semibold text-gray-700">Founded Year</label>
            <input
              type="number"
              value={companyProfile.foundedYear}
              onChange={(e) => setProfile({ ...companyProfile, foundedYear: parseInt(e.target.value) } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={new Date().getFullYear().toString()}
            />
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-3">Social Links</h3>
            
            <label className="block mb-2 font-semibold text-gray-700">LinkedIn</label>
            <input
              type="url"
              value={companyProfile.social?.linkedin || ''}
              onChange={(e) => setProfile({ ...companyProfile, social: { ...companyProfile.social, linkedin: e.target.value } } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="https://linkedin.com/company/..."
            />

            <label className="block mb-2 font-semibold text-gray-700">Twitter</label>
            <input
              type="url"
              value={companyProfile.social?.twitter || ''}
              onChange={(e) => setProfile({ ...companyProfile, social: { ...companyProfile.social, twitter: e.target.value } } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="https://twitter.com/..."
            />

            <label className="block mb-2 font-semibold text-gray-700">Facebook</label>
            <input
              type="url"
              value={companyProfile.social?.facebook || ''}
              onChange={(e) => setProfile({ ...companyProfile, social: { ...companyProfile.social, facebook: e.target.value } } as CompanyProfile)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            ✓ Save Profile
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

        {/* Completion Status */}
        <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
          <h3 className="font-bold text-lg mb-3">Profile Completeness</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className={companyProfile.name ? '✓' : '○'}>Contact Person:</span>
              <span className={companyProfile.name ? 'text-green-600 font-semibold' : 'text-gray-500'}>{companyProfile.name ? 'Complete' : 'Incomplete'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={companyProfile.companyName ? '✓' : '○'}>Company Name:</span>
              <span className={companyProfile.companyName ? 'text-green-600 font-semibold' : 'text-gray-500'}>{companyProfile.companyName ? 'Complete' : 'Incomplete'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={companyProfile.industry ? '✓' : '○'}>Industry:</span>
              <span className={companyProfile.industry ? 'text-green-600 font-semibold' : 'text-gray-500'}>{companyProfile.industry ? 'Complete' : 'Incomplete'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={companyProfile.description ? '✓' : '○'}>Description:</span>
              <span className={companyProfile.description ? 'text-green-600 font-semibold' : 'text-gray-500'}>{companyProfile.description ? 'Complete' : 'Incomplete'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User Profile View
  const userProfile = profile as UserProfile
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Your Professional Profile</h1>
        <p className="text-gray-100">Complete your profile to unlock more opportunities</p>
      </div>

      {saved && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <p className="text-green-700 font-semibold">✓ Profile saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          <p className="text-red-700 font-semibold">✗ {error}</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Photo Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <img src={userProfile.avatar} alt={userProfile.name || 'Profile'} className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200" />
            <div className="flex-1">
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file, false)
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded mb-2 disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-600">{uploadingImage ? 'Uploading...' : 'JPG or PNG (Max 5MB)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">Personal Information</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Full Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            value={userProfile.name}
            onChange={(e) => setProfile({ ...userProfile, name: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          <label className="block mb-2 font-semibold text-gray-700">Email *</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={userProfile.email}
            disabled
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-100"
          />

          <label className="block mb-2 font-semibold text-gray-700">Phone</label>
          <input
            type="tel"
            placeholder="+254 0000000000"
            value={userProfile.phone}
            onChange={(e) => setProfile({ ...userProfile, phone: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-700">Location</label>
          <input
            type="text"
            placeholder="City, Country"
            value={userProfile.location}
            onChange={(e) => setProfile({ ...userProfile, location: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">Professional Information</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Professional Headline</label>
          <input
            type="text"
            placeholder="e.g., Junior Software Developer | Tech Enthusiast"
            value={userProfile.headline}
            onChange={(e) => setProfile({ ...userProfile, headline: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-700">Role</label>
          <select
            value={userProfile.roleTags[0] || 'jobseeker'}
            onChange={(e) => setProfile({ ...userProfile, roleTags: [e.target.value] } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="mentor">Mentor</option>
            <option value="recruiter">Recruiter</option>
            <option value="student">Student</option>
          </select>

          <label className="block mb-2 font-semibold text-gray-700">Years of Experience</label>
          <input
            type="text"
            placeholder="e.g., 2 years, Entry-level"
            value={userProfile.experience}
            onChange={(e) => setProfile({ ...userProfile, experience: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* About & Bio */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">About You</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Bio</label>
          <textarea
            placeholder="Tell us about yourself, your career goals, and what you're looking for..."
            value={userProfile.bio || ''}
            onChange={(e) => setProfile({ ...userProfile, bio: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded mb-4 min-h-24"
            maxLength={500}
          />
          <p className="text-sm text-gray-600">{(userProfile.bio || '').length}/500 characters</p>
        </div>

        {/* Skills & Education */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">Skills</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Add a Skill</label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              id="skillInput"
              placeholder="Type a skill name"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget as HTMLInputElement
                  const skillValue = input.value.trim()
                  if (skillValue && !userProfile.skills.includes(skillValue)) {
                    setProfile({
                      ...userProfile,
                      skills: [...userProfile.skills, skillValue]
                    })
                    input.value = ''
                  }
                  e.preventDefault()
                }
              }}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('skillInput') as HTMLInputElement
                const skillValue = input.value.trim()
                if (skillValue && !userProfile.skills.includes(skillValue)) {
                  setProfile({
                    ...userProfile,
                    skills: [...userProfile.skills, skillValue]
                  })
                  input.value = ''
                }
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded font-semibold hover:bg-gray-900"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-300"
                onClick={() => setProfile({
                  ...userProfile,
                  skills: userProfile.skills.filter((s: string) => s !== skill)
                })}
              >
                {skill} ×
              </span>
            ))}
          </div>
        </div>

        {/* CV Upload */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">CV/Resume</h3>
          
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">Upload Your CV</label>
            <p className="text-sm text-gray-600 mb-3">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="cvInput"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleCVUpload}
                disabled={uploadingImage}
                className="flex-1"
              />
              {userProfile.cv && (
                <div className="text-sm text-gray-700 font-semibold bg-gray-100 px-3 py-2 rounded">
                  ✓ {userProfile.cv}
                </div>
              )}
              {!userProfile.cv && (
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded">
                  No CV uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Education & Portfolio */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">Education & Links</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Education</label>
          <input
            type="text"
            placeholder="e.g., Bachelor's in Computer Science, University Name"
            value={userProfile.education}
            onChange={(e) => setProfile({ ...userProfile, education: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-700">Portfolio/Website</label>
          <input
            type="url"
            placeholder="https://yourportfolio.com"
            value={userProfile.portfolio}
            onChange={(e) => setProfile({ ...userProfile, portfolio: e.target.value } as UserProfile)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:shadow-lg transition"
        >
          ✓ Save Profile
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>

      {/* Completion Status */}
      <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
        <h3 className="font-bold text-lg mb-3">Profile Completeness</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={userProfile.name ? '✓' : '○'}>Full Name:</span>
            <span className={userProfile.name ? 'text-green-600 font-semibold' : 'text-gray-500'}>{userProfile.name ? 'Complete' : 'Incomplete'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={userProfile.email ? '✓' : '○'}>Email:</span>
            <span className={userProfile.email ? 'text-green-600 font-semibold' : 'text-gray-500'}>{userProfile.email ? 'Complete' : 'Incomplete'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={userProfile.headline ? '✓' : '○'}>Headline:</span>
            <span className={userProfile.headline ? 'text-green-600 font-semibold' : 'text-gray-500'}>{userProfile.headline ? 'Complete' : 'Incomplete'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={userProfile.skills && userProfile.skills.length > 0 ? '✓' : '○'}>Skills:</span>
            <span className={userProfile.skills && userProfile.skills.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}>{userProfile.skills && userProfile.skills.length > 0 ? `${userProfile.skills.length} skill(s)` : 'Incomplete'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}