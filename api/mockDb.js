/**
 * Mock Database - In-Memory Storage
 * Used when MongoDB is not available or not configured
 */

const mockDb = {
  users: {},
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
