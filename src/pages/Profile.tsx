import React, { useState, useEffect } from 'react'

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
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      return JSON.parse(localStorage.getItem('djc-profile') || 'null') || {
        name: '',
        email: '',
        phone: '',
        location: '',
        headline: '',
        bio: '',
        roleTags: ['jobseeker'],
        skills: [],
        experience: '',
        education: '',
        portfolio: '',
        avatar: '/assets/Black American professionals in career.png'
      }
    } catch (e) {
      return {
        name: '',
        email: '',
        phone: '',
        location: '',
        headline: '',
        bio: '',
        roleTags: ['jobseeker'],
        skills: [],
        experience: '',
        education: '',
        portfolio: '',
        avatar: '/assets/Black American professionals in career.png'
      }
    }
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem('djc-profile', JSON.stringify(profile))
  }, [profile])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Your Professional Profile</h1>
        <p className="text-pink-100">Complete your profile to unlock more opportunities</p>
      </div>

      {saved && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <p className="text-green-700 font-semibold">✓ Profile saved successfully!</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Photo Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <img src={profile.avatar} alt={profile.name || 'Profile'} className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200" />
            <div className="flex-1">
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string
                        setProfile({ ...profile, avatar: base64 })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <p className="text-xs text-gray-600">JPG or PNG (Max 5MB)</p>
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
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          <label className="block mb-2 font-semibold text-gray-700">Email *</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          <label className="block mb-2 font-semibold text-gray-700">Phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-700">Location</label>
          <input
            type="text"
            placeholder="City, Country"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
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
            value={profile.headline}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-700">Role</label>
          <select
            value={profile.roleTags[0] || 'jobseeker'}
            onChange={(e) => setProfile({ ...profile, roleTags: [e.target.value] })}
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
            value={profile.experience}
            onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* About & Bio */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">About You</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Bio</label>
          <textarea
            placeholder="Tell us about yourself, your career goals, and what you're looking for..."
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4 min-h-24"
            maxLength={500}
          />
          <p className="text-sm text-gray-600">{(profile.bio || '').length}/500 characters</p>
        </div>

        {/* Skills & Education */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">Skills</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Skills (comma separated)</label>
          <textarea
            placeholder="JavaScript, React, Python, SQL, etc."
            value={profile.skills.join(', ')}
            onChange={(e) => setProfile({
              ...profile,
              skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)
            })}
            className="w-full p-2 border border-gray-300 rounded min-h-20"
          />
          
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold cursor-pointer hover:bg-pink-200"
                onClick={() => setProfile({
                  ...profile,
                  skills: profile.skills.filter((s: string) => s !== skill)
                })}
              >
                {skill} ×
              </span>
            ))}
          </div>
        </div>

        {/* Education & Portfolio */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 border-b pb-3">Education & Links</h3>
          
          <label className="block mb-2 font-semibold text-gray-700">Education</label>
          <input
            type="text"
            placeholder="e.g., Bachelor's in Computer Science, University Name"
            value={profile.education}
            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-700">Portfolio/Website</label>
          <input
            type="url"
            placeholder="https://yourportfolio.com"
            value={profile.portfolio}
            onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-semibold rounded-lg hover:shadow-lg transition"
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
      <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
        <h3 className="font-bold text-lg mb-3">Profile Completeness</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={profile.name ? '✓' : '○'}>Full Name:</span>
            <span className={profile.name ? 'text-green-600 font-semibold' : 'text-gray-500'}>{profile.name ? 'Complete' : 'Incomplete'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={profile.email ? '✓' : '○'}>Email:</span>
            <span className={profile.email ? 'text-green-600 font-semibold' : 'text-gray-500'}>{profile.email ? 'Complete' : 'Incomplete'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={profile.headline ? '✓' : '○'}>Headline:</span>
            <span className={profile.headline ? 'text-green-600 font-semibold' : 'text-gray-500'}>{profile.headline ? 'Complete' : 'Incomplete'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={profile.skills && profile.skills.length > 0 ? '✓' : '○'}>Skills:</span>
            <span className={profile.skills && profile.skills.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}>{profile.skills && profile.skills.length > 0 ? `${profile.skills.length} skill(s)` : 'Incomplete'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}