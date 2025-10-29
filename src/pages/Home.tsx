import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-700">opportunities</span>
          </h1>
          <p className="mt-6 text-lg text-gray-700 max-w-xl leading-relaxed">
            Discover jobs, mentorship and training opportunities — faster and with more transparency. Your career journey starts here.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link to="/jobs" className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg font-semibold hover:shadow-lg transition shadow-md">
              Search Jobs
            </Link>
            <Link to="/mentors" className="px-8 py-3 border-2 border-pink-600 text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition">
              Find a Mentor
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <img 
              src="/assets/Black American professionals in career.png" 
              alt="Black American professionals in career" 
              className="w-full h-96 object-cover hover:scale-105 transition duration-300"
            />
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white">
              <h3 className="font-bold text-xl">Unlock Your Potential</h3>
              <p className="text-pink-100 text-sm mt-2">Join our community and explore amazing career opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-3 gap-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="text-4xl font-bold text-pink-600">500+</div>
          <p className="text-gray-700 mt-2 font-medium">Active Jobs</p>
        </div>
        <div className="text-center border-l border-r border-gray-200">
          <div className="text-4xl font-bold text-pink-600">100+</div>
          <p className="text-gray-700 mt-2 font-medium">Expert Mentors</p>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-pink-600">50K+</div>
          <p className="text-gray-700 mt-2 font-medium">Users Helped</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link to="/jobs" className="group p-6 bg-white rounded-xl shadow hover:shadow-lg transition border-l-4 border-pink-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition">
                <span className="text-2xl group-hover:text-white transition">🔍</span>
              </div>
              <span className="font-bold text-gray-400">01</span>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition">Search Jobs</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Find entry-level jobs, internships and traineeships tailored to your skills and location.</p>
          </Link>

          <Link to="/mentors" className="group p-6 bg-white rounded-xl shadow hover:shadow-lg transition border-l-4 border-pink-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition">
                <span className="text-2xl group-hover:text-white transition">👥</span>
              </div>
              <span className="font-bold text-gray-400">02</span>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition">Connect with Mentors</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Get guidance from experienced professionals who've walked the path you're on.</p>
          </Link>

          <Link to="/profile" className="group p-6 bg-white rounded-xl shadow hover:shadow-lg transition border-l-4 border-pink-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition">
                <span className="text-2xl group-hover:text-white transition">📈</span>
              </div>
              <span className="font-bold text-gray-400">03</span>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition">Grow Your Career</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Build your profile, showcase your skills, and track your professional growth journey.</p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
        <p className="text-pink-100 mb-8 max-w-2xl mx-auto text-lg">Join thousands of Kenyan youth finding meaningful opportunities and mentorship.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/jobs" className="px-8 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition">
            Start Exploring
          </Link>
          <Link to="/profile" className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
            Create Profile
          </Link>
        </div>
      </section>
    </div>
  )
}
