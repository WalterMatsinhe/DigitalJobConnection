/**
 * Mock Database - In-Memory Storage
 * Used when MongoDB is not available or not configured
 */

const mockDb = {
  users: {
    'mentor1@example.com': {
      _id: '1',
      id: '1',
      name: 'Peter Mwangi',
      email: 'peter@example.com',
      role: 'user',
      yearsExperience: 8,
      headline: 'Senior Software Engineer',
      bio: 'Passionate about helping the next generation of professionals succeed in their careers. Specialized in full-stack development and cloud architecture.',
      skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
      location: 'Nairobi, Kenya',
      avatar: '/assets/MentorOne.png'
    },
    'mentor2@example.com': {
      _id: '2',
      id: '2',
      name: 'Grace Kipchoge',
      email: 'grace@example.com',
      role: 'user',
      yearsExperience: 10,
      headline: 'Product Manager & Business Strategist',
      bio: 'Dedicated to mentoring young professionals in product management and business strategy. Love building products that make a difference.',
      skills: ['Product Management', 'Business Strategy', 'Leadership', 'Analytics'],
      location: 'Kampala, Uganda',
      avatar: '/assets/MentorTwo.png'
    },
    'mentor3@example.com': {
      _id: '3',
      id: '3',
      name: 'James Ochieng',
      email: 'james@example.com',
      role: 'user',
      yearsExperience: 12,
      headline: 'Data Science Lead & AI Expert',
      bio: 'Expert in machine learning and data science with passion for mentoring. Helping professionals transition into tech roles.',
      skills: ['Python', 'Machine Learning', 'Data Analytics', 'TensorFlow'],
      location: 'Dar es Salaam, Tanzania',
      avatar: '/assets/MentorThree.png'
    }
  },
  companies: {},
  jobs: {},
  applications: {},

  // User operations
  addUser(email, userData) {
    this.users[email] = userData
    return userData
  },

  getUser(email) {
    return this.users[email]
  },

  getUserById(id) {
    return Object.values(this.users).find(u => u._id === id)
  },

  updateUser(email, updateData) {
    if (this.users[email]) {
      this.users[email] = { ...this.users[email], ...updateData }
      return this.users[email]
    }
    return null
  },

  getAllUsers() {
    return Object.values(this.users)
  },

  deleteUser(email) {
    delete this.users[email]
  },

  // Company operations
  addCompany(email, companyData) {
    this.companies[email] = companyData
    return companyData
  },

  getCompany(email) {
    return this.companies[email]
  },

  getCompanyById(id) {
    return Object.values(this.companies).find(c => c._id === id)
  },

  updateCompany(email, updateData) {
    if (this.companies[email]) {
      this.companies[email] = { ...this.companies[email], ...updateData }
      return this.companies[email]
    }
    return null
  },

  getAllCompanies() {
    return Object.values(this.companies)
  },

  deleteCompany(email) {
    delete this.companies[email]
  },

  // Job operations
  addJob(jobId, jobData) {
    this.jobs[jobId] = jobData
    return jobData
  },

  getJob(jobId) {
    return this.jobs[jobId]
  },

  getAllJobs() {
    return Object.values(this.jobs)
  },

  getJobsByCompany(companyId) {
    const companyIdStr = String(companyId)
    return Object.values(this.jobs).filter(j => String(j.companyId) === companyIdStr)
  },

  updateJob(jobId, updateData) {
    if (this.jobs[jobId]) {
      this.jobs[jobId] = { ...this.jobs[jobId], ...updateData }
      return this.jobs[jobId]
    }
    return null
  },

  deleteJob(jobId) {
    delete this.jobs[jobId]
  },

  // Application operations
  addApplication(appId, appData) {
    this.applications[appId] = appData
    return appData
  },

  getApplication(appId) {
    return this.applications[appId]
  },

  getAllApplications() {
    return Object.values(this.applications)
  },

  getApplicationsByUser(userId) {
    return Object.values(this.applications).filter(a => a.userId === userId)
  },

  getApplicationsByJob(jobId) {
    return Object.values(this.applications).filter(a => a.jobId === jobId)
  },

  getApplicationsByCompany(companyId) {
    const companyJobs = Object.values(this.jobs).filter(j => j.companyId === companyId)
    const jobIds = companyJobs.map(j => j._id)
    return Object.values(this.applications).filter(a => jobIds.includes(a.jobId))
  },

  updateApplication(appId, updateData) {
    if (this.applications[appId]) {
      this.applications[appId] = { ...this.applications[appId], ...updateData }
      return this.applications[appId]
    }
    return null
  },

  deleteApplication(appId) {
    delete this.applications[appId]
  },

  // Clear all data
  clear() {
    this.users = {}
    this.companies = {}
    this.jobs = {}
    this.applications = {}
  }
}

module.exports = mockDb
