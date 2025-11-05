// In-memory storage for testing when MongoDB isn't available
const users = new Map()
const companies = new Map()
const jobs = new Map()
const applications = new Map()
const usersById = new Map() // Map to store users by ID
const companiesById = new Map() // Map to store companies by ID

module.exports = {
  users,
  companies,
  jobs,
  applications,
  // User methods
  addUser: (email, data) => {
    users.set(email, data)
    if (data._id) {
      usersById.set(data._id.toString(), data)
    }
  },
  getUser: (identifier) => {
    // Try to get by email first, then by ID
    let user = users.get(identifier)
    if (!user && identifier) {
      user = usersById.get(identifier.toString())
    }
    return user
  },
  getUserById: (userId) => usersById.get(userId.toString()),
  userExists: (email) => users.has(email),
  updateUser: (userId, updateData) => {
    const user = usersById.get(userId.toString())
    if (user) {
      const updated = { ...user, ...updateData, _id: user._id }
      usersById.set(userId.toString(), updated)
      users.set(user.email, updated)
      return updated
    }
    return null
  },
  // Company methods
  addCompany: (email, data) => {
    companies.set(email, data)
    if (data._id) {
      companiesById.set(data._id.toString(), data)
    }
  },
  getCompany: (identifier) => {
    // Try to get by email first, then by ID
    let company = companies.get(identifier)
    if (!company && identifier) {
      company = companiesById.get(identifier.toString())
    }
    return company
  },
  getCompanyById: (companyId) => companiesById.get(companyId.toString()),
  companyExists: (email) => companies.has(email),
  updateCompany: (companyId, updateData) => {
    const company = companiesById.get(companyId.toString())
    if (company) {
      const updated = { ...company, ...updateData, _id: company._id }
      companiesById.set(companyId.toString(), updated)
      companies.set(company.email, updated)
      return updated
    }
    return null
  },
  // Job methods
  addJob: (jobData) => {
    const id = jobData._id || Date.now().toString()
    jobs.set(id, { ...jobData, _id: id })
    return jobs.get(id)
  },
  getJob: (jobId) => jobs.get(jobId),
  getAllJobs: () => Array.from(jobs.values()),
  getJobsByCompany: (companyId) => {
    return Array.from(jobs.values()).filter(job => job.companyId === companyId)
  },
  updateJob: (jobId, updateData) => {
    const job = jobs.get(jobId)
    if (job) {
      const updated = { ...job, ...updateData, _id: jobId }
      jobs.set(jobId, updated)
      return updated
    }
    return null
  },
  deleteJob: (jobId) => {
    return jobs.delete(jobId)
  },
  // Application methods
  addApplication: (appData) => {
    const id = appData._id || Date.now().toString()
    applications.set(id, { ...appData, _id: id })
    return applications.get(id)
  },
  getApplicationsByJob: (jobId) => {
    return Array.from(applications.values()).filter(app => app.jobId === jobId)
  },
  getApplicationsByUser: (userId) => {
    return Array.from(applications.values()).filter(app => app.userId === userId)
  },
  updateApplication: (applicationId, updateData) => {
    const application = applications.get(applicationId)
    if (application) {
      const updated = { ...application, ...updateData, _id: applicationId }
      applications.set(applicationId, updated)
      return updated
    }
    return null
  }
}
