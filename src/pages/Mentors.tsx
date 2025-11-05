import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UsersResponse = { users: any[] }

async function fetchMentors(): Promise<UsersResponse> {
  const res = await axios.get('/api/users?role=mentor')
  return res.data
}

const mentorImages: { [key: string]: string } = {
  'Peter Mwangi': '/assets/MentorOne.png',
  'Grace Kipchoge': '/assets/MentorTwo.png',
  'James Ochieng': '/assets/MentorThree.png'
}

export default function Mentors() {
  const { data, isLoading, error } = useQuery<UsersResponse, Error>({ queryKey: ['mentors'], queryFn: fetchMentors })
  
  if (isLoading) return <div className="text-center py-16"><div className="inline-block">⏳ Loading mentors...</div></div>
  
  if (error) return <div className="text-center py-16 text-red-600"><div className="inline-block">❌ Error loading mentors: {error.message}</div></div>
  
  if (!data || !data.users) return <div className="text-center py-16"><div className="inline-block">No mentor data available</div></div>

  return (
    <div>
      <div className="mb-12 bg-gradient-to-r from-gray-800 to-gray-600 rounded-3xl p-10 text-white">
        <h1 className="text-4xl font-bold mb-3">Find Your Mentor</h1>
        <p className="text-gray-100 text-lg max-w-2xl">Connect with experienced professionals who've achieved success in their fields. Get personalized guidance to accelerate your career.</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data && data.users && data.users.length > 0 ? (
          data.users.map((m: any) => {
            const imageUrl = mentorImages[m.name] || '/assets/Black American professionals in career.png'
            
            return (
            <div key={m.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-400 to-gray-600 overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={m.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-800 font-semibold mt-1">
                  {m.yearsExperience}+ years experience
                </p>
                
                <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {m.bio || 'Passionate about helping the next generation of professionals succeed in their careers.'}
                </p>
                
                <div className="mt-5">
                  <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {(m.skills || []).map((s: string) => (
                      <span key={s} className="px-3 py-1.5 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:shadow-lg transition">
                    ✉️ Request
                  </button>
                  <button className="flex-1 px-4 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition">
                    📅 Schedule
                  </button>
                </div>
              </div>
            </div>
          )
        })
        ) : (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-900">No mentors available yet</h3>
            <p className="text-gray-600 mt-2">Check back soon for amazing mentors!</p>
          </div>
        )}
      </div>
    </div>
  )
}
